-- Uji wajib untuk harga per pelajaran, promo, pelajaran pilihan, dan pendaftaran masa coba
-- (20261103000000_gratis_pendaftaran.sql). Selesai tanpa pesan "GAGAL" = lulus. Semua dibatalkan di akhir (rollback).
begin;
  insert into auth.users (id, email) values
    ('00000000-0000-0000-0000-00000000005a', 'super@contoh.id'),
    ('00000000-0000-0000-0000-0000000000ad', 'admin@contoh.id'),
    ('00000000-0000-0000-0000-0000000000e1', 'pengawas@contoh.id'),
    ('00000000-0000-0000-0000-0000000000a1', 'ortu-a@contoh.id'),
    ('00000000-0000-0000-0000-0000000000b1', 'ortu-b@contoh.id');
  insert into keluarga (id, sapaan_ortu) values ('10000000-0000-0000-0000-0000000000a1', 'Bunda'), ('10000000-0000-0000-0000-0000000000b1', 'Ayah');
  insert into orang_tua (id, keluarga_id) values
    ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1'),
    ('00000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values
    ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Rani', 6, 'kucing'),
    ('20000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', 'Dek Ali', 3, 'ikan'),
    ('20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'Sari', 4, 'ikan');
  insert into staf (id, peran, mitra_id, nama) values
    ('00000000-0000-0000-0000-00000000005a', 'super_admin', null, 'Acut'),
    ('00000000-0000-0000-0000-0000000000ad', 'admin', null, 'Admin'),
    ('00000000-0000-0000-0000-0000000000e1', 'pengawas', null, 'Kak Nisa');
  insert into kelas (id, nama, mitra_id, pengawas_id, kode) values
    ('40000000-0000-0000-0000-000000000001', 'Kancil', null, '00000000-0000-0000-0000-0000000000e1', 'KNCAAA');
  insert into anggota_kelas (kelas_id, anak_id, keluarga_id, paket, coba_sampai) values
    ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'lengkap', now() + interval '14 days'),
    ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', 'dasar', now() + interval '14 days');

  do $$ begin
    -- Pelajaran disamakan dari paket saat masuk kelas.
    if (select pelajaran from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a1') <> array['inggris', 'gudang'] then
      raise exception 'GAGAL: pelajaran dari paket lengkap'; end if;
    if (select pelajaran from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a2') <> '{}' then
      raise exception 'GAGAL: pelajaran dari paket dasar'; end if;
    -- Hitung harga: inti 50.000 + pilihan; TKA hanya kelas 6; anak kedua diskon 20%.
    if hitung_harga('{}', 4) <> 50000 then raise exception 'GAGAL: harga inti'; end if;
    if hitung_harga(array['inggris', 'gudang', 'tka'], 6) <> 70000 then raise exception 'GAGAL: harga semua kelas 6'; end if;
    if hitung_harga(array['inggris', 'gudang', 'tka'], 5) <> 60000 then raise exception 'GAGAL: TKA ikut dihitung di kelas 5'; end if;
    if hitung_harga(array['inggris'], 3, 2) <> 44000 then raise exception 'GAGAL: diskon anak kedua: %', hitung_harga(array['inggris'], 3, 2); end if;
    if pengenalan_sah('{"cara_belajar": "gambar", "x": 1}') then raise exception 'GAGAL: jawaban pengenalan angka diterima'; end if;
    if not pengenalan_sah('{"cara_belajar": "gambar", "lama_betah": "lima_15"}') then raise exception 'GAGAL: jawaban pengenalan sah ditolak'; end if;
  end $$;

  set local role anon;
  set local request.jwt.claims = '{"role": "anon"}';
  do $$
  declare h jsonb;
  begin
    -- Website: harga publik terbaca tanpa masuk; tabel harga tetap tertutup.
    h := harga_publik();
    if (h -> 'modul' ->> 'inti')::int <> 50000 or (h -> 'promo' ->> 'diskon_anak_kedua_persen')::int <> 20 then raise exception 'GAGAL: harga_publik %', h; end if;
    begin
      perform 1 from harga_modul;
      raise exception 'GAGAL: anon membaca tabel harga_modul';
    exception when insufficient_privilege then null;
    end;
    -- Pendaftaran online lengkap.
    h := daftar_coba('{"nama_ortu": "Bu Ani", "wa": "0812-3456-7890", "nama_lengkap_anak": "Rani Putri", "kelas": 6,
      "pelajaran": ["tka", "inggris"], "tujuan": "Siap TKA", "cara": "online",
      "pengenalan": {"cara_belajar": "gambar", "lama_betah": "lima_15"}, "minta_telepon": true, "waktu_telepon": "sore",
      "izin_kontak": true, "izin_pengembangan": true, "versi_teks": "daftar-2026-11-03"}');
    if not (h ->> 'ok')::boolean or (h ->> 'harga')::int <> 65000 then raise exception 'GAGAL: daftar_coba online %', h; end if;
    -- Antre tatap muka: nomor antrean per kota (tanpa membedakan huruf besar kecil).
    h := daftar_coba('{"nama_ortu": "Pak Budi", "email": "budi@contoh.id", "nama_lengkap_anak": "Ali", "kelas": 3,
      "pelajaran": [], "cara": "antre_tatap_muka", "kota": "Banda Aceh", "izin_kontak": true, "versi_teks": "v1"}');
    if (h ->> 'nomor_antrean')::int <> 1 then raise exception 'GAGAL: nomor antrean pertama %', h; end if;
    h := daftar_coba('{"nama_ortu": "Bu Cut", "email": "cut@contoh.id", "nama_lengkap_anak": "Cut Nyak", "kelas": 2,
      "cara": "antre_tatap_muka", "kota": "banda aceh", "izin_kontak": true, "versi_teks": "v1"}');
    if (h ->> 'nomor_antrean')::int <> 2 then raise exception 'GAGAL: nomor antrean kedua %', h; end if;
    -- Ditolak: tanpa izin kontak, tanpa kontak, kota kosong saat antre, pelajaran asing, waktu telepon asing.
    if (daftar_coba('{"nama_ortu": "A", "wa": "081234567890", "nama_lengkap_anak": "B", "kelas": 2, "versi_teks": "v1"}') ->> 'alasan') <> 'belum_setuju' then
      raise exception 'GAGAL: tanpa izin kontak diterima'; end if;
    if (daftar_coba('{"nama_ortu": "A", "nama_lengkap_anak": "B", "kelas": 2, "izin_kontak": true, "versi_teks": "v1"}') ->> 'alasan') <> 'isian_tidak_lengkap' then
      raise exception 'GAGAL: tanpa kontak diterima'; end if;
    if (daftar_coba('{"nama_ortu": "A", "wa": "081234567890", "nama_lengkap_anak": "B", "kelas": 2, "cara": "antre_tatap_muka", "izin_kontak": true, "versi_teks": "v1"}') ->> 'alasan') <> 'kota_kosong' then
      raise exception 'GAGAL: antre tanpa kota diterima'; end if;
    if (daftar_coba('{"nama_ortu": "A", "wa": "081234567890", "nama_lengkap_anak": "B", "kelas": 2, "pelajaran": ["ipa"], "izin_kontak": true, "versi_teks": "v1"}') ->> 'alasan') <> 'isian_tidak_valid' then
      raise exception 'GAGAL: pelajaran asing diterima'; end if;
    if (daftar_coba('{"nama_ortu": "A", "wa": "081234567890", "nama_lengkap_anak": "B", "kelas": 2, "minta_telepon": true, "waktu_telepon": "subuh", "izin_kontak": true, "versi_teks": "v1"}') ->> 'alasan') <> 'isian_tidak_valid' then
      raise exception 'GAGAL: waktu telepon asing diterima'; end if;
    -- Batas 3 kali per kontak per hari.
    perform daftar_coba('{"nama_ortu": "Bu Ani", "wa": "081234567890", "nama_lengkap_anak": "Rani", "kelas": 6, "izin_kontak": true, "versi_teks": "v1"}');
    perform daftar_coba('{"nama_ortu": "Bu Ani", "wa": "081234567890", "nama_lengkap_anak": "Rani", "kelas": 6, "izin_kontak": true, "versi_teks": "v1"}');
    if (daftar_coba('{"nama_ortu": "Bu Ani", "wa": "081234567890", "nama_lengkap_anak": "Rani", "kelas": 6, "izin_kontak": true, "versi_teks": "v1"}') ->> 'alasan') <> 'terlalu_sering' then
      raise exception 'GAGAL: batas per kontak'; end if;
  end $$;

  set local role authenticated;
  -- ---------- orang tua: atur pelajaran ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := atur_pelajaran('20000000-0000-0000-0000-0000000000a2', array['tka', 'inggris']);
    if h -> 'pelajaran' <> '["inggris"]' then raise exception 'GAGAL: TKA tidak dibuang untuk kelas 3: %', h; end if;
    if (select paket from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a2') <> 'lengkap' then raise exception 'GAGAL: paket tidak disamakan'; end if;
    h := atur_pelajaran('20000000-0000-0000-0000-0000000000a1', array['tka']);
    if (select paket from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a1') <> 'siap_tka' then raise exception 'GAGAL: paket siap_tka'; end if;
    if (atur_pelajaran('20000000-0000-0000-0000-0000000000a1', array['ipa']) ->> 'alasan') <> 'pelajaran_tidak_valid' then raise exception 'GAGAL: pelajaran asing'; end if;
    if (atur_pelajaran('20000000-0000-0000-0000-0000000000b1', array['inggris']) ->> 'alasan') <> 'anak_tidak_valid' then raise exception 'GAGAL: atur anak keluarga lain'; end if;
    -- ganti_paket lama ikut mengganti pelajaran.
    perform ganti_paket('20000000-0000-0000-0000-0000000000a1', 'dasar');
    if (select pelajaran from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a1') <> '{}' then raise exception 'GAGAL: ganti_paket tidak menyamakan pelajaran'; end if;
    begin
      perform atur_harga_modul('inti', 1);
      raise exception 'GAGAL: orang tua mengubah harga';
    exception when insufficient_privilege then null;
    end;
    begin
      perform antrean_tatap_muka();
    end;
    if jsonb_array_length(antrean_tatap_muka()) <> 0 then raise exception 'GAGAL: orang tua melihat antrean'; end if;
    if jsonb_array_length(daftar_pendaftar()) <> 0 then raise exception 'GAGAL: orang tua melihat pendaftar'; end if;
  end $$;

  -- ---------- pengawas tidak melihat pendaftar; admin melihat tetapi tidak mengubah harga ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$ begin
    if jsonb_array_length(daftar_pendaftar()) <> 0 then raise exception 'GAGAL: pengawas melihat pendaftar'; end if;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000ad", "role": "authenticated"}';
  do $$
  declare a jsonb;
  begin
    a := antrean_tatap_muka();
    if a -> 0 ->> 'kota' <> 'Banda Aceh' or (a -> 0 ->> 'jumlah')::int <> 2 then raise exception 'GAGAL: antrean per kota %', a; end if;
    if (daftar_pendaftar() -> -1 ->> 'nama_lengkap_anak') is null then raise exception 'GAGAL: nama lengkap anak tidak tersimpan'; end if;
    begin
      perform atur_promo('diskon_anak_kedua_persen', 50);
      raise exception 'GAGAL: admin mengubah promo';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000005a", "role": "authenticated"}';
  do $$ begin
    perform atur_harga_modul('inggris', 7000);
    perform atur_promo('diskon_anak_kedua_persen', 25);
    if hitung_harga(array['inggris'], 3, 2) <> 42750 then raise exception 'GAGAL: harga baru %', hitung_harga(array['inggris'], 3, 2); end if;
  end $$;
rollback;
