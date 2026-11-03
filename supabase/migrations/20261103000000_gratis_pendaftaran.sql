-- Pintar Main — harga per pelajaran (kotak centang), promo, pelajaran pilihan per anak, dan pendaftaran masa coba
-- (online atau antre tatap muka, pertanyaan pengenalan anak, permintaan telepon, izin data).
-- Rancangan: docs/rancangan/08-model-usaha/03-gratis-ke-berbayar.md. Keputusan Acut 3 Nov 2026.
--
-- Pelajaran pilihan: 'inggris', 'gudang', 'tka'. Latihan inti (Lancar Matematika, Baca Ulang, game) + pengawas selalu ada.
-- Kolom lama anggota_kelas.paket tetap diisi (disamakan dari pelajaran) supaya halaman staf dan tagihan lama tetap jalan.

-- ---------- harga per pelajaran dan promo ----------
create table if not exists harga_modul (
  modul text primary key check (modul in ('inti', 'inggris', 'gudang', 'tka')),
  harga int not null check (harga between 0 and 10000000),
  diubah timestamptz not null default now()
);
insert into harga_modul (modul, harga) values ('inti', 50000), ('inggris', 5000), ('gudang', 5000), ('tka', 10000)
  on conflict (modul) do nothing;

create table if not exists promo (
  kunci text primary key check (kunci in ('diskon_anak_kedua_persen', 'bayar_6_gratis_bulan')),
  nilai int not null check (nilai between 0 and 100),
  diubah timestamptz not null default now()
);
insert into promo (kunci, nilai) values ('diskon_anak_kedua_persen', 20), ('bayar_6_gratis_bulan', 1)
  on conflict (kunci) do nothing;

alter table harga_modul enable row level security;
alter table promo enable row level security;
revoke all on harga_modul, promo from anon, authenticated;

-- Harga per pelajaran tampil di website (kotak centang), jadi boleh dibaca siapa saja. Aplikasi tidak memanggilnya.
create or replace function harga_publik() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'modul', (select coalesce(jsonb_object_agg(modul, harga), '{}') from harga_modul),
    'promo', (select coalesce(jsonb_object_agg(kunci, nilai), '{}') from promo))
$$;
grant execute on function harga_publik() to anon, authenticated;

-- Total per bulan untuk pilihan pelajaran. p_anak_ke: 1 = anak pertama, 2+ = mendapat diskon anak kedua.
create or replace function hitung_harga(p_pelajaran text[], p_kelas int, p_anak_ke int default 1) returns int
  language sql stable security definer set search_path = public
as $$
  select (round(
    ((select harga from harga_modul where modul = 'inti')
      + coalesce((select sum(harga) from harga_modul
                  where modul = any (coalesce(p_pelajaran, '{}')) and modul <> 'inti' and (modul <> 'tka' or p_kelas = 6)), 0))
    * (case when coalesce(p_anak_ke, 1) >= 2
            then 100 - (select nilai from promo where kunci = 'diskon_anak_kedua_persen') else 100 end) / 100.0
  ))::int
$$;
grant execute on function hitung_harga(text[], int, int) to anon, authenticated;

create or replace function atur_harga_modul(p_modul text, p_harga int) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if peran_saya() is distinct from 'super_admin' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  update harga_modul set harga = p_harga, diubah = now() where modul = p_modul;
  if not found then raise exception 'modul_tidak_ada'; end if;
  perform catat_kegiatan('atur_harga_modul', p_modul, jsonb_build_object('harga', p_harga));
end $$;
grant execute on function atur_harga_modul(text, int) to authenticated;

create or replace function atur_promo(p_kunci text, p_nilai int) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if peran_saya() is distinct from 'super_admin' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  update promo set nilai = p_nilai, diubah = now() where kunci = p_kunci;
  if not found then raise exception 'promo_tidak_ada'; end if;
  perform catat_kegiatan('atur_promo', p_kunci, jsonb_build_object('nilai', p_nilai));
