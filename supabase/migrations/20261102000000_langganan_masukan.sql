-- Pintar Main — langganan, pembayaran manual (QRIS), harga paket, masukan orang tua, catatan pemakaian dan teknis,
-- pendaftar dari halaman penjelasan, laporan mingguan, dan tagihan mitra les.
-- Rancangan: docs/rancangan/08-model-usaha/01-model-usaha-dan-pengawas.md bagian 6–8.
--
-- Status langganan seorang anak di kelas:
--   coba      : masih dalam 14 hari masa coba dan belum membayar
--   aktif     : sudah membayar, berlaku_sampai belum lewat
--   tenggang  : sudah lewat, tetapi belum 7 hari (pantauan masih berjalan)
--   berhenti  : lewat lebih dari 7 hari (pantauan berhenti; latihan inti tetap terbuka di HP)
--   mitra     : anak di kelas les mitra (les mitra yang ditagih, bukan keluarga)

-- ---------- langganan ----------
alter table anggota_kelas add column if not exists berlaku_sampai timestamptz;

create or replace function status_anggota(p_coba timestamptz, p_berlaku timestamptz, p_mitra uuid) returns text
  language sql stable
as $$
  select case
    when p_mitra is not null then 'mitra'
    when p_berlaku is not null and p_berlaku > now() then 'aktif'
    when p_coba > now() then 'coba'
    when greatest(p_coba, coalesce(p_berlaku, p_coba)) + interval '7 days' > now() then 'tenggang'
    else 'berhenti'
  end
$$;

create table if not exists harga_paket (
  paket text primary key check (paket in ('dasar', 'lengkap', 'siap_tka', 'mitra')),
  harga int not null check (harga between 0 and 10000000),
  diubah timestamptz not null default now()
);
-- Harga awal hanya contoh; diubah super admin dari halaman staf (keputusan.md L no. 11).
insert into harga_paket (paket, harga) values ('dasar', 50000), ('lengkap', 60000), ('siap_tka', 70000), ('mitra', 70000)
  on conflict (paket) do nothing;

create table if not exists pembayaran (
  id uuid primary key default gen_random_uuid(),
  anggota_id uuid not null references anggota_kelas (id) on delete cascade,
  anak_id uuid not null references anak (id) on delete cascade,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  bulan int not null check (bulan between 1 and 12),
  jumlah int not null check (jumlah >= 0),
  cara text not null check (cara in ('qris', 'transfer', 'tunai', 'play')),
  catatan text check (char_length(catatan) <= 200),
  staf_id uuid references staf (id) on delete set null,
  waktu timestamptz not null default now()
);
create index if not exists pembayaran_waktu on pembayaran (waktu);

-- ---------- masukan dan catatan ----------
create table if not exists masukan (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  orang_tua_id uuid references orang_tua (id) on delete set null,
  jenis text not null check (jenis in ('masalah', 'saran', 'pujian')),
  isi text not null check (char_length(isi) between 1 and 1000),
  versi_aplikasi text check (char_length(versi_aplikasi) <= 40),
  waktu timestamptz not null default now(),
  dibaca boolean not null default false
);

create table if not exists jawaban_pertanyaan (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  kode text not null check (char_length(kode) <= 20),
  jawaban text not null check (char_length(jawaban) <= 80),
  waktu timestamptz not null default now()
);

create table if not exists catatan_pemakaian (
  id uuid primary key,
  keluarga_id uuid not null references keluarga (id) on delete cascade,
  anak_id uuid references anak (id) on delete cascade,
  kejadian text not null check (kejadian in ('buka_aplikasi', 'selesai', 'berhenti')),
  layar text not null check (char_length(layar) <= 40),
  detik int check (detik between 0 and 86400),
  waktu timestamptz not null default now()
);
create index if not exists catatan_pemakaian_waktu on catatan_pemakaian (waktu);

create table if not exists catatan_teknis (
  id uuid primary key,
  keluarga_id uuid references keluarga (id) on delete cascade,
  pesan text not null check (char_length(pesan) <= 500),
  tempat text check (char_length(tempat) <= 80),
  versi_aplikasi text check (char_length(versi_aplikasi) <= 40),
  perangkat text check (char_length(perangkat) <= 60),
  waktu timestamptz not null default now()
);
create index if not exists catatan_teknis_waktu on catatan_teknis (waktu);

