-- Pintar Main — skema awal (docs/rancangan/02-rancangan/03-basis-data.md).
-- Satu pola akses: setiap baris anak membawa keluarga_id; orang tua hanya membaca keluarganya sendiri.
-- Nomor (id) dibuat di HP; server memakai sisip-atau-abaikan supaya kiriman ulang tidak ganda.

create extension if not exists "pgcrypto";

-- ---------- keluarga dan akun ----------
create table if not exists keluarga (
  id uuid primary key,
  dibuat timestamptz not null default now(),
  status text not null default 'uji' check (status in ('uji', 'aktif', 'diam', 'dihapus')),
  perintis boolean not null default false,
  sapaan_ortu text
);

create table if not exists orang_tua (
  id uuid primary key references auth.users (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  nama_panggilan text,
  peran text not null default 'pemilik' check (peran in ('pemilik', 'kedua')),
  cara_terlibat text check (cara_terlibat in ('D', 'J', 'L')),
  pin_hash text,
  dibuat timestamptz not null default now()
);

create table if not exists perangkat (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  jenis text not null check (jenis in ('anak', 'orang_tua')),
  anak_ids uuid[] not null default '{}',
  terakhir_sinkron timestamptz,
  antrean_belum_kirim int not null default 0,
  versi_aplikasi text,
  diputus boolean not null default false
);

create table if not exists persetujuan (
  id uuid primary key default gen_random_uuid(),
  orang_tua_id uuid not null references orang_tua (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  tujuan text not null,
  versi_teks text not null,
  setuju boolean not null,
  waktu timestamptz not null default now()
);

create table if not exists anak (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  nama text not null check (char_length(nama) between 1 and 16),
  kelas int not null check (kelas between 1 and 6),
  hewan text not null,
  tingkat_inggris int check (tingkat_inggris between 3 and 6),
  dibuat timestamptz not null default now()
);

-- ---------- latihan ----------
create table if not exists sesi (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  jenis text not null check (jenis in ('penempatan', 'lancar', 'tka', 'simulasi', 'mini_tryout', 'baca', 'inggris', 'kartu', 'game')),
  mode text not null check (mode in ('sendiri', 'dampingi')),
  kelas int not null,
  level int,
  rujukan text,
  mulai timestamptz not null,
  selesai timestamptz not null,
  durasi_detik int not null,
  benih text,
  hasil text,
  benar int not null,
  jumlah int not null,
  perasaan text,
  urutan_hp int not null,
  tambahan jsonb,
  diterima_server timestamptz not null default now()
);
create index if not exists sesi_anak_mulai on sesi (anak_id, mulai);

create table if not exists jawaban (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  sesi_id uuid not null references sesi (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  urutan int not null,
  soal text not null,
  butir_id text,
  kunci text not null,
  jawaban text not null,
  benar boolean not null,
  detik numeric not null,
  hapus_n int not null default 0,
  ulang boolean,
  kode_salah text,
  topik text,
  petunjuk_dipakai int
);
create index if not exists jawaban_sesi on jawaban (sesi_id);

create table if not exists kemajuan_topik (
  id text primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  mapel text not null,
  topik text not null,
  status text not null check (status in ('belum', 'belajar', 'kuasai')),
  benar int not null,
  salah int not null,
  petunjuk int not null,
  terakhir timestamptz not null,
  tanda text not null check (tanda in ('hijau', 'kuning', 'merah')),
  alasan text
);

create table if not exists pesan (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  dari text not null check (dari in ('orang_tua', 'anak')),
  jenis text not null check (jenis in ('teks', 'stiker', 'siap_pakai', 'bantu_aku')),
  isi text not null check (char_length(isi) <= 200),
  waktu timestamptz not null,
  dibaca timestamptz
);

create table if not exists pengaturan_waktu (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  belajar_menit int not null check (belajar_menit between 5 and 60),
  game_menit int not null check (game_menit between 0 and 60),
  game_setelah_inti boolean not null default true,
  jam_tenang text not null default '21:00',
  jam_bangun text not null default '06:00',
  bunyi boolean not null default true
);

create table if not exists pemakaian (
  id text primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  tanggal date not null,
  belajar_detik int not null,
  main_detik int not null,
  blok_detik int not null,
  istirahat_sampai timestamptz,
  inti_selesai boolean not null
);

-- ---------- Row Level Security (03-basis-data.md bagian 4) ----------
-- Keluarga milik pengguna yang sedang masuk (orang tua).
create or replace function keluarga_saya() returns uuid
  language sql stable security definer set search_path = public
as $$ select keluarga_id from orang_tua where id = auth.uid() $$;

-- HP anak masuk dengan token perangkat yang membawa klaim perangkat_id; anak yang boleh ditulis = perangkat.anak_ids.
create or replace function anak_perangkat() returns uuid[]
  language sql stable security definer set search_path = public
as $$
  select coalesce((select anak_ids from perangkat
    where id = nullif(auth.jwt() ->> 'perangkat_id', '')::uuid and not diputus), '{}')
$$;

alter table keluarga enable row level security;
alter table orang_tua enable row level security;
alter table perangkat enable row level security;
alter table persetujuan enable row level security;
alter table anak enable row level security;
alter table sesi enable row level security;
alter table jawaban enable row level security;
alter table kemajuan_topik enable row level security;
alter table pesan enable row level security;
alter table pengaturan_waktu enable row level security;
alter table pemakaian enable row level security;

create policy keluarga_baca on keluarga for select using (id = keluarga_saya());
create policy keluarga_ubah on keluarga for update using (id = keluarga_saya());
create policy ortu_baca on orang_tua for select using (keluarga_id = keluarga_saya());
create policy ortu_diri on orang_tua for update using (id = auth.uid());
create policy perangkat_keluarga on perangkat for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());
create policy persetujuan_pemilik on persetujuan for all using (keluarga_id = keluarga_saya()) with check (orang_tua_id = auth.uid());

-- Orang tua: semua baris keluarganya. HP anak: hanya anak yang terdaftar di perangkatnya.
do $$
declare t text;
begin
  foreach t in array array['anak', 'sesi', 'jawaban', 'kemajuan_topik', 'pesan', 'pengaturan_waktu', 'pemakaian'] loop
    execute format('create policy %1$s_ortu on %1$s for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya())', t);
  end loop;
  foreach t in array array['sesi', 'jawaban', 'kemajuan_topik', 'pemakaian'] loop
    execute format('create policy %1$s_hp_anak on %1$s for all using (anak_id = any (anak_perangkat())) with check (anak_id = any (anak_perangkat()))', t);
  end loop;
end $$;

-- HP anak: baca profil dan pengaturan anaknya, baca pesan untuknya, kirim stiker (bukan teks bebas).
create policy anak_hp_baca on anak for select using (id = any (anak_perangkat()));
create policy atur_hp_baca on pengaturan_waktu for select using (anak_id = any (anak_perangkat()));
create policy pesan_hp_baca on pesan for select using (anak_id = any (anak_perangkat()));
create policy pesan_hp_stiker on pesan for insert with check (anak_id = any (anak_perangkat()) and dari = 'anak' and jenis in ('stiker', 'bantu_aku'));

-- Sesi dan jawaban hanya ditambah, tidak diubah: cabut hak update/delete dari peran aplikasi.
revoke update, delete on sesi, jawaban from anon, authenticated;

-- Pendaftaran pertama: keluarga dibuat di HP (id dari HP), lalu didaftarkan atomik bersama orang tua pemilik.
-- Hanya boleh untuk keluarga yang belum punya orang tua, supaya orang lain tidak bisa "bergabung" dengan menebak id.
create or replace function daftarkan_keluarga(p_id uuid, p_sapaan text) returns boolean
  language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from orang_tua where id = auth.uid()) then
    return (select keluarga_id = p_id from orang_tua where id = auth.uid());
  end if;
  if exists (select 1 from orang_tua where keluarga_id = p_id) then return false; end if;
  insert into keluarga (id, sapaan_ortu) values (p_id, p_sapaan) on conflict (id) do nothing;
  insert into orang_tua (id, keluarga_id, peran) values (auth.uid(), p_id, 'pemilik');
  return true;
end $$;
grant execute on function daftarkan_keluarga(uuid, text) to authenticated;