end $$;
grant execute on function atur_promo(text, int) to authenticated;

-- ---------- pelajaran pilihan per anak ----------
create or replace function pelajaran_sah(p text[]) returns boolean
  language sql immutable
as $$ select coalesce(p, '{}') <@ array['inggris', 'gudang', 'tka']::text[] $$;

alter table anggota_kelas add column if not exists pelajaran text[];
update anggota_kelas set pelajaran = case paket when 'dasar' then '{}'::text[] when 'lengkap' then array['inggris', 'gudang']
  else array['inggris', 'gudang', 'tka'] end where pelajaran is null;
alter table anggota_kelas alter column pelajaran set default '{}';
alter table anggota_kelas alter column pelajaran set not null;
do $$ begin
  alter table anggota_kelas add constraint anggota_kelas_pelajaran_sah check (pelajaran_sah(pelajaran));
exception when duplicate_object then null; end $$;

create or replace function paket_dari_pelajaran(p text[]) returns text
  language sql immutable
as $$ select case when 'tka' = any (p) then 'siap_tka' when cardinality(p) > 0 then 'lengkap' else 'dasar' end $$;

-- Orang tua memilih pelajaran anak di kelasnya (tanpa harga di aplikasi; tagihan dikirim di luar aplikasi).
create or replace function atur_pelajaran(p_anak_id uuid, p_pelajaran text[]) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare v_kelas int; v_p text[];
begin
  if keluarga_saya() is null then raise exception 'bukan_orang_tua' using errcode = '42501'; end if;
  select kelas into v_kelas from anak where id = p_anak_id and keluarga_id = keluarga_saya();
  if not found then return jsonb_build_object('ok', false, 'alasan', 'anak_tidak_valid'); end if;
  if not pelajaran_sah(p_pelajaran) then return jsonb_build_object('ok', false, 'alasan', 'pelajaran_tidak_valid'); end if;
  select coalesce(array_agg(distinct x order by x), '{}') into v_p from unnest(coalesce(p_pelajaran, '{}')) x where x <> 'tka' or v_kelas = 6;
  update anggota_kelas set pelajaran = v_p, paket = paket_dari_pelajaran(v_p), diubah = now()
    where anak_id = p_anak_id and keluar is null;
  if not found then return jsonb_build_object('ok', false, 'alasan', 'belum_di_kelas'); end if;
  return jsonb_build_object('ok', true, 'pelajaran', to_jsonb(v_p));
end $$;
grant execute on function atur_pelajaran(uuid, text[]) to authenticated;

-- Fungsi lama tetap bisa dipakai: mengganti paket ikut mengganti pelajaran.
create or replace function samakan_pelajaran() returns trigger
  language plpgsql
as $$
begin
  if tg_op = 'INSERT' and (new.pelajaran is null or new.pelajaran = '{}') or tg_op = 'UPDATE' and new.paket is distinct from old.paket
     and new.pelajaran is not distinct from old.pelajaran then
    new.pelajaran := case new.paket when 'dasar' then '{}'::text[] when 'lengkap' then array['inggris', 'gudang']
      else array['inggris', 'gudang', 'tka'] end;
  end if;
  return new;
end $$;
drop trigger if exists anggota_kelas_samakan_pelajaran on anggota_kelas;
create trigger anggota_kelas_samakan_pelajaran before insert or update on anggota_kelas
  for each row execute function samakan_pelajaran();

