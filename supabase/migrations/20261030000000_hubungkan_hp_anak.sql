-- Pintar Main — hubungkan HP anak ke HP orang tua dengan kode 6 angka, dan sinkron dua arah.
--
-- Cara kerja:
--  1. Orang tua (masuk dengan email) memanggil buat_kode_hubung(anak_ids) → kode 6 angka, berlaku 10 menit.
--  2. HP anak masuk "anonim" (Authentication → Sign In / Providers → Allow anonymous sign-ins harus NYALA),
--     lalu memanggil tukar_kode_hubung(kode). Pengguna anonim itu dicatat di tabel perangkat (id = auth.uid()).
--  3. HP anak hanya boleh membaca dan menulis data anak yang terdaftar di perangkatnya (RLS di bawah).
--  4. Orang tua bisa memutus HP anak kapan saja (perangkat.diputus = true).
-- Semua tabel yang bisa berubah mendapat kolom `diubah` supaya HP bisa menarik hanya yang baru.

-- ---------- kolom diubah + pemicu ----------
create or replace function catat_diubah() returns trigger
  language plpgsql
as $$
begin
  new.diubah := now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['anak', 'kemajuan_topik', 'pesan', 'pengaturan_waktu', 'pemakaian'] loop
    execute format('alter table %I add column if not exists diubah timestamptz not null default now()', t);
    execute format('create index if not exists %1$s_diubah on %1$I (keluarga_id, diubah)', t);
    execute format('drop trigger if exists %1$s_diubah_tg on %1$I', t);
    execute format('create trigger %1$s_diubah_tg before insert or update on %1$I for each row execute function catat_diubah()', t);
  end loop;
end $$;
create index if not exists sesi_diterima on sesi (keluarga_id, diterima_server);
create index if not exists perangkat_keluarga_idx on perangkat (keluarga_id);

-- ---------- identitas HP anak: pengguna anonim yang terdaftar di tabel perangkat ----------
-- Menggantikan klaim JWT `perangkat_id` (tidak bisa dibuat dari aplikasi tanpa server tambahan).
create or replace function anak_perangkat() returns uuid[]
  language sql stable security definer set search_path = public
as $$
  select coalesce((select anak_ids from perangkat where id = auth.uid() and not diputus), '{}')
$$;

create or replace function keluarga_perangkat() returns uuid
  language sql stable security definer set search_path = public
as $$ select keluarga_id from perangkat where id = auth.uid() and not diputus $$;

-- HP anak boleh membaca keluarganya (sapaan Ayah/Bunda) dan baris perangkatnya sendiri (untuk tahu bila diputus).
drop policy if exists keluarga_hp_baca on keluarga;
create policy keluarga_hp_baca on keluarga for select using (id = keluarga_perangkat());
drop policy if exists perangkat_diri on perangkat;
create policy perangkat_diri on perangkat for select using (id = auth.uid());

-- Tulisan HP anak harus membawa keluarga_id yang benar.
do $$
declare t text;
begin
  foreach t in array array['sesi', 'jawaban', 'kemajuan_topik', 'pemakaian'] loop
    execute format('drop policy if exists %1$s_hp_anak on %1$s', t);
    execute format('create policy %1$s_hp_anak on %1$s for all using (anak_id = any (anak_perangkat())) with check (anak_id = any (anak_perangkat()) and keluarga_id = keluarga_perangkat())', t);
  end loop;
end $$;

drop policy if exists pesan_hp_stiker on pesan;
create policy pesan_hp_stiker on pesan for insert
  with check (anak_id = any (anak_perangkat()) and keluarga_id = keluarga_perangkat() and dari = 'anak' and jenis in ('stiker', 'bantu_aku'));

-- ---------- kode hubung ----------
create table if not exists kode_hubung (
  id uuid primary key default gen_random_uuid(),
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_ids uuid[] not null,
  kode text not null check (kode ~ '^[0-9]{6}$'),
  dibuat timestamptz not null default now(),
  berlaku_sampai timestamptz not null,
  dipakai boolean not null default false
);
create unique index if not exists kode_hubung_belum_dipakai on kode_hubung (kode) where not dipakai;

create table if not exists percobaan_kode (
  id bigint generated always as identity primary key,
  auth_id uuid not null,
  waktu timestamptz not null default now()
);
create index if not exists percobaan_kode_waktu on percobaan_kode (waktu);

-- Tidak ada akses langsung: hanya lewat fungsi di bawah.
alter table kode_hubung enable row level security;
alter table percobaan_kode enable row level security;
revoke all on kode_hubung, percobaan_kode from anon, authenticated;

-- Orang tua: buat kode untuk satu atau lebih anaknya. Kode lama yang belum dipakai dibuang.
create or replace function buat_kode_hubung(p_anak_ids uuid[]) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_kel uuid := keluarga_saya();
  v_anak uuid[];
  v_kode text;
  v_sampai timestamptz := now() + interval '10 minutes';
  v_coba int := 0;
