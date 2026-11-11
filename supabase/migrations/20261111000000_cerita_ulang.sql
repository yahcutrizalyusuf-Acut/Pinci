-- Hasil Ceritakan Lagi (D10, rancangan 13 bagian 3.4 dan 8). Bukan nilai.
-- TIDAK ADA kolom isi rekaman: rekaman suara anak hanya di HP (CLAUDE.md aturan 12); yang dikirim hanya ada_rekaman ya/tidak.
-- Hanya keluarga sendiri (orang tua dan HP anak yang terhubung) yang bisa membaca dan menambah. Staf, pengawas,
-- mitra les, dan guru tidak punya aturan baca di tabel ini.
create table if not exists cerita_ulang (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  komik_id text not null check (char_length(komik_id) <= 40),
  tanggal date not null,
  waktu timestamptz not null,
  mode text not null default 'dampingi' check (mode in ('dampingi')),
  centang_tokoh boolean not null default false,
  centang_urutan boolean not null default false,
  centang_inggris boolean not null default false,
  centang_selesai boolean not null default false,
  kata_target_dicentang text[] not null default '{}' check (cardinality(kata_target_dicentang) <= 12),
  ada_rekaman boolean not null default false,
  diubah timestamptz not null default now()
);
create index if not exists cerita_ulang_anak on cerita_ulang (anak_id, waktu);
create index if not exists cerita_ulang_diubah on cerita_ulang (keluarga_id, diubah);
drop trigger if exists cerita_ulang_diubah_tg on cerita_ulang;
create trigger cerita_ulang_diubah_tg before insert or update on cerita_ulang for each row execute function catat_diubah();

alter table cerita_ulang enable row level security;
revoke all on cerita_ulang from anon;
-- Hanya ditambah, tidak diubah atau dihapus dari aplikasi (hapus anak = cascade dari tabel anak).
revoke update, delete on cerita_ulang from authenticated;

drop policy if exists cerita_ulang_ortu on cerita_ulang;
create policy cerita_ulang_ortu on cerita_ulang for all using (keluarga_id = keluarga_saya()) with check (keluarga_id = keluarga_saya());
drop policy if exists cerita_ulang_hp_anak on cerita_ulang;
create policy cerita_ulang_hp_anak on cerita_ulang for all using (anak_id = any (anak_perangkat())) with check (anak_id = any (anak_perangkat()) and keluarga_id = keluarga_perangkat());
