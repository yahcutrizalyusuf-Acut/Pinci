-- Uji wajib untuk hubungkan HP anak (20261030000000_hubungkan_hp_anak.sql).
-- Jalankan di SQL Editor atau psql. Selesai tanpa pesan "GAGAL" = lulus. Semua perubahan dibatalkan di akhir (rollback).
begin;
  -- ---------- data awal (sebagai pemilik basis data) ----------
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
    ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Rani', 6, 'kucing'),
    ('20000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', 'Budi', 3, 'gajah'),
    ('20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'Sari', 4, 'ikan');

  create temp table simpan (nama text primary key, nilai text);
  grant all on simpan to authenticated;

  -- ---------- 1. orang tua A membuat kode ----------
  set local role authenticated;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := buat_kode_hubung(array['20000000-0000-0000-0000-0000000000a1']::uuid[]);
    if h ->> 'kode' !~ '^[0-9]{6}$' then raise exception 'GAGAL: kode bukan 6 angka: %', h; end if;
    insert into simpan values ('kode', h ->> 'kode');
    begin
      perform buat_kode_hubung(array['20000000-0000-0000-0000-0000000000b1']::uuid[]);
      raise exception 'GAGAL: orang tua A bisa membuat kode untuk anak keluarga B';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
    begin
      perform buat_kode_hubung(array[]::uuid[]);
      raise exception 'GAGAL: kode tanpa anak diterima';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
  end $$;
  do $$
  begin
    begin
      perform count(*) from kode_hubung;
      raise exception 'GAGAL: orang tua bisa membaca tabel kode_hubung langsung';
    exception when insufficient_privilege then
      null; -- ditolak: itu yang diharapkan
    end;
  end $$;

  -- ---------- 2. HP anak (pengguna anonim) menukar kode ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c1", "role": "authenticated", "is_anonymous": true}';
  do $$
  declare h jsonb; kode text := (select nilai from simpan where nama = 'kode');
  begin
    h := tukar_kode_hubung('000000', 'uji');
    if (h ->> 'ok')::boolean or h ->> 'alasan' <> 'salah' then raise exception 'GAGAL: kode salah diterima: %', h; end if;
    h := tukar_kode_hubung('abc', 'uji');
    if (h ->> 'ok')::boolean then raise exception 'GAGAL: kode non-angka diterima'; end if;
    h := tukar_kode_hubung(kode, 'uji-1.0');
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: kode benar ditolak: %', h; end if;
    if h ->> 'keluarga_id' <> '10000000-0000-0000-0000-0000000000a1' or h ->> 'sapaan' <> 'Bunda' then
      raise exception 'GAGAL: keluarga/sapaan salah: %', h;
    end if;
    if jsonb_array_length(h -> 'anak_ids') <> 1 then raise exception 'GAGAL: anak_ids salah: %', h; end if;
    h := tukar_kode_hubung(kode, 'uji');
    if (h ->> 'ok')::boolean then raise exception 'GAGAL: kode bisa dipakai dua kali'; end if;
  end $$;

  -- ---------- 3. akses HP anak dibatasi ----------
  do $$
  begin
    if (select count(*) from anak) <> 1 then raise exception 'GAGAL: HP anak melihat % anak (harus 1)', (select count(*) from anak); end if;
    if (select count(*) from keluarga) <> 1 then raise exception 'GAGAL: HP anak tidak bisa membaca keluarganya'; end if;
    if (select count(*) from perangkat) <> 1 then raise exception 'GAGAL: HP anak tidak melihat baris perangkatnya'; end if;

    insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
      values ('30000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'lancar', 'sendiri', 6, now(), now(), 60, 18, 20, 1);
    insert into jawaban (id, keluarga_id, sesi_id, anak_id, urutan, soal, kunci, jawaban, benar, detik)
      values ('40000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '30000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 1, '2+2', '4', '4', true, 2.5);

    begin
      insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
        values ('30000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a2', 'lancar', 'sendiri', 3, now(), now(), 60, 1, 1, 2);
      raise exception 'GAGAL: HP anak menulis sesi anak lain (Budi) di keluarga yang sama';
    exception when others then if sqlerrm like 'GAGAL%' then raise; end if; end;
    begin
      insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
        values ('30000000-0000-0000-0000-0000000000a3', '10000000-0000-0000-0000-0000000000b1', '20000000-0000-0000-0000-0000000000a1', 'lancar', 'sendiri', 6, now(), now(), 60, 1, 1, 3);
      raise exception 'GAGAL: HP anak menulis dengan keluarga_id keluarga lain';
    exception when others then if sqlerrm like 'GAGAL%' then raise; end if; end;

    -- stiker boleh; pesan teks pura-pura dari orang tua tidak boleh
    insert into pesan (id, keluarga_id, anak_id, dari, jenis, isi, waktu)
      values ('50000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'anak', 'stiker', 'rekor', now());
    begin
      insert into pesan (id, keluarga_id, anak_id, dari, jenis, isi, waktu)
        values ('50000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'orang_tua', 'teks', 'palsu', now());
      raise exception 'GAGAL: HP anak menulis pesan atas nama orang tua';
    exception when others then if sqlerrm like 'GAGAL%' then raise; end if; end;
    begin
      insert into pesan (id, keluarga_id, anak_id, dari, jenis, isi, waktu)
        values ('50000000-0000-0000-0000-0000000000a3', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'anak', 'teks', 'teks bebas', now());
      raise exception 'GAGAL: HP anak mengirim teks bebas';
    exception when others then if sqlerrm like 'GAGAL%' then raise; end if; end;

    -- HP anak tidak boleh mengubah profil atau pengaturan
    update anak set nama = 'Diubah' where id = '20000000-0000-0000-0000-0000000000a1';
    if (select nama from anak where id = '20000000-0000-0000-0000-0000000000a1') <> 'Rani' then raise exception 'GAGAL: HP anak mengubah nama anak'; end if;
  end $$;

  -- ---------- 4. orang tua A melihat hasil anak, keluarga B tidak ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from sesi) <> 1 then raise exception 'GAGAL: orang tua tidak melihat sesi dari HP anak'; end if;
    if (select count(*) from jawaban) <> 1 then raise exception 'GAGAL: orang tua tidak melihat jawaban dari HP anak'; end if;
    if (select count(*) from pesan where dari = 'anak') <> 1 then raise exception 'GAGAL: orang tua tidak melihat stiker anak'; end if;
    if (select count(*) from perangkat where not diputus) <> 1 then raise exception 'GAGAL: orang tua tidak melihat perangkat anak'; end if;
    insert into pesan (id, keluarga_id, anak_id, dari, jenis, isi, waktu)
      values ('50000000-0000-0000-0000-0000000000a4', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'orang_tua', 'teks', 'Bangga sama kamu', now());
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from sesi) + (select count(*) from perangkat) + (select count(*) from pesan) <> 0 then
      raise exception 'GAGAL: keluarga B melihat data keluarga A';
    end if;
    if (select count(*) from anak) <> 1 then raise exception 'GAGAL: keluarga B tidak melihat anaknya sendiri'; end if;
  end $$;

  -- ---------- 5. HP anak menandai pesan orang tua dibaca ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c1", "role": "authenticated", "is_anonymous": true}';
  do $$
  begin
    if tandai_pesan_dibaca(array['50000000-0000-0000-0000-0000000000a4']::uuid[], now()) <> 1 then
      raise exception 'GAGAL: pesan orang tua tidak bisa ditandai dibaca';
    end if;
    if (select dibaca from pesan where id = '50000000-0000-0000-0000-0000000000a4') is null then
      raise exception 'GAGAL: tanda dibaca tidak tersimpan';
    end if;
    perform catat_sinkron(2);
    if (select antrean_belum_kirim from perangkat) <> 2 then raise exception 'GAGAL: catat_sinkron tidak bekerja'; end if;
  end $$;

  -- ---------- 6. orang tua memutus HP anak ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  update perangkat set diputus = true;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c1", "role": "authenticated", "is_anonymous": true}';
  do $$
  begin
    if (select count(*) from anak) <> 0 then raise exception 'GAGAL: HP yang diputus masih membaca anak'; end if;
    begin
      insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp)
        values ('30000000-0000-0000-0000-0000000000a9', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'lancar', 'sendiri', 6, now(), now(), 60, 1, 1, 9);
      raise exception 'GAGAL: HP yang diputus masih bisa menulis';
    exception when others then if sqlerrm like 'GAGAL%' then raise; end if; end;
    if (select diputus from perangkat) is not true then raise exception 'GAGAL: HP yang diputus tidak bisa membaca statusnya'; end if;
  end $$;

  -- ---------- 7. tebak kode dibatasi ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000d1", "role": "authenticated", "is_anonymous": true}';
  do $$
  declare h jsonb; i int;
  begin
    for i in 1..5 loop
      h := tukar_kode_hubung(lpad(i::text, 6, '1'), 'uji');
    end loop;
    h := tukar_kode_hubung('123456', 'uji');
    if h ->> 'alasan' <> 'terlalu_sering' then raise exception 'GAGAL: tebakan beruntun tidak ditunda: %', h; end if;
  end $$;

  -- ---------- 8. akun orang tua tidak bisa menjadi HP anak ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b1", "role": "authenticated"}';
  do $$
  begin
    if tukar_kode_hubung('123456', 'uji') ->> 'alasan' <> 'akun_orang_tua' then
      raise exception 'GAGAL: akun orang tua bisa menukar kode';
    end if;
  end $$;
rollback;