-- ---------- pendaftar dari halaman penjelasan ----------
create table if not exists pendaftar (
  id uuid primary key default gen_random_uuid(),
  jenis text not null check (jenis in ('keluarga', 'mitra')),
  nama_ortu text not null check (char_length(nama_ortu) between 1 and 40),
  email text not null check (char_length(email) <= 120 and email like '%@%'),
  wa text check (char_length(wa) <= 20),
  kelas_anak int check (kelas_anak between 1 and 6),
  nama_anak text check (char_length(nama_anak) <= 16),
  nama_les text check (char_length(nama_les) <= 60),
  sumber text check (char_length(sumber) <= 40),
  status text not null default 'baru' check (status in ('baru', 'dihubungi', 'masuk_kelas', 'batal')),
  catatan text check (char_length(catatan) <= 200),
  waktu timestamptz not null default now()
);
create index if not exists pendaftar_waktu on pendaftar (waktu);

-- ---------- aturan baris ----------
alter table harga_paket enable row level security;
alter table pembayaran enable row level security;
alter table masukan enable row level security;
alter table jawaban_pertanyaan enable row level security;
alter table catatan_pemakaian enable row level security;
alter table catatan_teknis enable row level security;
alter table pendaftar enable row level security;
revoke all on harga_paket, pembayaran, pendaftar from anon, authenticated;
revoke all on masukan, jawaban_pertanyaan, catatan_pemakaian, catatan_teknis from anon;
revoke update, delete on masukan, jawaban_pertanyaan, catatan_pemakaian, catatan_teknis from authenticated;

-- Persetujuan catatan pemakaian terakhir untuk anak ini (bawaan: tidak setuju).
create or replace function pemakaian_disetujui(p_anak uuid) returns boolean
  language sql stable security definer set search_path = public
as $$
  select coalesce((select setuju from persetujuan where anak_id = p_anak and tujuan = 'catatan_pemakaian' order by waktu desc limit 1), false)
$$;

drop policy if exists masukan_ortu on masukan;
create policy masukan_ortu on masukan for insert with check (keluarga_id = keluarga_saya() and orang_tua_id = auth.uid());
drop policy if exists masukan_staf on masukan;
create policy masukan_staf on masukan for select using (peran_saya() in ('super_admin', 'admin'));

drop policy if exists jawaban_tanya_ortu on jawaban_pertanyaan;
create policy jawaban_tanya_ortu on jawaban_pertanyaan for insert with check (keluarga_id = keluarga_saya());
drop policy if exists jawaban_tanya_staf on jawaban_pertanyaan;
create policy jawaban_tanya_staf on jawaban_pertanyaan for select using (peran_saya() in ('super_admin', 'admin'));

-- Catatan pemakaian hanya diterima bila orang tua menyetujuinya untuk anak itu.
drop policy if exists pemakaian_catat on catatan_pemakaian;
create policy pemakaian_catat on catatan_pemakaian for insert with check (
  (keluarga_id = keluarga_saya() or (keluarga_id = keluarga_perangkat() and anak_id = any (anak_perangkat())))
  and anak_id is not null and pemakaian_disetujui(anak_id)
);
drop policy if exists pemakaian_staf on catatan_pemakaian;
create policy pemakaian_staf on catatan_pemakaian for select using (peran_saya() in ('super_admin', 'admin'));

-- Catatan teknis tanpa data pribadi: boleh dari HP mana pun yang masuk, untuk keluarganya sendiri atau tanpa keluarga.
drop policy if exists teknis_catat on catatan_teknis;
create policy teknis_catat on catatan_teknis for insert with check (
  keluarga_id is null or keluarga_id = keluarga_saya() or keluarga_id = keluarga_perangkat()
);
drop policy if exists teknis_staf on catatan_teknis;
create policy teknis_staf on catatan_teknis for select using (peran_saya() in ('super_admin', 'admin'));

-- ---------- fungsi: orang tua ----------
-- Kelas anak-anak di keluarga ini atau di HP ini, ditambah status langganan dan persetujuan pemakaian.
create or replace function kelas_keluarga() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'anggota_id', a.id, 'anak_id', a.anak_id, 'kelas_id', k.id, 'kelas_nama', k.nama,
    'pengawas_nama', (select s.nama from staf s where s.id = k.pengawas_id),
    'paket', a.paket, 'masuk', a.masuk, 'coba_sampai', a.coba_sampai, 'berlaku_sampai', a.berlaku_sampai,
    'status', status_anggota(a.coba_sampai, a.berlaku_sampai, k.mitra_id),
    'setuju_pemakaian', pemakaian_disetujui(a.anak_id)
  ) order by a.masuk), '[]')
  from anggota_kelas a join kelas k on k.id = a.kelas_id
  where a.keluar is null
    and (a.keluarga_id = keluarga_saya() or a.anak_id = any (anak_perangkat()))
