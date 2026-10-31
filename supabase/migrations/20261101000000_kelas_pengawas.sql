-- Pintar Main — kelas dengan pengawas (docs/rancangan/08-model-usaha/01-model-usaha-dan-pengawas.md).
--
-- Cara kerja:
--  1. Super admin mengundang staf lewat email (undang_staf). Staf masuk dengan email + kode sekali pakai,
--     lalu aplikasi memanggil terima_undangan() → baris staf dibuat dengan perannya.
--  2. Peran: super_admin (semua), admin (kelas Pintar Main, tanpa uang), mitra (kelas lesnya sendiri),
--     pengawas (kelasnya sendiri). Pengawas milik les mitra punya mitra_id.
--  3. Kelas berisi 1–8 anak, punya kode kelas 6 huruf/angka. Orang tua memasukkan kode di mode orang tua
--     (gabung_kelas): anak masuk kelas, masa coba 14 hari dimulai, persetujuan dicatat.
--  4. Pengawas membaca kemajuan anak di kelasnya, menulis catatan untuk orang tua, memberi tugas ke anak,
--     dan menandai "Pantauan selesai". Pengawas tidak bisa mengirim apa pun langsung ke anak selain tugas.
--  5. Semua akses dijaga aturan baris (RLS). Tindakan penting masuk catatan_kegiatan.

-- ---------- tabel ----------
create table if not exists mitra (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 1 and 60),
  kota text check (char_length(kota) <= 40),
  aktif boolean not null default true,
  dibuat timestamptz not null default now()
);

create table if not exists staf (
  id uuid primary key references auth.users (id) on delete cascade,
  peran text not null check (peran in ('super_admin', 'admin', 'mitra', 'pengawas')),
  mitra_id uuid references mitra (id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 40),
  aktif boolean not null default true,
  dibuat timestamptz not null default now(),
  check (peran <> 'mitra' or mitra_id is not null),
  check (peran not in ('super_admin', 'admin') or mitra_id is null)
);

create table if not exists undangan_staf (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and email like '%@%'),
  peran text not null check (peran in ('super_admin', 'admin', 'mitra', 'pengawas')),
  mitra_id uuid references mitra (id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 40),
  dibuat_oleh uuid,
  dibuat timestamptz not null default now(),
  dipakai timestamptz
);
create unique index if not exists undangan_staf_aktif on undangan_staf (email) where dipakai is null;

create table if not exists kelas (
  id uuid primary key default gen_random_uuid(),
  nama text not null check (char_length(nama) between 1 and 40),
  mitra_id uuid references mitra (id) on delete cascade,
  pengawas_id uuid references staf (id) on delete set null,
  kode text not null unique check (kode ~ '^[A-HJKMNP-Z2-9]{6}$'),
  kapasitas int not null default 8 check (kapasitas between 1 and 8),
  aktif boolean not null default true,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);