begin
  if v_kel is null then raise exception 'bukan_orang_tua' using errcode = '42501'; end if;
  select coalesce(array_agg(distinct x), '{}') into v_anak from unnest(p_anak_ids) as x;
  if cardinality(v_anak) = 0 or cardinality(v_anak) > 6 then raise exception 'anak_tidak_valid'; end if;
  if (select count(*) from anak where keluarga_id = v_kel and id = any (v_anak)) <> cardinality(v_anak) then
    raise exception 'anak_tidak_valid';
  end if;
  delete from kode_hubung where not dipakai and (keluarga_id = v_kel or berlaku_sampai < now());
  loop
    v_kode := lpad((abs(((('x' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))::bit(32))::int)::bigint) % 1000000)::text, 6, '0');
    begin
      insert into kode_hubung (keluarga_id, anak_ids, kode, berlaku_sampai) values (v_kel, v_anak, v_kode, v_sampai);
      exit;
    exception when unique_violation then
      v_coba := v_coba + 1;
      if v_coba > 20 then raise exception 'coba_lagi'; end if;
    end;
  end loop;
  return jsonb_build_object('kode', v_kode, 'berlaku_sampai', v_sampai);
end $$;
grant execute on function buat_kode_hubung(uuid[]) to authenticated;

-- HP anak: tukar kode dengan akses. Salah 5 kali dalam 10 menit → ditunda; seluruh server 100 kali → ditunda.
create or replace function tukar_kode_hubung(p_kode text, p_versi text default null) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_k kode_hubung%rowtype;
  v_gagal int;
  v_gagal_semua int;
  v_sapaan text;
begin
  if v_uid is null then raise exception 'belum_masuk' using errcode = '42501'; end if;
  if exists (select 1 from orang_tua where id = v_uid) then
    return jsonb_build_object('ok', false, 'alasan', 'akun_orang_tua');
  end if;
  delete from percobaan_kode where waktu < now() - interval '1 hour';
  select count(*) into v_gagal from percobaan_kode where auth_id = v_uid and waktu > now() - interval '10 minutes';
  select count(*) into v_gagal_semua from percobaan_kode where waktu > now() - interval '10 minutes';
  if v_gagal >= 5 or v_gagal_semua >= 100 then
    return jsonb_build_object('ok', false, 'alasan', 'terlalu_sering');
  end if;
  if p_kode is null or p_kode !~ '^[0-9]{6}$' then
    insert into percobaan_kode (auth_id) values (v_uid);
    return jsonb_build_object('ok', false, 'alasan', 'salah');
  end if;
  select * into v_k from kode_hubung where kode = p_kode and not dipakai and berlaku_sampai > now() for update;
  if not found then
    insert into percobaan_kode (auth_id) values (v_uid);
    return jsonb_build_object('ok', false, 'alasan', 'salah');
  end if;
  update kode_hubung set dipakai = true where id = v_k.id;
  insert into perangkat (id, keluarga_id, jenis, anak_ids, terakhir_sinkron, versi_aplikasi, diputus)
    values (v_uid, v_k.keluarga_id, 'anak', v_k.anak_ids, now(), left(p_versi, 40), false)
    on conflict (id) do update set keluarga_id = excluded.keluarga_id, anak_ids = excluded.anak_ids,
      terakhir_sinkron = now(), versi_aplikasi = excluded.versi_aplikasi, diputus = false;
  select sapaan_ortu into v_sapaan from keluarga where id = v_k.keluarga_id;
  return jsonb_build_object('ok', true, 'keluarga_id', v_k.keluarga_id, 'sapaan', v_sapaan, 'anak_ids', to_jsonb(v_k.anak_ids));
end $$;
grant execute on function tukar_kode_hubung(text, text) to authenticated;

-- HP anak: catat waktu sinkron terakhir (ditampilkan di HP orang tua).
create or replace function catat_sinkron(p_antrean int default 0) returns void
  language sql security definer set search_path = public
as $$
  update perangkat set terakhir_sinkron = now(), antrean_belum_kirim = greatest(0, coalesce(p_antrean, 0))
  where id = auth.uid() and not diputus
$$;
grant execute on function catat_sinkron(int) to authenticated;

-- HP anak: tandai pesan dari orang tua sudah dibaca (HP anak tidak boleh mengubah isi pesan).
create or replace function tandai_pesan_dibaca(p_ids uuid[], p_waktu timestamptz default now()) returns int
  language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  update pesan set dibaca = coalesce(dibaca, p_waktu)
    where id = any (p_ids) and dari = 'orang_tua' and anak_id = any (anak_perangkat());
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function tandai_pesan_dibaca(uuid[], timestamptz) to authenticated;

-- Pengelolaan HP anak oleh orang tua sudah tercakup kebijakan perangkat_keluarga (baca, putus lewat diputus = true).