$$;
grant execute on function kelas_keluarga() to authenticated;

-- Orang tua mengubah persetujuan catatan pemakaian (bisa dimatikan kapan saja tanpa kehilangan layanan).
create or replace function atur_persetujuan_pemakaian(p_anak_id uuid, p_setuju boolean, p_versi_teks text) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from anak where id = p_anak_id and keluarga_id = keluarga_saya()) then
    raise exception 'anak_tidak_valid' using errcode = '42501';
  end if;
  -- clock_timestamp: persetujuan terbaru harus menang walau diubah dua kali dalam satu transaksi.
  insert into persetujuan (orang_tua_id, keluarga_id, tujuan, versi_teks, setuju, anak_id, waktu)
    values (auth.uid(), keluarga_saya(), 'catatan_pemakaian', coalesce(p_versi_teks, '-'), p_setuju, p_anak_id, clock_timestamp());
end $$;
grant execute on function atur_persetujuan_pemakaian(uuid, boolean, text) to authenticated;

-- ---------- fungsi: langganan (super admin dan admin) ----------
create or replace function boleh_uang() returns boolean
  language sql stable security definer set search_path = public
as $$ select peran_saya() in ('super_admin', 'admin') $$;

create or replace function daftar_langganan() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'anak_id', a.anak_id, 'anak_nama', an.nama, 'kelas', an.kelas, 'kelas_nama', k.nama, 'paket', a.paket,
    'coba_sampai', a.coba_sampai, 'berlaku_sampai', a.berlaku_sampai,
    'status', status_anggota(a.coba_sampai, a.berlaku_sampai, k.mitra_id),
    'email_ortu', (select u.email from orang_tua o join auth.users u on u.id = o.id
                   where o.keluarga_id = a.keluarga_id and o.peran = 'pemilik' limit 1),
    'sapaan', (select sapaan_ortu from keluarga where id = a.keluarga_id)
  ) order by a.coba_sampai), '[]')
  from anggota_kelas a join kelas k on k.id = a.kelas_id join anak an on an.id = a.anak_id
  where boleh_uang() and a.keluar is null and k.mitra_id is null and k.id in (select kelas_saya())
$$;
grant execute on function daftar_langganan() to authenticated;

create or replace function aktifkan_langganan(p_anak_id uuid, p_bulan int, p_jumlah int, p_cara text, p_catatan text default null)
  returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_a anggota_kelas%rowtype;
  v_mitra uuid;
  v_sampai timestamptz;
begin
  if not boleh_uang() then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  select a.* into v_a from anggota_kelas a where a.anak_id = p_anak_id and a.keluar is null for update;
  if not found then raise exception 'tidak_di_kelas'; end if;
  select mitra_id into v_mitra from kelas where id = v_a.kelas_id;
  if v_mitra is not null then raise exception 'kelas_mitra'; end if;
  if v_a.kelas_id not in (select kelas_saya()) then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  if p_bulan is null or p_bulan < 1 or p_bulan > 12 then raise exception 'bulan_tidak_valid'; end if;
  -- Perpanjangan dihitung dari yang paling akhir: sekarang, akhir masa coba, atau akhir langganan sebelumnya.
  v_sampai := greatest(now(), v_a.coba_sampai, coalesce(v_a.berlaku_sampai, now())) + make_interval(months => p_bulan);
  update anggota_kelas set berlaku_sampai = v_sampai where id = v_a.id;
  insert into pembayaran (anggota_id, anak_id, keluarga_id, bulan, jumlah, cara, catatan, staf_id)
    values (v_a.id, v_a.anak_id, v_a.keluarga_id, p_bulan, coalesce(p_jumlah, 0), p_cara, nullif(trim(p_catatan), ''), auth.uid());
  perform catat_kegiatan('aktifkan_langganan', p_anak_id::text, jsonb_build_object('bulan', p_bulan, 'jumlah', p_jumlah, 'cara', p_cara));
  return jsonb_build_object('berlaku_sampai', v_sampai);
end $$;
grant execute on function aktifkan_langganan(uuid, int, int, text, text) to authenticated;

-- Harga hanya untuk super admin (admin tidak melihat uang dan harga).
create or replace function daftar_harga() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_object_agg(paket, harga), '{}') from harga_paket where peran_saya() = 'super_admin'
$$;
grant execute on function daftar_harga() to authenticated;