create table if not exists anggota_kelas (
  id uuid primary key default gen_random_uuid(),
  kelas_id uuid not null references kelas (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  paket text not null check (paket in ('dasar', 'lengkap', 'siap_tka')),
  masuk timestamptz not null default now(),
  keluar timestamptz,
  coba_sampai timestamptz not null,
  diubah timestamptz not null default now()
);
create unique index if not exists anggota_kelas_satu_aktif on anggota_kelas (anak_id) where keluar is null;
create index if not exists anggota_kelas_kelas on anggota_kelas (kelas_id) where keluar is null;
create index if not exists anggota_kelas_keluarga on anggota_kelas (keluarga_id, diubah);

create table if not exists catatan_pengawas (
  id uuid primary key,
  kelas_id uuid not null references kelas (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  staf_id uuid references staf (id) on delete set null,
  isi text not null check (char_length(isi) between 1 and 600),
  waktu timestamptz not null default now(),
  dibaca timestamptz,
  diubah timestamptz not null default now()
);
create index if not exists catatan_pengawas_keluarga on catatan_pengawas (keluarga_id, diubah);
create index if not exists catatan_pengawas_anak on catatan_pengawas (anak_id, waktu);

create table if not exists tugas (
  id uuid primary key,
  kelas_id uuid not null references kelas (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  staf_id uuid references staf (id) on delete set null,
  jenis text not null check (jenis in ('lancar', 'baca', 'tka', 'inggris', 'kartu', 'game')),
  rujukan text check (char_length(rujukan) <= 80),
  judul text not null check (char_length(judul) between 1 and 80),
  pesan text check (char_length(pesan) <= 200),
  dibuat timestamptz not null default now(),
  tenggat date,
  selesai timestamptz,
  dibatalkan boolean not null default false,
  diubah timestamptz not null default now()
);
create index if not exists tugas_keluarga on tugas (keluarga_id, diubah);
create index if not exists tugas_anak on tugas (anak_id, dibuat);

create table if not exists pantauan (
  id uuid primary key default gen_random_uuid(),
  kelas_id uuid not null references kelas (id) on delete cascade,
  staf_id uuid references staf (id) on delete set null,
  tanggal date not null,
  waktu timestamptz not null default now(),
  unique (kelas_id, tanggal)
);

create table if not exists catatan_kegiatan (
  id bigint generated always as identity primary key,
  staf_id uuid,
  tindakan text not null,
  sasaran text,
  rincian jsonb,
  waktu timestamptz not null default now()
);
create index if not exists catatan_kegiatan_waktu on catatan_kegiatan (waktu);

-- Persetujuan kelas mencatat kelas dan anak yang dimaksud.
alter table persetujuan add column if not exists rujukan text;
alter table persetujuan add column if not exists anak_id uuid references anak (id) on delete cascade;

do $$
declare t text;
begin
  foreach t in array array['kelas', 'anggota_kelas', 'catatan_pengawas', 'tugas'] loop
    execute format('drop trigger if exists %1$s_diubah_tg on %1$I', t);
    execute format('create trigger %1$s_diubah_tg before insert or update on %1$I for each row execute function catat_diubah()', t);
  end loop;
end $$;

-- ---------- fungsi bantu peran ----------
create or replace function peran_saya() returns text
  language sql stable security definer set search_path = public
as $$ select peran from staf where id = auth.uid() and aktif $$;

create or replace function mitra_saya() returns uuid
  language sql stable security definer set search_path = public
as $$ select mitra_id from staf where id = auth.uid() and aktif $$;

-- Kelas yang boleh dilihat staf yang sedang masuk.
create or replace function kelas_saya() returns setof uuid
  language sql stable security definer set search_path = public
as $$
  select k.id from kelas k join staf s on s.id = auth.uid() and s.aktif
  where s.peran = 'super_admin'
     or (s.peran = 'admin' and k.mitra_id is null)
     or (s.peran = 'mitra' and k.mitra_id = s.mitra_id)
     or (s.peran = 'pengawas' and k.pengawas_id = s.id)
$$;

-- Anak (anggota aktif) di kelas yang boleh dilihat staf.
create or replace function anak_staf() returns uuid[]
  language sql stable security definer set search_path = public
as $$
  select coalesce(array_agg(anak_id), '{}') from anggota_kelas
  where keluar is null and kelas_id in (select kelas_saya())
$$;

create or replace function catat_kegiatan(p_tindakan text, p_sasaran text, p_rincian jsonb default null) returns void
  language sql security definer set search_path = public
as $$ insert into catatan_kegiatan (staf_id, tindakan, sasaran, rincian) values (auth.uid(), p_tindakan, p_sasaran, p_rincian) $$;
revoke execute on function catat_kegiatan(text, text, jsonb) from public, anon, authenticated;

create or replace function hari_ini_wib() returns date
  language sql stable
as $$ select (now() at time zone 'Asia/Jakarta')::date $$;

-- ---------- aturan baris ----------
alter table mitra enable row level security;
alter table staf enable row level security;
alter table undangan_staf enable row level security;
alter table kelas enable row level security;
alter table anggota_kelas enable row level security;
alter table catatan_pengawas enable row level security;
alter table tugas enable row level security;
alter table pantauan enable row level security;
alter table catatan_kegiatan enable row level security;

-- Tulisan ke tabel pengelolaan hanya lewat fungsi (yang memeriksa peran dan mencatat kegiatan).
revoke insert, update, delete on mitra, staf, kelas, anggota_kelas, pantauan from anon, authenticated;
revoke all on undangan_staf, catatan_kegiatan from anon, authenticated;
revoke delete on catatan_pengawas, tugas from anon, authenticated;
revoke all on mitra, staf, undangan_staf, kelas, anggota_kelas, catatan_pengawas, tugas, pantauan, catatan_kegiatan from anon;

drop policy if exists mitra_baca on mitra;
create policy mitra_baca on mitra for select using (peran_saya() in ('super_admin', 'admin') or id = mitra_saya());

drop policy if exists staf_baca on staf;
create policy staf_baca on staf for select using (
  id = auth.uid()
  or peran_saya() = 'super_admin'
  or (peran_saya() = 'admin' and mitra_id is null)
  or (peran_saya() = 'mitra' and mitra_id = mitra_saya())
);

drop policy if exists kelas_staf on kelas;
create policy kelas_staf on kelas for select using (id in (select kelas_saya()));

drop policy if exists anggota_staf on anggota_kelas;
create policy anggota_staf on anggota_kelas for select using (kelas_id in (select kelas_saya()));
drop policy if exists anggota_ortu on anggota_kelas;
create policy anggota_ortu on anggota_kelas for select using (keluarga_id = keluarga_saya());
drop policy if exists anggota_hp_anak on anggota_kelas;
create policy anggota_hp_anak on anggota_kelas for select using (anak_id = any (anak_perangkat()));

-- Catatan pengawas: untuk orang tua, tidak untuk HP anak.
drop policy if exists catatan_staf_baca on catatan_pengawas;
create policy catatan_staf_baca on catatan_pengawas for select using (kelas_id in (select kelas_saya()));
drop policy if exists catatan_staf_tulis on catatan_pengawas;
create policy catatan_staf_tulis on catatan_pengawas for insert with check (
  staf_id = auth.uid()
  and exists (select 1 from anggota_kelas a where a.kelas_id = catatan_pengawas.kelas_id and a.anak_id = catatan_pengawas.anak_id
              and a.keluarga_id = catatan_pengawas.keluarga_id and a.keluar is null)
  and kelas_id in (select kelas_saya())
);
drop policy if exists catatan_staf_ubah on catatan_pengawas;
create policy catatan_staf_ubah on catatan_pengawas for update
  using (staf_id = auth.uid() and kelas_id in (select kelas_saya()))
  with check (staf_id = auth.uid() and kelas_id in (select kelas_saya()));
drop policy if exists catatan_ortu on catatan_pengawas;
create policy catatan_ortu on catatan_pengawas for select using (keluarga_id = keluarga_saya());

-- Tugas: staf menulis; orang tua dan HP anak membaca; selesai lewat fungsi.
drop policy if exists tugas_staf_baca on tugas;
create policy tugas_staf_baca on tugas for select using (kelas_id in (select kelas_saya()));
drop policy if exists tugas_staf_tulis on tugas;
create policy tugas_staf_tulis on tugas for insert with check (
  staf_id = auth.uid() and selesai is null
  and exists (select 1 from anggota_kelas a where a.kelas_id = tugas.kelas_id and a.anak_id = tugas.anak_id
              and a.keluarga_id = tugas.keluarga_id and a.keluar is null)
  and kelas_id in (select kelas_saya())
);
drop policy if exists tugas_staf_ubah on tugas;
create policy tugas_staf_ubah on tugas for update
  using (kelas_id in (select kelas_saya()))
  with check (kelas_id in (select kelas_saya()));
drop policy if exists tugas_ortu on tugas;
create policy tugas_ortu on tugas for select using (keluarga_id = keluarga_saya());
drop policy if exists tugas_hp_anak on tugas;
create policy tugas_hp_anak on tugas for select using (anak_id = any (anak_perangkat()));

drop policy if exists pantauan_staf on pantauan;
create policy pantauan_staf on pantauan for select using (kelas_id in (select kelas_saya()));

-- Staf membaca data latihan anak di kelasnya (hanya baca).
drop policy if exists anak_staf_baca on anak;
create policy anak_staf_baca on anak for select using (id = any (anak_staf()));
do $$
declare t text;
begin
  foreach t in array array['sesi', 'jawaban', 'kemajuan_topik', 'pemakaian'] loop
    execute format('drop policy if exists %1$s_staf_baca on %1$s', t);
    execute format('create policy %1$s_staf_baca on %1$s for select using (anak_id = any (anak_staf()))', t);
  end loop;
end $$;

-- ---------- fungsi: staf ----------
-- Staf baru: dipanggil setelah masuk dengan email. Undangan yang cocok dengan email akun dipakai.
create or replace function terima_undangan() returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_u undangan_staf%rowtype;
  v_s staf%rowtype;
begin
  if v_uid is null then raise exception 'belum_masuk' using errcode = '42501'; end if;
  select lower(email) into v_email from auth.users where id = v_uid;
  select * into v_u from undangan_staf where email = v_email and dipakai is null for update;
  if found then
    insert into staf (id, peran, mitra_id, nama) values (v_uid, v_u.peran, v_u.mitra_id, v_u.nama)
      on conflict (id) do update set peran = excluded.peran, mitra_id = excluded.mitra_id, nama = excluded.nama, aktif = true;
    update undangan_staf set dipakai = now() where id = v_u.id;
    perform catat_kegiatan('terima_undangan', v_uid::text, jsonb_build_object('peran', v_u.peran));
  end if;
  select * into v_s from staf where id = v_uid;
  if not found or not v_s.aktif then return jsonb_build_object('ok', false); end if;
  return jsonb_build_object('ok', true, 'peran', v_s.peran, 'nama', v_s.nama, 'mitra_id', v_s.mitra_id);
end $$;
grant execute on function terima_undangan() to authenticated;

create or replace function undang_staf(p_email text, p_peran text, p_nama text, p_mitra_id uuid default null) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_peran text := peran_saya();
  v_mitra uuid := p_mitra_id;
  v_email text := lower(trim(p_email));
begin
  if v_peran is null then raise exception 'bukan_staf' using errcode = '42501'; end if;
  if v_peran = 'admin' then
    if p_peran <> 'pengawas' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
    v_mitra := null;
  elsif v_peran = 'mitra' then
    if p_peran <> 'pengawas' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
    v_mitra := mitra_saya();
  elsif v_peran <> 'super_admin' then
    raise exception 'tidak_boleh' using errcode = '42501';
  end if;
  if p_peran in ('super_admin', 'admin') then v_mitra := null; end if;
  if p_peran = 'mitra' and v_mitra is null then raise exception 'mitra_kosong'; end if;
  delete from undangan_staf where email = v_email and dipakai is null;
  insert into undangan_staf (email, peran, mitra_id, nama, dibuat_oleh) values (v_email, p_peran, v_mitra, trim(p_nama), auth.uid());
  perform catat_kegiatan('undang_staf', v_email, jsonb_build_object('peran', p_peran, 'mitra_id', v_mitra));
  return jsonb_build_object('ok', true);
end $$;
grant execute on function undang_staf(text, text, text, uuid) to authenticated;

create or replace function atur_staf_aktif(p_staf_id uuid, p_aktif boolean) returns void
  language plpgsql security definer set search_path = public
as $$
declare v_s staf%rowtype; v_peran text := peran_saya();
begin
  select * into v_s from staf where id = p_staf_id;
  if not found then raise exception 'tidak_ada'; end if;
  if p_staf_id = auth.uid() then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  if not coalesce(v_peran = 'super_admin'
          or (v_peran = 'admin' and v_s.peran = 'pengawas' and v_s.mitra_id is null)
          or (v_peran = 'mitra' and v_s.peran = 'pengawas' and v_s.mitra_id = mitra_saya()), false) then
    raise exception 'tidak_boleh' using errcode = '42501';
  end if;
  update staf set aktif = p_aktif where id = p_staf_id;
  perform catat_kegiatan(case when p_aktif then 'aktifkan_staf' else 'hentikan_staf' end, p_staf_id::text);
end $$;
grant execute on function atur_staf_aktif(uuid, boolean) to authenticated;

create or replace function buat_mitra(p_nama text, p_kota text default null) returns uuid
  language plpgsql security definer set search_path = public
as $$
declare v_id uuid;
begin
  if peran_saya() is distinct from 'super_admin' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  insert into mitra (nama, kota) values (trim(p_nama), nullif(trim(p_kota), '')) returning id into v_id;
  perform catat_kegiatan('buat_mitra', v_id::text, jsonb_build_object('nama', p_nama));
  return v_id;
end $$;
grant execute on function buat_mitra(text, text) to authenticated;

-- Pengawas boleh untuk kelas ini? Staf aktif dari "rumah" yang sama (Pintar Main atau les yang sama).
create or replace function pengawas_cocok(p_staf_id uuid, p_mitra_id uuid) returns boolean
  language sql stable security definer set search_path = public
as $$ select exists (select 1 from staf where id = p_staf_id and aktif and mitra_id is not distinct from p_mitra_id) $$;

create or replace function kode_kelas_acak() returns text
  language plpgsql volatile
as $$
declare
  huruf constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  b bytea := gen_random_bytes(6);
  v text := '';
begin
  for i in 0..5 loop v := v || substr(huruf, (get_byte(b, i) % 31) + 1, 1); end loop;
  return v;
end $$;

create or replace function buat_kelas(p_nama text, p_pengawas_id uuid, p_mitra_id uuid default null) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_peran text := peran_saya();
  v_mitra uuid := p_mitra_id;
  v_kode text;
  v_id uuid;
  v_coba int := 0;
begin
  if v_peran = 'admin' then v_mitra := null;
  elsif v_peran = 'mitra' then v_mitra := mitra_saya();
  elsif v_peran is distinct from 'super_admin' then raise exception 'tidak_boleh' using errcode = '42501';
  end if;
  if p_pengawas_id is not null and not pengawas_cocok(p_pengawas_id, v_mitra) then raise exception 'pengawas_tidak_cocok'; end if;
  loop
    v_kode := kode_kelas_acak();
    begin
      insert into kelas (nama, mitra_id, pengawas_id, kode) values (trim(p_nama), v_mitra, p_pengawas_id, v_kode) returning id into v_id;
      exit;
    exception when unique_violation then
      v_coba := v_coba + 1;
      if v_coba > 20 then raise exception 'coba_lagi'; end if;
    end;
  end loop;
  perform catat_kegiatan('buat_kelas', v_id::text, jsonb_build_object('nama', p_nama, 'pengawas_id', p_pengawas_id, 'mitra_id', v_mitra));
  return jsonb_build_object('id', v_id, 'kode', v_kode);
end $$;
grant execute on function buat_kelas(text, uuid, uuid) to authenticated;

create or replace function ubah_kelas(p_id uuid, p_nama text, p_pengawas_id uuid, p_aktif boolean) returns void
  language plpgsql security definer set search_path = public
as $$
declare v_k kelas%rowtype; v_peran text := peran_saya();
begin
  select * into v_k from kelas where id = p_id for update;
  if not found then raise exception 'tidak_ada'; end if;
  -- coalesce: perbandingan dengan null harus berarti "tidak boleh", bukan lolos.
  if not coalesce(v_peran = 'super_admin' or (v_peran = 'admin' and v_k.mitra_id is null)
          or (v_peran = 'mitra' and v_k.mitra_id = mitra_saya()), false) then
    raise exception 'tidak_boleh' using errcode = '42501';
  end if;
  if p_pengawas_id is not null and not pengawas_cocok(p_pengawas_id, v_k.mitra_id) then raise exception 'pengawas_tidak_cocok'; end if;
  update kelas set nama = trim(p_nama), pengawas_id = p_pengawas_id, aktif = p_aktif where id = p_id;
  perform catat_kegiatan('ubah_kelas', p_id::text,
    jsonb_build_object('nama', p_nama, 'pengawas_lama', v_k.pengawas_id, 'pengawas_baru', p_pengawas_id, 'aktif', p_aktif));
end $$;
grant execute on function ubah_kelas(uuid, text, uuid, boolean) to authenticated;

create or replace function catat_pantauan(p_kelas_id uuid) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare v_tgl date := hari_ini_wib();
begin
  if p_kelas_id is null or p_kelas_id not in (select kelas_saya()) then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  insert into pantauan (kelas_id, staf_id, tanggal) values (p_kelas_id, auth.uid(), v_tgl)
    on conflict (kelas_id, tanggal) do update set staf_id = excluded.staf_id, waktu = now();
  return jsonb_build_object('tanggal', v_tgl);
end $$;
grant execute on function catat_pantauan(uuid) to authenticated;

-- Papan kelas: ringkasan per anak untuk pantauan Senin/Rabu/Jumat.
create or replace function papan_kelas(p_kelas_id uuid) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_k kelas%rowtype;
  v_hari date := hari_ini_wib();
  v_anak jsonb;
begin
  if p_kelas_id is null or p_kelas_id not in (select kelas_saya()) then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  select * into v_k from kelas where id = p_kelas_id;
  if v_k.pengawas_id is distinct from auth.uid() then
    perform catat_kegiatan('lihat_papan', p_kelas_id::text);
  end if;
  select coalesce(jsonb_agg(baris order by baris ->> 'nama'), '[]') into v_anak from (
    select jsonb_build_object(
      'anak_id', an.id, 'nama', an.nama, 'kelas', an.kelas, 'hewan', an.hewan,
      'paket', a.paket, 'coba_sampai', a.coba_sampai, 'masuk', a.masuk,
      'terakhir_latihan', (select max(s.selesai) from sesi s where s.anak_id = an.id),
      'hari_latihan_7', (select count(distinct (s.mulai at time zone 'Asia/Jakarta')::date) from sesi s
                         where s.anak_id = an.id and s.mulai >= (v_hari - 6)::timestamp at time zone 'Asia/Jakarta'),
      'hari_latihan_4', (select count(distinct (s.mulai at time zone 'Asia/Jakarta')::date) from sesi s
                         where s.anak_id = an.id and s.mulai >= (v_hari - 3)::timestamp at time zone 'Asia/Jakarta'),
      'topik_lemah', (select coalesce(jsonb_agg(jsonb_build_object('mapel', t.mapel, 'topik', t.topik,
                                                  'persen', round(100.0 * t.benar / nullif(t.benar + t.salah, 0)))
                                                order by t.benar::numeric / nullif(t.benar + t.salah, 0)), '[]')
                      from (select * from kemajuan_topik kt where kt.anak_id = an.id and kt.benar + kt.salah >= 5
                              and kt.benar::numeric / (kt.benar + kt.salah) < 0.7
                            order by kt.benar::numeric / (kt.benar + kt.salah) limit 3) t),
      'catatan_terakhir', (select max(c.waktu) from catatan_pengawas c where c.anak_id = an.id and c.kelas_id = p_kelas_id),
      'tugas_terbuka', (select count(*) from tugas g where g.anak_id = an.id and g.kelas_id = p_kelas_id
                          and g.selesai is null and not g.dibatalkan)
    ) as baris
    from anggota_kelas a join anak an on an.id = a.anak_id
    where a.kelas_id = p_kelas_id and a.keluar is null
  ) x;
  return jsonb_build_object(
    'kelas', jsonb_build_object('id', v_k.id, 'nama', v_k.nama, 'kode', v_k.kode, 'kapasitas', v_k.kapasitas,
                                'aktif', v_k.aktif, 'pengawas_id', v_k.pengawas_id),
    'hari_ini', v_hari,
    'pantauan_hari_ini', exists (select 1 from pantauan p where p.kelas_id = p_kelas_id and p.tanggal = v_hari),
    'anak', v_anak
  );
end $$;
grant execute on function papan_kelas(uuid) to authenticated;

-- Daftar kelas untuk staf, dengan jumlah anak dan pantauan terakhir.
create or replace function daftar_kelas_saya() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', k.id, 'nama', k.nama, 'kode', k.kode, 'kapasitas', k.kapasitas, 'aktif', k.aktif,
    'mitra_id', k.mitra_id, 'pengawas_id', k.pengawas_id,
    'pengawas_nama', (select s.nama from staf s where s.id = k.pengawas_id),
    'jumlah_anak', (select count(*) from anggota_kelas a where a.kelas_id = k.id and a.keluar is null),
    'pantauan_terakhir', (select max(p.tanggal) from pantauan p where p.kelas_id = k.id)
  ) order by k.aktif desc, k.nama), '[]')
  from kelas k where k.id in (select kelas_saya())
