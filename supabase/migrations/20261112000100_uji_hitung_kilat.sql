-- Uji wajib untuk 20261112000000_hitung_kilat.sql. Selesai tanpa pesan "GAGAL" = lulus. Semua dibatalkan di akhir (rollback).
begin;
  insert into auth.users (id, email) values ('00000000-0000-0000-0000-0000000000a1', 'ortu-a@contoh.id');
  insert into keluarga (id, sapaan_ortu) values ('10000000-0000-0000-0000-0000000000a1', 'Bunda');
  insert into orang_tua (id, keluarga_id) values ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Yusuf', 4, 'kucing');

  set local role authenticated;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  -- Orang tua bisa menyimpan sesi Hitung Kilat untuk anaknya.
  insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, level, rujukan, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
    values ('30000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1',
            'kilat', 'sendiri', 4, 1, 'kilat-t1', now() - interval '3 minutes', now(), 120, 48, 50, 1);
  do $$
  begin
    if (select count(*) from sesi where jenis = 'kilat') <> 1 then raise exception 'GAGAL: sesi kilat tidak tersimpan'; end if;
    -- Jenis yang tidak dikenal tetap ditolak.
    begin
      insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
        values ('30000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1',
                'sembarang', 'sendiri', 4, now(), now(), 1, 0, 0, 2);
      raise exception 'GAGAL: jenis sesi tak dikenal diterima';
    exception when check_violation then null;
    end;
  end $$;
rollback;