create or replace function atur_harga(p_paket text, p_harga int) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if peran_saya() is distinct from 'super_admin' then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  update harga_paket set harga = p_harga, diubah = now() where paket = p_paket;
  if not found then raise exception 'paket_tidak_valid'; end if;
  perform catat_kegiatan('atur_harga', p_paket, jsonb_build_object('harga', p_harga));
end $$;
grant execute on function atur_harga(text, int) to authenticated;

-- ---------- fungsi: tagihan mitra les ----------
-- Murid aktif = anak di kelas les itu yang latihan minimal 1 hari pada bulan tersebut.
create or replace function tagihan_mitra(p_bulan date) returns jsonb
  language sql stable security definer set search_path = public
as $$
  with batas as (
    select date_trunc('month', p_bulan::timestamp) at time zone 'Asia/Jakarta' as awal,
           (date_trunc('month', p_bulan::timestamp) + interval '1 month') at time zone 'Asia/Jakarta' as akhir
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'mitra_id', m.id, 'nama', m.nama, 'murid_aktif', x.n, 'tarif', (select harga from harga_paket where paket = 'mitra'),
    'total', x.n * (select harga from harga_paket where paket = 'mitra')
  ) order by m.nama), '[]')
  from mitra m
  cross join lateral (
    select count(distinct a.anak_id) as n
    from anggota_kelas a join kelas k on k.id = a.kelas_id, batas b
    where k.mitra_id = m.id
      and a.masuk < b.akhir and (a.keluar is null or a.keluar >= b.awal)
      and exists (select 1 from sesi s where s.anak_id = a.anak_id and s.mulai >= b.awal and s.mulai < b.akhir)
  ) x
  where peran_saya() = 'super_admin' or (peran_saya() = 'mitra' and m.id = mitra_saya())
$$;
grant execute on function tagihan_mitra(date) to authenticated;

-- ---------- fungsi: pendaftar ----------
-- Dipanggil halaman penjelasan tanpa masuk (anon). Dibatasi: 3 kali per email per hari, 300 per jam di seluruh server.
create or replace function daftar_minat(
  p_jenis text, p_nama_ortu text, p_email text, p_wa text, p_kelas_anak int, p_nama_anak text, p_nama_les text, p_sumber text
) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare v_email text := lower(trim(coalesce(p_email, '')));
begin
  if p_jenis not in ('keluarga', 'mitra') or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(trim(coalesce(p_nama_ortu, ''))) = 0 then
    return jsonb_build_object('ok', false, 'alasan', 'isian_tidak_lengkap');
  end if;
  if (select count(*) from pendaftar where email = v_email and waktu > now() - interval '1 day') >= 3
     or (select count(*) from pendaftar where waktu > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'alasan', 'terlalu_sering');
  end if;
  insert into pendaftar (jenis, nama_ortu, email, wa, kelas_anak, nama_anak, nama_les, sumber)
    values (p_jenis, left(trim(p_nama_ortu), 40), v_email, left(regexp_replace(coalesce(p_wa, ''), '[^0-9+]', '', 'g'), 20),
            case when p_kelas_anak between 1 and 6 then p_kelas_anak end, left(trim(p_nama_anak), 16),
            left(trim(p_nama_les), 60), left(trim(p_sumber), 40));
  return jsonb_build_object('ok', true);
end $$;
grant execute on function daftar_minat(text, text, text, text, int, text, text, text) to anon, authenticated;

create or replace function daftar_pendaftar() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(to_jsonb(p) order by p.waktu desc), '[]')
  from (select * from pendaftar where boleh_uang() order by waktu desc limit 300) p
$$;
grant execute on function daftar_pendaftar() to authenticated;

create or replace function ubah_pendaftar(p_id uuid, p_status text, p_catatan text) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if not boleh_uang() then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  update pendaftar set status = p_status, catatan = nullif(trim(p_catatan), '') where id = p_id;
end $$;
grant execute on function ubah_pendaftar(uuid, text, text) to authenticated;

-- ---------- fungsi: masukan untuk staf ----------
create or replace function daftar_masukan() returns jsonb
  language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'masukan', coalesce((select jsonb_agg(jsonb_build_object('id', m.id, 'jenis', m.jenis, 'isi', m.isi, 'waktu', m.waktu,
                         'versi', m.versi_aplikasi, 'dibaca', m.dibaca,
                         'sapaan', (select sapaan_ortu from keluarga where id = m.keluarga_id)) order by m.waktu desc)
                         from (select * from masukan order by waktu desc limit 200) m), '[]'),
    'teknis', coalesce((select jsonb_agg(jsonb_build_object('pesan', t.pesan, 'jumlah', t.n, 'terakhir', t.terakhir) order by t.n desc)
                        from (select left(pesan, 160) as pesan, count(*) as n, max(waktu) as terakhir from catatan_teknis
                              where waktu > now() - interval '30 days' group by left(pesan, 160) order by count(*) desc limit 30) t), '[]')
  ) where boleh_uang()