$$;
grant execute on function daftar_kelas_saya() to authenticated;

-- ---------- fungsi: orang tua dan HP anak ----------
create or replace function gabung_kelas(p_kode text, p_anak_id uuid, p_paket text, p_versi_teks text, p_setuju_pemakaian boolean)
  returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_kel uuid := keluarga_saya();
  v_kode text := upper(regexp_replace(coalesce(p_kode, ''), '[^A-Za-z0-9]', '', 'g'));
  v_k kelas%rowtype;
  v_an anak%rowtype;
  v_ada anggota_kelas%rowtype;
  v_isi int;
  v_id uuid;
  v_coba timestamptz := now() + interval '14 days';
begin
  if v_kel is null then raise exception 'bukan_orang_tua' using errcode = '42501'; end if;
  delete from percobaan_kode where waktu < now() - interval '1 hour';
  if (select count(*) from percobaan_kode where auth_id = v_uid and waktu > now() - interval '10 minutes') >= 5 then
    return jsonb_build_object('ok', false, 'alasan', 'terlalu_sering');
  end if;
  select * into v_an from anak where id = p_anak_id and keluarga_id = v_kel;
  if not found then return jsonb_build_object('ok', false, 'alasan', 'anak_tidak_valid'); end if;
  if p_paket not in ('dasar', 'lengkap', 'siap_tka') then return jsonb_build_object('ok', false, 'alasan', 'paket_tidak_valid'); end if;
  if p_paket = 'siap_tka' and v_an.kelas <> 6 then return jsonb_build_object('ok', false, 'alasan', 'paket_tidak_cocok'); end if;
  if p_versi_teks is null or char_length(p_versi_teks) = 0 then return jsonb_build_object('ok', false, 'alasan', 'belum_setuju'); end if;
  select * into v_k from kelas where kode = v_kode and aktif;
  if not found then
    insert into percobaan_kode (auth_id) values (v_uid);
    return jsonb_build_object('ok', false, 'alasan', 'kode_salah');
  end if;
  select * into v_ada from anggota_kelas where anak_id = p_anak_id and keluar is null for update;
  if found then
    if v_ada.kelas_id <> v_k.id then return jsonb_build_object('ok', false, 'alasan', 'sudah_di_kelas_lain'); end if;
    v_id := v_ada.id;
    v_coba := v_ada.coba_sampai;
    update anggota_kelas set paket = p_paket where id = v_id;
  else
    perform 1 from kelas where id = v_k.id for update; -- kunci supaya dua orang tua tidak melewati kapasitas bersamaan
    select count(*) into v_isi from anggota_kelas where kelas_id = v_k.id and keluar is null;
    if v_isi >= v_k.kapasitas then return jsonb_build_object('ok', false, 'alasan', 'penuh'); end if;
    -- Masa coba hanya sekali per anak: masuk lagi setelah keluar tidak mengulang 14 hari.
    if exists (select 1 from anggota_kelas where anak_id = p_anak_id) then
      v_coba := least(v_coba, (select max(coba_sampai) from anggota_kelas where anak_id = p_anak_id));
    end if;
    insert into anggota_kelas (kelas_id, anak_id, keluarga_id, paket, coba_sampai)
      values (v_k.id, p_anak_id, v_kel, p_paket, v_coba) returning id into v_id;
  end if;
  insert into persetujuan (orang_tua_id, keluarga_id, tujuan, versi_teks, setuju, rujukan, anak_id) values
    (v_uid, v_kel, 'ikut_kelas', p_versi_teks, true, v_k.id::text, p_anak_id),
    (v_uid, v_kel, 'catatan_pemakaian', p_versi_teks, coalesce(p_setuju_pemakaian, false), v_k.id::text, p_anak_id);
  return jsonb_build_object('ok', true, 'anggota_id', v_id, 'kelas_id', v_k.id, 'kelas_nama', v_k.nama,
    'pengawas_nama', (select nama from staf where id = v_k.pengawas_id), 'paket', p_paket, 'coba_sampai', v_coba);