-- ---------- pendaftaran masa coba ----------
-- Memperluas tabel pendaftar (halaman staf "Pendaftar" yang sudah ada).
alter table pendaftar alter column email drop not null;
alter table pendaftar add column if not exists nama_lengkap_anak text check (char_length(nama_lengkap_anak) <= 60);
alter table pendaftar add column if not exists pelajaran text[] check (pelajaran_sah(pelajaran));
alter table pendaftar add column if not exists tujuan text check (char_length(tujuan) <= 200);
alter table pendaftar add column if not exists cara text check (cara in ('online', 'antre_tatap_muka'));
alter table pendaftar add column if not exists kota text check (char_length(kota) <= 40);
alter table pendaftar add column if not exists pengenalan jsonb check (pengenalan is null or jsonb_typeof(pengenalan) = 'object');
alter table pendaftar add column if not exists minta_telepon boolean not null default false;
alter table pendaftar add column if not exists waktu_telepon text check (waktu_telepon in ('pagi', 'siang', 'sore', 'malam'));
alter table pendaftar add column if not exists izin_kontak boolean not null default false;
alter table pendaftar add column if not exists izin_pengembangan boolean not null default false;
alter table pendaftar add column if not exists versi_teks text check (char_length(versi_teks) <= 40);
alter table pendaftar add column if not exists asal text check (asal in ('web', 'aplikasi'));
do $$ begin
  alter table pendaftar add constraint pendaftar_ada_kontak check (email is not null or wa is not null);
exception when duplicate_object then null; end $$;
create index if not exists pendaftar_cara on pendaftar (cara, kota) where status <> 'batal';

-- Kode jawaban pengenalan yang sah (pertanyaan ada di src/fitur/pengenalan.ts dan halaman/daftar.js).
create or replace function pengenalan_sah(p jsonb) returns boolean
  language sql immutable
