-- Uji wajib untuk langganan, masukan, catatan pemakaian, pendaftar, laporan, dan tagihan mitra
-- (20261102000000_langganan_masukan.sql). Selesai tanpa pesan "GAGAL" = lulus. Semua dibatalkan di akhir (rollback).
begin;
  insert into auth.users (id, email) values
    ('00000000-0000-0000-0000-00000000005a', 'super@contoh.id'),
    ('00000000-0000-0000-0000-0000000000ad', 'admin@contoh.id'),
    ('00000000-0000-0000-0000-0000000000e1', 'pengawas@contoh.id'),
    ('00000000-0000-0000-0000-0000000000f1', 'pemilik-les@contoh.id'),
    ('00000000-0000-0000-0000-0000000000a1', 'ortu-a@contoh.id'),
    ('00000000-0000-0000-0000-0000000000b1', 'ortu-b@contoh.id');
  insert into keluarga (id, sapaan_ortu) values ('10000000-0000-0000-0000-0000000000a1', 'Bunda'), ('10000000-0000-0000-0000-0000000000b1', 'Ayah');
  insert into orang_tua (id, keluarga_id) values
    ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1'),
    ('00000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values
    ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Rani', 6, 'kucing'),
    ('20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'Sari', 4, 'ikan');
  insert into perangkat (id, keluarga_id, jenis, anak_ids) values
    ('00000000-0000-0000-0000-0000000000c9', '10000000-0000-0000-0000-0000000000a1', 'anak', array['20000000-0000-0000-0000-0000000000a1']::uuid[]);
  insert into mitra (id, nama) values ('30000000-0000-0000-0000-0000000000f1', 'Les Cahaya');
  insert into staf (id, peran, mitra_id, nama) values
    ('00000000-0000-0000-0000-00000000005a', 'super_admin', null, 'Acut'),
    ('00000000-0000-0000-0000-0000000000ad', 'admin', null, 'Admin'),
    ('00000000-0000-0000-0000-0000000000e1', 'pengawas', null, 'Kak Nisa'),
    ('00000000-0000-0000-0000-0000000000f1', 'mitra', '30000000-0000-0000-0000-0000000000f1', 'Bu Cahaya');
  insert into kelas (id, nama, mitra_id, pengawas_id, kode) values
    ('40000000-0000-0000-0000-000000000001', 'Kancil', null, '00000000-0000-0000-0000-0000000000e1', 'KNCAAA'),
    ('40000000-0000-0000-0000-000000000002', 'Cahaya A', '30000000-0000-0000-0000-0000000000f1', null, 'CHYAAA');
  insert into anggota_kelas (id, kelas_id, anak_id, keluarga_id, paket, coba_sampai) values
    ('50000000-0000-0000-0000-0000000000a1', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'siap_tka', now() + interval '3 days'),
    ('50000000-0000-0000-0000-0000000000b1', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'dasar', now() + interval '14 days');
  insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp) values
    ('60000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', '20000000-0000-0000-0000-0000000000b1', 'lancar', 'sendiri', 4, now(), now(), 60, 5, 5, 1);

  do $$ begin
    if status_anggota(now() + interval '1 day', null, null) <> 'coba' then raise exception 'GAGAL: status coba'; end if;
    if status_anggota(now() - interval '1 day', null, null) <> 'tenggang' then raise exception 'GAGAL: status tenggang'; end if;
    if status_anggota(now() - interval '8 days', null, null) <> 'berhenti' then raise exception 'GAGAL: status berhenti'; end if;
    if status_anggota(now() - interval '20 days', now() + interval '1 day', null) <> 'aktif' then raise exception 'GAGAL: status aktif'; end if;
    if status_anggota(now() - interval '40 days', now() - interval '3 days', null) <> 'tenggang' then raise exception 'GAGAL: tenggang setelah langganan'; end if;
    if status_anggota(now() - interval '40 days', null, '30000000-0000-0000-0000-0000000000f1') <> 'mitra' then raise exception 'GAGAL: status mitra'; end if;
  end $$;

  create temp table simpan (nama text primary key, nilai text);
  grant all on simpan to authenticated, anon;
  set local role authenticated;

  -- ---------- 1. orang tua: kelas, masukan, persetujuan pemakaian ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := kelas_keluarga() -> 0;
    if h ->> 'status' <> 'coba' or (h ->> 'setuju_pemakaian')::boolean then raise exception 'GAGAL: kelas_keluarga status/persetujuan: %', h; end if;
    insert into masukan (id, keluarga_id, orang_tua_id, jenis, isi) values
      (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a1', 'saran', 'Tambah soal cerita, ya.');
    begin
      insert into masukan (id, keluarga_id, orang_tua_id, jenis, isi) values
        (gen_random_uuid(), '10000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000a1', 'saran', 'menyamar');
      raise exception 'GAGAL: masukan atas nama keluarga lain diterima';
    exception when insufficient_privilege then null;
    end;
    if (select count(*) from masukan) <> 0 then raise exception 'GAGAL: orang tua bisa membaca tabel masukan'; end if;
    begin
      insert into catatan_pemakaian (id, keluarga_id, anak_id, kejadian, layar) values
        (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'selesai', 'lancar');
      raise exception 'GAGAL: catatan pemakaian diterima tanpa persetujuan';
    exception when insufficient_privilege then null;
    end;
    perform atur_persetujuan_pemakaian('20000000-0000-0000-0000-0000000000a1', true, 'kelas-v1');
  end $$;
  do $$ begin
    insert into catatan_pemakaian (id, keluarga_id, anak_id, kejadian, layar, detik) values
      (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'selesai', 'lancar', 180);
    insert into catatan_teknis (id, keluarga_id, pesan) values (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', 'TypeError: x is undefined');
    begin
      perform atur_persetujuan_pemakaian('20000000-0000-0000-0000-0000000000b1', true, 'v');
      raise exception 'GAGAL: orang tua mengatur persetujuan anak keluarga lain';
    exception when insufficient_privilege then null;
    end;
    begin
      perform aktifkan_langganan('20000000-0000-0000-0000-0000000000a1', 1, 0, 'qris');
      raise exception 'GAGAL: orang tua bisa mengaktifkan langganan sendiri';
    exception when insufficient_privilege then null;
    end;
    if daftar_harga() <> '{}'::jsonb then raise exception 'GAGAL: orang tua melihat harga'; end if;
  end $$;

  -- HP anak: catatan pemakaian setelah disetujui; persetujuan dicabut → ditolak lagi
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c9", "role": "authenticated", "is_anonymous": true}';
  do $$ begin
    insert into catatan_pemakaian (id, keluarga_id, anak_id, kejadian, layar) values
      (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'buka_aplikasi', 'beranda');
    if not ((kelas_keluarga() -> 0 ->> 'setuju_pemakaian')::boolean) then raise exception 'GAGAL: HP anak tidak melihat persetujuan'; end if;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$ begin perform atur_persetujuan_pemakaian('20000000-0000-0000-0000-0000000000a1', false, 'kelas-v1'); end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c9", "role": "authenticated", "is_anonymous": true}';
  do $$ begin
    insert into catatan_pemakaian (id, keluarga_id, anak_id, kejadian, layar) values
      (gen_random_uuid(), '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'buka_aplikasi', 'beranda');
    raise exception 'GAGAL: catatan pemakaian diterima setelah persetujuan dicabut';
  exception when insufficient_privilege then null;
  end $$;

  -- ---------- 2. pendaftar lewat halaman penjelasan (tanpa masuk) ----------
  set local role anon;
  set local request.jwt.claims = '{"role": "anon"}';
  do $$
  declare h jsonb;
  begin
    h := daftar_minat('keluarga', 'Bunda Rani', 'Calon@Contoh.id', '0812-3456', 5, 'Rani', null, 'fb-tka-1');
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: pendaftaran ditolak: %', h; end if;
    if daftar_minat('keluarga', '', 'x@contoh.id', null, 5, null, null, null) ->> 'alasan' <> 'isian_tidak_lengkap' then raise exception 'GAGAL: isian kosong diterima'; end if;
    perform daftar_minat('keluarga', 'Bunda', 'calon@contoh.id', null, 5, null, null, null);
    perform daftar_minat('keluarga', 'Bunda', 'calon@contoh.id', null, 5, null, null, null);
    if daftar_minat('keluarga', 'Bunda', 'calon@contoh.id', null, 5, null, null, null) ->> 'alasan' <> 'terlalu_sering' then raise exception 'GAGAL: pendaftaran berulang tidak dibatasi'; end if;
    begin
      perform count(*) from pendaftar;
      raise exception 'GAGAL: anon bisa membaca pendaftar';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local role authenticated;

  -- ---------- 3. admin: langganan, pendaftar, masukan, laporan ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000ad", "role": "authenticated"}';
  do $$
  declare d jsonb; h jsonb; sampai timestamptz;
  begin
    d := daftar_langganan();
    if jsonb_array_length(d) <> 1 or d -> 0 ->> 'email_ortu' <> 'ortu-a@contoh.id' then raise exception 'GAGAL: daftar langganan admin: %', d; end if;
    h := aktifkan_langganan('20000000-0000-0000-0000-0000000000a1', 1, 70000, 'qris', 'QRIS 31 Okt');
    sampai := (h ->> 'berlaku_sampai')::timestamptz;
    -- dihitung dari akhir masa coba (3 hari lagi) + 1 bulan
    if abs(extract(epoch from sampai - (now() + interval '3 days' + interval '1 month'))) > 120 then raise exception 'GAGAL: perpanjangan dari akhir masa coba: %', h; end if;
    insert into simpan values ('sampai', sampai::text);
    h := aktifkan_langganan('20000000-0000-0000-0000-0000000000a1', 2, 140000, 'transfer');
    if abs(extract(epoch from (h ->> 'berlaku_sampai')::timestamptz - (sampai + interval '2 months'))) > 120 then raise exception 'GAGAL: perpanjangan bertumpuk: %', h; end if;
    begin
      perform aktifkan_langganan('20000000-0000-0000-0000-0000000000b1', 1, 0, 'qris');
      raise exception 'GAGAL: langganan anak kelas mitra diaktifkan';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
    if daftar_harga() <> '{}'::jsonb then raise exception 'GAGAL: admin melihat harga'; end if;
    begin
      perform atur_harga('dasar', 1);
      raise exception 'GAGAL: admin bisa mengubah harga';
    exception when insufficient_privilege then null;
    end;
    if jsonb_array_length(daftar_pendaftar()) <> 3 then raise exception 'GAGAL: admin tidak melihat pendaftar'; end if;
    if daftar_pendaftar() -> 0 ->> 'email' <> 'calon@contoh.id' then raise exception 'GAGAL: email pendaftar tidak dirapikan'; end if;
    perform ubah_pendaftar((daftar_pendaftar() -> 0 ->> 'id')::uuid, 'dihubungi', 'Sudah kirim WA');
    d := daftar_masukan();
    if jsonb_array_length(d -> 'masukan') <> 1 or jsonb_array_length(d -> 'teknis') <> 1 then raise exception 'GAGAL: daftar masukan admin: %', d; end if;
    d := laporan_mingguan();
    if (d ->> 'pendaftar_baru')::int <> 3 or (d ->> 'bayar_minggu_ini')::int <> 2 or d ->> 'uang_minggu_ini' is not null then
      raise exception 'GAGAL: laporan admin: %', d;
    end if;
    if (d -> 'status' ->> 'aktif')::int <> 1 or (d -> 'status' ->> 'mitra')::int <> 1 then raise exception 'GAGAL: laporan status: %', d; end if;
    if not (d -> 'kelas_tanpa_pantauan') ? 'Kancil' then raise exception 'GAGAL: kelas tanpa pantauan tidak terlihat: %', d; end if;
  end $$;

  -- ---------- 4. super admin: harga, uang, tagihan mitra ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000005a", "role": "authenticated"}';
  do $$
  declare d jsonb;
  begin
    perform atur_harga('mitra', 75000);
    if (daftar_harga() ->> 'mitra')::int <> 75000 then raise exception 'GAGAL: harga tidak berubah'; end if;
    if (laporan_mingguan() ->> 'uang_minggu_ini')::int <> 210000 then raise exception 'GAGAL: uang minggu ini super admin'; end if;
    d := tagihan_mitra(current_date);
    if jsonb_array_length(d) <> 1 or (d -> 0 ->> 'murid_aktif')::int <> 1 or (d -> 0 ->> 'total')::int <> 75000 then raise exception 'GAGAL: tagihan mitra: %', d; end if;
    if (tagihan_mitra((current_date - interval '2 months')::date) -> 0 ->> 'murid_aktif')::int <> 0 then raise exception 'GAGAL: murid tanpa latihan bulan itu ikut ditagih'; end if;
  end $$;

  -- ---------- 5. mitra hanya melihat tagihannya; pengawas tidak melihat uang ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f1", "role": "authenticated"}';
  do $$ begin
    if jsonb_array_length(tagihan_mitra(current_date)) <> 1 then raise exception 'GAGAL: mitra tidak melihat tagihannya'; end if;
    if jsonb_array_length(daftar_langganan()) <> 0 then raise exception 'GAGAL: mitra melihat langganan keluarga'; end if;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$ begin
    if jsonb_array_length(tagihan_mitra(current_date)) <> 0 then raise exception 'GAGAL: pengawas melihat tagihan'; end if;
    if jsonb_array_length(daftar_langganan()) <> 0 then raise exception 'GAGAL: pengawas melihat langganan'; end if;
    if (status_anak_kelas('40000000-0000-0000-0000-000000000001') ->> '20000000-0000-0000-0000-0000000000a1') <> 'aktif' then raise exception 'GAGAL: status di papan pengawas'; end if;
    begin
      perform laporan_mingguan();
      raise exception 'GAGAL: pengawas membuka laporan mingguan';
    exception when insufficient_privilege then null;
    end;
    if daftar_masukan() is not null then raise exception 'GAGAL: pengawas membaca masukan'; end if;
  end $$;
rollback;