end $$;
grant execute on function gabung_kelas(text, uuid, text, text, boolean) to authenticated;

create or replace function keluar_kelas(p_anak_id uuid) returns int
  language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  if keluarga_saya() is null then raise exception 'bukan_orang_tua' using errcode = '42501'; end if;
  update anggota_kelas set keluar = now() where anak_id = p_anak_id and keluarga_id = keluarga_saya() and keluar is null;
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function keluar_kelas(uuid) to authenticated;

-- Orang tua: ganti paket anak di kelasnya sekarang.
create or replace function ganti_paket(p_anak_id uuid, p_paket text) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare v_kelas int;
begin
  if keluarga_saya() is null then raise exception 'bukan_orang_tua' using errcode = '42501'; end if;
  select kelas into v_kelas from anak where id = p_anak_id and keluarga_id = keluarga_saya();
  if not found then return jsonb_build_object('ok', false, 'alasan', 'anak_tidak_valid'); end if;
  if p_paket not in ('dasar', 'lengkap', 'siap_tka') then return jsonb_build_object('ok', false, 'alasan', 'paket_tidak_valid'); end if;
  if p_paket = 'siap_tka' and v_kelas <> 6 then return jsonb_build_object('ok', false, 'alasan', 'paket_tidak_cocok'); end if;
  update anggota_kelas set paket = p_paket where anak_id = p_anak_id and keluar is null;
  if not found then return jsonb_build_object('ok', false, 'alasan', 'belum_di_kelas'); end if;
  return jsonb_build_object('ok', true);