as $$
  select p is null or (jsonb_typeof(p) = 'object'
    and (select count(*) from jsonb_object_keys(p)) <= 8
    and not exists (select 1 from jsonb_each(p) e
                    where e.key !~ '^[a-z_]{2,20}$' or jsonb_typeof(e.value) <> 'string' or (e.value #>> '{}') !~ '^[a-z0-9_]{1,20}$'))
$$;

-- Dipanggil website (tanpa masuk) dan mode orang tua di aplikasi. Dibatasi 3 kali per kontak per hari, 300 per jam.
create or replace function daftar_coba(p jsonb) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_email text := nullif(lower(trim(coalesce(p ->> 'email', ''))), '');
  v_wa text := nullif(left(regexp_replace(coalesce(p ->> 'wa', ''), '[^0-9+]', '', 'g'), 20), '');
  v_kelas int := case when (p ->> 'kelas') ~ '^[1-6]$' then (p ->> 'kelas')::int end;
  v_pel text[];
  v_cara text := coalesce(p ->> 'cara', 'online');
  v_peng jsonb := case when jsonb_typeof(p -> 'pengenalan') = 'object' then p -> 'pengenalan' end;
  v_telp text := nullif(p ->> 'waktu_telepon', '');
  v_kontak text;
  v_antre int;
begin
  if jsonb_typeof(p -> 'pelajaran') = 'array' then
    select coalesce(array_agg(distinct x order by x), '{}') into v_pel from jsonb_array_elements_text(p -> 'pelajaran') x;
  else v_pel := '{}'; end if;
  if char_length(trim(coalesce(p ->> 'nama_ortu', ''))) = 0 or char_length(trim(coalesce(p ->> 'nama_lengkap_anak', ''))) = 0
     or v_kelas is null or (v_email is null and v_wa is null)
     or (v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
     or (v_wa is not null and char_length(regexp_replace(v_wa, '[^0-9]', '', 'g')) < 9) then
    return jsonb_build_object('ok', false, 'alasan', 'isian_tidak_lengkap');
  end if;
  if not coalesce((p ->> 'izin_kontak')::boolean, false) or char_length(coalesce(p ->> 'versi_teks', '')) = 0 then
    return jsonb_build_object('ok', false, 'alasan', 'belum_setuju');
  end if;
  if not pelajaran_sah(v_pel) or v_cara not in ('online', 'antre_tatap_muka') or not pengenalan_sah(v_peng)
     or (v_telp is not null and v_telp not in ('pagi', 'siang', 'sore', 'malam')) then
    return jsonb_build_object('ok', false, 'alasan', 'isian_tidak_valid');
  end if;
  if v_cara = 'antre_tatap_muka' and char_length(trim(coalesce(p ->> 'kota', ''))) = 0 then
    return jsonb_build_object('ok', false, 'alasan', 'kota_kosong');
  end if;
  v_pel := array(select x from unnest(v_pel) x where x <> 'tka' or v_kelas = 6);
  v_kontak := coalesce(v_email, v_wa);
  if (select count(*) from pendaftar where coalesce(email, wa) = v_kontak and waktu > now() - interval '1 day') >= 3
     or (select count(*) from pendaftar where waktu > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'alasan', 'terlalu_sering');
  end if;
  insert into pendaftar (jenis, nama_ortu, email, wa, kelas_anak, nama_anak, nama_lengkap_anak, sumber, pelajaran, tujuan, cara, kota,
                         pengenalan, minta_telepon, waktu_telepon, izin_kontak, izin_pengembangan, versi_teks, asal)
  values ('keluarga', left(trim(p ->> 'nama_ortu'), 40), v_email, v_wa, v_kelas,
          left(split_part(trim(p ->> 'nama_lengkap_anak'), ' ', 1), 16), left(trim(p ->> 'nama_lengkap_anak'), 60),
          left(trim(p ->> 'sumber'), 40), v_pel, left(nullif(trim(p ->> 'tujuan'), ''), 200), v_cara,
          case when v_cara = 'antre_tatap_muka' then left(trim(p ->> 'kota'), 40) end,
          v_peng, coalesce((p ->> 'minta_telepon')::boolean, false), case when coalesce((p ->> 'minta_telepon')::boolean, false) then v_telp end,
          true, coalesce((p ->> 'izin_pengembangan')::boolean, false), left(p ->> 'versi_teks', 40),
          case when p ->> 'asal' = 'aplikasi' then 'aplikasi' else 'web' end);
  if v_cara = 'antre_tatap_muka' then
    select count(*) into v_antre from pendaftar
      where cara = 'antre_tatap_muka' and lower(kota) = lower(trim(p ->> 'kota')) and status <> 'batal';
  end if;
  return jsonb_build_object('ok', true, 'harga', hitung_harga(v_pel, v_kelas, 1), 'nomor_antrean', v_antre);
end $$;
grant execute on function daftar_coba(jsonb) to anon, authenticated;

-- Staf: jumlah antrean tatap muka per kota (super admin dan admin).
create or replace function antrean_tatap_muka() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object('kota', kota, 'jumlah', n) order by n desc), '[]')
  from (select initcap(lower(kota)) kota, count(*) n from pendaftar
        where boleh_uang() and cara = 'antre_tatap_muka' and status <> 'batal' group by 1) x
$$;
grant execute on function antrean_tatap_muka() to authenticated;

-- ---------- kelas_keluarga ikut mengirim pelajaran pilihan ----------
create or replace function kelas_keluarga() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'anggota_id', a.id, 'anak_id', a.anak_id, 'kelas_id', k.id, 'kelas_nama', k.nama,
    'pengawas_nama', (select s.nama from staf s where s.id = k.pengawas_id),
    'paket', a.paket, 'pelajaran', to_jsonb(a.pelajaran), 'masuk', a.masuk, 'coba_sampai', a.coba_sampai,
    'berlaku_sampai', a.berlaku_sampai, 'status', status_anggota(a.coba_sampai, a.berlaku_sampai, k.mitra_id),
    'setuju_pemakaian', pemakaian_disetujui(a.anak_id)
  ) order by a.masuk), '[]')
  from anggota_kelas a join kelas k on k.id = a.kelas_id
  where a.keluar is null
    and (a.keluarga_id = keluarga_saya() or a.anak_id = any (anak_perangkat()))
$$;
grant execute on function kelas_keluarga() to authenticated;
