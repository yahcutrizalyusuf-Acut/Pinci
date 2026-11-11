-- Uji wajib untuk 20261111000000_cerita_ulang.sql. Selesai tanpa pesan "GAGAL" = lulus. Semua dibatalkan di akhir (rollback).
begin;
  insert into auth.users (id, email) values
    ('00000000-0000-0000-0000-0000000000a1', 'ortu-a@contoh.id'),
    ('00000000-0000-0000-0000-0000000000b1', 'ortu-b@contoh.id');
  insert into keluarga (id, sapaan_ortu) values
    ('10000000-0000-0000-0000-0000000000a1', 'Bunda'),
    ('10000000-0000-0000-0000-0000000000b1', 'Ayah');
  insert into orang_tua (id, keluarga_id) values
    ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1'),
    ('00000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values
    ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Rani', 4, 'kucing'),
    ('20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'Sari', 4, 'ikan');

  do $$
  begin
    -- Tidak ada kolom yang bisa menyimpan isi atau alamat rekaman.
    if exists (select 1 from information_schema.columns where table_name = 'cerita_ulang' and column_name ~ '(rekaman|audio|suara|berkas|uri)' and column_name <> 'ada_rekaman') then
      raise exception 'GAGAL: tabel cerita_ulang punya kolom rekaman selain ada_rekaman';
    end if;
  end $$;

  -- Orang tua A menambah hasil untuk anaknya.
  set local role authenticated;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  insert into cerita_ulang (id, keluarga_id, anak_id, komik_id, tanggal, waktu, centang_tokoh, kata_target_dicentang, ada_rekaman)
    values ('30000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 't3-u01-komik', '2026-11-11', now(), true, array['hello', 'robot'], true);
  do $$
  begin
    if (select count(*) from cerita_ulang) <> 1 then raise exception 'GAGAL: orang tua A tidak melihat barisnya'; end if;
    begin
      insert into cerita_ulang (id, keluarga_id, anak_id, komik_id, tanggal, waktu)
        values ('30000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000b1', '20000000-0000-0000-0000-0000000000b1', 't3-u01-komik', '2026-11-11', now());
      raise exception 'GAGAL: orang tua A bisa menulis untuk keluarga B';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
    begin
      update cerita_ulang set centang_inggris = true;
      raise exception 'GAGAL: hasil Ceritakan Lagi bisa diubah';
    exception when insufficient_privilege then null;
    end;
  end $$;

  -- Orang tua B tidak melihat hasil keluarga A.
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from cerita_ulang) <> 0 then raise exception 'GAGAL: orang tua B melihat hasil keluarga A'; end if;
  end $$;

  -- Pengguna tanpa masuk tidak bisa membaca.
  set local role anon;
  set local request.jwt.claims = '{"role": "anon"}';
  do $$
  begin
    begin
      perform count(*) from cerita_ulang;
      raise exception 'GAGAL: anon bisa membaca cerita_ulang';
    exception when insufficient_privilege then null;
    end;
  end $$;
rollback;