end $$;
grant execute on function ganti_paket(uuid, text) to authenticated;

-- Kelas anak-anak di keluarga ini (orang tua) atau di HP ini (HP anak): nama kelas dan nama pengawas.
create or replace function kelas_keluarga() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'anggota_id', a.id, 'anak_id', a.anak_id, 'kelas_id', k.id, 'kelas_nama', k.nama,
    'pengawas_nama', (select s.nama from staf s where s.id = k.pengawas_id),
    'paket', a.paket, 'masuk', a.masuk, 'coba_sampai', a.coba_sampai
  ) order by a.masuk), '[]')
  from anggota_kelas a join kelas k on k.id = a.kelas_id
  where a.keluar is null
    and (a.keluarga_id = keluarga_saya() or a.anak_id = any (anak_perangkat()))
$$;
grant execute on function kelas_keluarga() to authenticated;

create or replace function tandai_catatan_dibaca(p_ids uuid[], p_waktu timestamptz default now()) returns int
  language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  update catatan_pengawas set dibaca = coalesce(dibaca, p_waktu)
    where id = any (p_ids) and keluarga_id = keluarga_saya();
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function tandai_catatan_dibaca(uuid[], timestamptz) to authenticated;

create or replace function tandai_tugas_selesai(p_ids uuid[], p_waktu timestamptz default now()) returns int
  language plpgsql security definer set search_path = public
as $$
declare n int;
begin
  update tugas set selesai = coalesce(selesai, least(p_waktu, now()))
    where id = any (p_ids) and not dibatalkan
      and (keluarga_id = keluarga_saya() or anak_id = any (anak_perangkat()));
  get diagnostics n = row_count;
  return n;
end $$;
grant execute on function tandai_tugas_selesai(uuid[], timestamptz) to authenticated;

-- Fungsi bantu tidak dipanggil langsung oleh aplikasi.
revoke execute on function kode_kelas_acak() from public, anon, authenticated;
