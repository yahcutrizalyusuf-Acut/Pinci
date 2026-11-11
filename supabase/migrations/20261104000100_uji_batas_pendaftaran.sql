-- Uji wajib untuk 20261104000000_batas_pendaftaran.sql. Selesai tanpa pesan "GAGAL" = lulus. Semua dibatalkan di akhir (rollback).
begin;
  set local role anon;
  set local request.jwt.claims = '{"role": "anon"}';
  do $$
  declare h jsonb; i int;
  begin
    -- Satu keluarga mendaftarkan 5 anak dengan nomor yang sama: semuanya diterima.
    for i in 1..5 loop
      h := daftar_coba(format('{"nama_ortu": "Pak Ali", "wa": "0812-0000-1111", "nama_lengkap_anak": "Anak %s", "kelas": 4, "izin_kontak": true, "versi_teks": "v1"}', i)::jsonb);
      if not (h ->> 'ok')::boolean then raise exception 'GAGAL: anak ke-% ditolak: %', i, h; end if;
    end loop;
    -- Batas harian tetap ada: pendaftaran ke-6 dari kontak yang sama ditolak.
    h := daftar_coba('{"nama_ortu": "Pak Ali", "wa": "0812-0000-1111", "nama_lengkap_anak": "Anak 6", "kelas": 4, "izin_kontak": true, "versi_teks": "v1"}'::jsonb);
    if (h ->> 'alasan') is distinct from 'terlalu_sering' then raise exception 'GAGAL: batas 5 per kontak tidak berlaku: %', h; end if;
    -- Kontak lain tidak terpengaruh.
    h := daftar_coba('{"nama_ortu": "Bu Cut", "wa": "0812-0000-2222", "nama_lengkap_anak": "Cut", "kelas": 2, "izin_kontak": true, "versi_teks": "v1"}'::jsonb);
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: kontak lain ikut terblokir: %', h; end if;
  end $$;
rollback;