$$;
grant execute on function daftar_masukan() to authenticated;

create or replace function tandai_masukan_dibaca(p_ids uuid[]) returns void
  language plpgsql security definer set search_path = public
as $$
begin
  if not boleh_uang() then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  update masukan set dibaca = true where id = any (p_ids);
end $$;
grant execute on function tandai_masukan_dibaca(uuid[]) to authenticated;

-- ---------- fungsi: laporan mingguan ----------
create or replace function laporan_mingguan() returns jsonb
  language plpgsql stable security definer set search_path = public
as $$
declare
  v_hasil jsonb;
  v_sejak timestamptz := now() - interval '7 days';
begin
  if not boleh_uang() then raise exception 'tidak_boleh' using errcode = '42501'; end if;
  select jsonb_build_object(
    'sejak', v_sejak,
    'keluarga_aktif', (select count(distinct keluarga_id) from sesi where mulai >= v_sejak),
    'anak_aktif', (select count(distinct anak_id) from sesi where mulai >= v_sejak),
    'rata_hari_latihan', (select round(avg(n), 1) from (select count(distinct (mulai at time zone 'Asia/Jakarta')::date) as n
                                                    from sesi where mulai >= v_sejak group by anak_id) x),
    'status', (select coalesce(jsonb_object_agg(s, n), '{}') from (
                 select status_anggota(a.coba_sampai, a.berlaku_sampai, k.mitra_id) as s, count(*) as n
                 from anggota_kelas a join kelas k on k.id = a.kelas_id where a.keluar is null group by 1) y),
    'anak_berhenti_latihan', (select count(*) from anggota_kelas a where a.keluar is null
                                and not exists (select 1 from sesi s where s.anak_id = a.anak_id and s.mulai >= v_sejak)),
    'keluar_kelas', (select count(*) from anggota_kelas where keluar >= v_sejak),
    'masuk_kelas', (select count(*) from anggota_kelas where masuk >= v_sejak),
    'pendaftar_baru', (select count(*) from pendaftar where waktu >= v_sejak),
    'pendaftar_per_sumber', (select coalesce(jsonb_object_agg(coalesce(sumber, '-'), n), '{}') from (
                               select sumber, count(*) as n from pendaftar where waktu >= v_sejak group by sumber) z),
    'masukan_baru', (select count(*) from masukan where waktu >= v_sejak),
    'masalah_teknis', (select count(*) from catatan_teknis where waktu >= v_sejak),
    'kelas_tanpa_pantauan', (select coalesce(jsonb_agg(k.nama), '[]') from kelas k where k.aktif
                               and exists (select 1 from anggota_kelas a where a.kelas_id = k.id and a.keluar is null)
                               and not exists (select 1 from pantauan p where p.kelas_id = k.id and p.waktu >= v_sejak)),
    'pantauan_minggu_ini', (select count(*) from pantauan where waktu >= v_sejak),
    'uang_minggu_ini', case when peran_saya() = 'super_admin' then (select coalesce(sum(jumlah), 0) from pembayaran where waktu >= v_sejak) end,
    'bayar_minggu_ini', (select count(*) from pembayaran where waktu >= v_sejak)
  ) into v_hasil;
  return v_hasil;
end $$;
grant execute on function laporan_mingguan() to authenticated;

-- Papan kelas menampilkan status langganan tiap anak (pantauan berhenti bila status "berhenti").
create or replace function status_anak_kelas(p_kelas_id uuid) returns jsonb
  language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_object_agg(a.anak_id, status_anggota(a.coba_sampai, a.berlaku_sampai, k.mitra_id)), '{}')
  from anggota_kelas a join kelas k on k.id = a.kelas_id
  where a.kelas_id = p_kelas_id and a.keluar is null and p_kelas_id in (select kelas_saya())
$$;
grant execute on function status_anak_kelas(uuid) to authenticated;

revoke execute on function daftar_minat(text, text, text, text, int, text, text, text) from public;
grant execute on function daftar_minat(text, text, text, text, int, text, text, text) to anon, authenticated;
