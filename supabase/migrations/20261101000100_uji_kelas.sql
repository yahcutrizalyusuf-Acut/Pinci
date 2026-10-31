-- Uji wajib untuk kelas dan pengawas (20261101000000_kelas_pengawas.sql).
-- Jalankan di SQL Editor atau psql. Selesai tanpa pesan "GAGAL" = lulus. Semua perubahan dibatalkan di akhir (rollback).
begin;
  -- ---------- data awal (sebagai pemilik basis data) ----------
  insert into auth.users (id, email) values
    ('00000000-0000-0000-0000-00000000005a', 'super@contoh.id'),
    ('00000000-0000-0000-0000-0000000000ad', 'admin@contoh.id'),
    ('00000000-0000-0000-0000-0000000000e1', 'pengawas@contoh.id'),
    ('00000000-0000-0000-0000-0000000000f1', 'pemilik-les@contoh.id'),
    ('00000000-0000-0000-0000-0000000000f2', 'guru-les@contoh.id'),
    ('00000000-0000-0000-0000-0000000000a1', 'ortu-a@contoh.id'),
    ('00000000-0000-0000-0000-0000000000b1', 'ortu-b@contoh.id');
  insert into keluarga (id, sapaan_ortu) values
    ('10000000-0000-0000-0000-0000000000a1', 'Bunda'),
    ('10000000-0000-0000-0000-0000000000b1', 'Ayah'),
    ('10000000-0000-0000-0000-0000000000c1', 'Bunda');
  insert into orang_tua (id, keluarga_id) values
    ('00000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1'),
    ('00000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values
    ('20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', 'Rani', 6, 'kucing'),
    ('20000000-0000-0000-0000-0000000000a2', '10000000-0000-0000-0000-0000000000a1', 'Budi', 3, 'gajah'),
    ('20000000-0000-0000-0000-0000000000b1', '10000000-0000-0000-0000-0000000000b1', 'Sari', 4, 'ikan'),
    ('20000000-0000-0000-0000-0000000000c1', '10000000-0000-0000-0000-0000000000c1', 'Dodi', 5, 'rusa');
  -- HP anak keluarga A untuk Rani.
  insert into perangkat (id, keluarga_id, jenis, anak_ids) values
    ('00000000-0000-0000-0000-0000000000c9', '10000000-0000-0000-0000-0000000000a1', 'anak', array['20000000-0000-0000-0000-0000000000a1']::uuid[]);
  insert into sesi (id, keluarga_id, anak_id, jenis, mode, kelas, mulai, selesai, durasi_detik, benar, jumlah, urutan_hp) values
    ('30000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1',
     'lancar', 'sendiri', 6, now() - interval '1 day', now() - interval '1 day' + interval '5 minutes', 300, 18, 20, 1),
    ('30000000-0000-0000-0000-0000000000c1', '10000000-0000-0000-0000-0000000000c1', '20000000-0000-0000-0000-0000000000c1',
     'lancar', 'sendiri', 5, now(), now() + interval '5 minutes', 300, 18, 20, 1);
  insert into kemajuan_topik (id, keluarga_id, anak_id, mapel, topik, status, benar, salah, petunjuk, terakhir, tanda) values
    ('ra-pecahan', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'mat', 'pecahan', 'belajar', 2, 5, 0, now(), 'merah'),
    ('ra-bulat', '10000000-0000-0000-0000-0000000000a1', '20000000-0000-0000-0000-0000000000a1', 'mat', 'bulat', 'kuasai', 9, 1, 0, now(), 'hijau');
  -- Super admin pertama dibuat dari SQL Editor (lihat docs/CARA-MENYAMBUNG-SUPABASE.md).
  insert into undangan_staf (email, peran, nama) values ('super@contoh.id', 'super_admin', 'Acut');

  create temp table simpan (nama text primary key, nilai text);
  grant all on simpan to authenticated;

  set local role authenticated;

  -- ---------- 1. staf menerima undangan ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  begin
    if (terima_undangan() ->> 'ok')::boolean then raise exception 'GAGAL: orang tua tanpa undangan menjadi staf'; end if;
    begin
      perform undang_staf('x@contoh.id', 'admin', 'X');
      raise exception 'GAGAL: orang tua bisa mengundang staf';
    exception when insufficient_privilege then null;
    end;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000005a", "role": "authenticated"}';
  do $$
  declare h jsonb; m uuid;
  begin
    h := terima_undangan();
    if h ->> 'peran' is distinct from 'super_admin' then raise exception 'GAGAL: super admin tidak diterima: %', h; end if;
    perform undang_staf('Admin@Contoh.id', 'admin', 'Admin Satu');
    perform undang_staf('pengawas@contoh.id', 'pengawas', 'Kak Nisa');
    m := buat_mitra('Les Cahaya', 'Banda Aceh');
    insert into simpan values ('mitra', m::text);
    perform undang_staf('pemilik-les@contoh.id', 'mitra', 'Bu Cahaya', m);
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000ad", "role": "authenticated"}';
  do $$
  begin
    if terima_undangan() ->> 'peran' is distinct from 'admin' then raise exception 'GAGAL: email undangan tidak dicocokkan tanpa huruf besar'; end if;
    begin
      perform undang_staf('y@contoh.id', 'admin', 'Y');
      raise exception 'GAGAL: admin bisa mengundang admin';
    exception when insufficient_privilege then null;
    end;
    begin
      perform buat_mitra('Les Palsu');
      raise exception 'GAGAL: admin bisa membuat mitra';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$ begin perform terima_undangan(); end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f1", "role": "authenticated"}';
  do $$
  begin
    if terima_undangan() ->> 'peran' is distinct from 'mitra' then raise exception 'GAGAL: mitra tidak diterima'; end if;
    perform undang_staf('guru-les@contoh.id', 'pengawas', 'Pak Guru', null); -- mitra_id dipaksa ke les sendiri
    begin
      perform undang_staf('z@contoh.id', 'admin', 'Z');
      raise exception 'GAGAL: mitra bisa mengundang admin';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f2", "role": "authenticated"}';
  do $$
  begin
    if terima_undangan() ->> 'mitra_id' is distinct from (select nilai from simpan where nama = 'mitra') then
      raise exception 'GAGAL: guru les tidak terikat ke lesnya';
    end if;
  end $$;

  -- ---------- 2. membuat kelas ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000ad", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := buat_kelas('Kelas Kancil', '00000000-0000-0000-0000-0000000000e1');
    if h ->> 'kode' !~ '^[A-HJKMNP-Z2-9]{6}$' then raise exception 'GAGAL: kode kelas tidak sesuai: %', h; end if;
    insert into simpan values ('kelas', h ->> 'id'), ('kode', h ->> 'kode');
    begin
      perform buat_kelas('Salah', '00000000-0000-0000-0000-0000000000f2');
      raise exception 'GAGAL: guru les bisa menjadi pengawas kelas Pintar Main';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
    begin
      insert into kelas (nama, kode) values ('Langsung', 'AAAAAA');
      raise exception 'GAGAL: kelas bisa ditulis langsung tanpa fungsi';
    exception when insufficient_privilege then null;
    end;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f1", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := buat_kelas('Cahaya A', '00000000-0000-0000-0000-0000000000f2', null);
    insert into simpan values ('kelas_les', h ->> 'id'), ('kode_les', h ->> 'kode');
    if (select count(*) from kelas) <> 1 then raise exception 'GAGAL: mitra melihat kelas di luar lesnya'; end if;
    begin
      perform ubah_kelas((select nilai from simpan where nama = 'kelas')::uuid, 'Rebut', null, true);
      raise exception 'GAGAL: mitra bisa mengubah kelas Pintar Main';
    exception when others then
      if sqlerrm like 'GAGAL%' then raise; end if;
    end;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from kelas) <> 1 then raise exception 'GAGAL: pengawas tidak melihat tepat 1 kelas'; end if;
    begin
      perform buat_kelas('Kelas Saya', '00000000-0000-0000-0000-0000000000e1');
      raise exception 'GAGAL: pengawas bisa membuat kelas';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000ad", "role": "authenticated"}';
  do $$ begin
    if (select count(*) from kelas) <> 1 then raise exception 'GAGAL: admin melihat kelas les mitra'; end if;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000005a", "role": "authenticated"}';
  do $$ begin
    if (select count(*) from kelas) <> 2 then raise exception 'GAGAL: super admin tidak melihat semua kelas'; end if;
    if jsonb_array_length(daftar_kelas_saya()) <> 2 then raise exception 'GAGAL: daftar_kelas_saya super admin'; end if;
  end $$;

  -- ---------- 3. orang tua bergabung dengan kode kelas ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare h jsonb; kode text := (select nilai from simpan where nama = 'kode');
  begin
    h := gabung_kelas(lower(substr(kode, 1, 3)) || '-' || substr(kode, 4), '20000000-0000-0000-0000-0000000000a1', 'siap_tka', 'kelas-v1', true);
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: Rani tidak bisa bergabung: %', h; end if;
    if h ->> 'pengawas_nama' <> 'Kak Nisa' then raise exception 'GAGAL: nama pengawas: %', h; end if;
    if abs(extract(epoch from ((h ->> 'coba_sampai')::timestamptz - now())) - 14 * 86400) > 60 then
      raise exception 'GAGAL: masa coba bukan 14 hari: %', h;
    end if;
    h := gabung_kelas(kode, '20000000-0000-0000-0000-0000000000a2', 'siap_tka', 'kelas-v1', false);
    if h ->> 'alasan' is distinct from 'paket_tidak_cocok' then raise exception 'GAGAL: paket Siap TKA untuk kelas 3 diterima: %', h; end if;
    h := gabung_kelas(kode, '20000000-0000-0000-0000-0000000000a2', 'dasar', 'kelas-v1', false);
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: Budi tidak bisa bergabung: %', h; end if;
    h := gabung_kelas('ZZZZZZ', '20000000-0000-0000-0000-0000000000a2', 'dasar', 'kelas-v1', false);
    if h ->> 'alasan' is distinct from 'kode_salah' then raise exception 'GAGAL: kode salah diterima: %', h; end if;
    h := gabung_kelas((select nilai from simpan where nama = 'kode_les'), '20000000-0000-0000-0000-0000000000a1', 'dasar', 'kelas-v1', false);
    if h ->> 'alasan' is distinct from 'sudah_di_kelas_lain' then raise exception 'GAGAL: anak masuk dua kelas: %', h; end if;
    h := gabung_kelas(kode, '20000000-0000-0000-0000-0000000000a1', 'lengkap', 'kelas-v1', true);
    if not (h ->> 'ok')::boolean or (select paket from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a1' and keluar is null) <> 'lengkap' then
      raise exception 'GAGAL: ganti paket di kelas yang sama: %', h;
    end if;
    h := gabung_kelas(kode, '20000000-0000-0000-0000-0000000000b1', 'dasar', 'kelas-v1', false);
    if h ->> 'alasan' is distinct from 'anak_tidak_valid' then raise exception 'GAGAL: anak keluarga lain bisa didaftarkan: %', h; end if;
    if (select count(*) from persetujuan where tujuan = 'ikut_kelas') <> 3 then raise exception 'GAGAL: persetujuan tidak tercatat'; end if;
    if (select count(*) from anggota_kelas) <> 2 then raise exception 'GAGAL: orang tua tidak melihat anggota kelas anaknya'; end if;
    if jsonb_array_length(kelas_keluarga()) <> 2 then raise exception 'GAGAL: kelas_keluarga orang tua'; end if;
  end $$;

  -- Kapasitas: kelas berisi 2 dari kapasitas 2 → anak ketiga ditolak.
  reset role;
  update kelas set kapasitas = 2 where id = (select nilai from simpan where nama = 'kelas')::uuid;
  set local role authenticated;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b1", "role": "authenticated"}';
  do $$
  declare h jsonb; kode text := (select nilai from simpan where nama = 'kode');
  begin
    h := gabung_kelas(kode, '20000000-0000-0000-0000-0000000000b1', 'dasar', 'kelas-v1', false);
    if h ->> 'alasan' is distinct from 'penuh' then raise exception 'GAGAL: kelas penuh tetap menerima: %', h; end if;
    if (select count(*) from anggota_kelas) <> 0 then raise exception 'GAGAL: orang tua B melihat anggota keluarga A'; end if;
  end $$;
  reset role;
  update kelas set kapasitas = 8 where id = (select nilai from simpan where nama = 'kelas')::uuid;
  set local role authenticated;
  do $$
  declare h jsonb;
  begin
    h := gabung_kelas((select nilai from simpan where nama = 'kode'), '20000000-0000-0000-0000-0000000000b1', 'dasar', 'kelas-v1', false);
    if not (h ->> 'ok')::boolean then raise exception 'GAGAL: Sari tidak bisa bergabung: %', h; end if;
  end $$;

  -- ---------- 4. pengawas membaca, menulis catatan dan tugas ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$
  declare k uuid := (select nilai from simpan where nama = 'kelas')::uuid; p jsonb;
  begin
    if (select count(*) from anak) <> 3 then raise exception 'GAGAL: pengawas tidak melihat tepat 3 anak'; end if;
    if (select count(*) from sesi) <> 1 then raise exception 'GAGAL: pengawas melihat sesi anak di luar kelasnya'; end if;
    if (select count(*) from keluarga) <> 0 then raise exception 'GAGAL: pengawas bisa membaca tabel keluarga'; end if;
    insert into catatan_pengawas (id, kelas_id, anak_id, keluarga_id, staf_id, isi) values
      ('40000000-0000-0000-0000-0000000000a1', k, '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1',
       '00000000-0000-0000-0000-0000000000e1', 'Rani rajin minggu ini. Pecahan masih perlu diulang.');
    begin
      insert into catatan_pengawas (id, kelas_id, anak_id, keluarga_id, staf_id, isi) values
        (gen_random_uuid(), k, '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000e1', 'salah keluarga');
      raise exception 'GAGAL: catatan bisa dikirim ke keluarga lain';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into catatan_pengawas (id, kelas_id, anak_id, keluarga_id, staf_id, isi) values
        (gen_random_uuid(), k, '20000000-0000-0000-0000-0000000000c1', '10000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000e1', 'bukan anggota');
      raise exception 'GAGAL: catatan untuk anak di luar kelas diterima';
    exception when insufficient_privilege then null;
    end;
    begin
      insert into catatan_pengawas (id, kelas_id, anak_id, keluarga_id, staf_id, isi) values
        (gen_random_uuid(), k, '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000ad', 'atas nama orang lain');
      raise exception 'GAGAL: catatan atas nama staf lain diterima';
    exception when insufficient_privilege then null;
    end;
    insert into tugas (id, kelas_id, anak_id, keluarga_id, staf_id, jenis, rujukan, judul) values
      ('50000000-0000-0000-0000-0000000000a1', k, '20000000-0000-0000-0000-0000000000a1', '10000000-0000-0000-0000-0000000000a1',
       '00000000-0000-0000-0000-0000000000e1', 'tka', 'pecahan', 'Ulang topik pecahan');
    p := papan_kelas(k);
    if jsonb_array_length(p -> 'anak') <> 3 then raise exception 'GAGAL: papan kelas tidak berisi 3 anak: %', p; end if;
    if (select x -> 'topik_lemah' -> 0 ->> 'topik' from jsonb_array_elements(p -> 'anak') x where x ->> 'nama' = 'Rani') is distinct from 'pecahan' then
      raise exception 'GAGAL: topik lemah Rani tidak muncul: %', p;
    end if;
    if (select (x ->> 'hari_latihan_7')::int from jsonb_array_elements(p -> 'anak') x where x ->> 'nama' = 'Rani') <> 1 then
      raise exception 'GAGAL: hari latihan Rani: %', p;
    end if;
    if (p ->> 'pantauan_hari_ini')::boolean then raise exception 'GAGAL: pantauan sudah tertanda sebelum ditekan'; end if;
    perform catat_pantauan(k);
    if not (papan_kelas(k) ->> 'pantauan_hari_ini')::boolean then raise exception 'GAGAL: pantauan tidak tercatat'; end if;
  end $$;

  -- Guru les dan pemilik les tidak melihat kelas Pintar Main.
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f2", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from anak) <> 0 then raise exception 'GAGAL: guru les melihat anak kelas lain'; end if;
    begin
      insert into catatan_pengawas (id, kelas_id, anak_id, keluarga_id, staf_id, isi) values
        (gen_random_uuid(), (select nilai from simpan where nama = 'kelas')::uuid, '20000000-0000-0000-0000-0000000000a1',
         '10000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000f2', 'menyusup');
      raise exception 'GAGAL: guru les menulis catatan di kelas lain';
    exception when insufficient_privilege then null;
    end;
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000f1", "role": "authenticated"}';
  do $$
  begin
    begin
      perform papan_kelas((select nilai from simpan where nama = 'kelas')::uuid);
      raise exception 'GAGAL: mitra membuka papan kelas Pintar Main';
    exception when insufficient_privilege then null;
    end;
  end $$;

  -- ---------- 5. orang tua dan HP anak membaca catatan dan tugas ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000b1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from catatan_pengawas) + (select count(*) from tugas) <> 0 then raise exception 'GAGAL: orang tua B melihat catatan atau tugas keluarga A'; end if;
    if tandai_tugas_selesai(array['50000000-0000-0000-0000-0000000000a1']::uuid[]) <> 0 then raise exception 'GAGAL: orang tua B menyelesaikan tugas anak A'; end if;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000c9", "role": "authenticated", "is_anonymous": true}';
  do $$
  begin
    if (select count(*) from tugas) <> 1 then raise exception 'GAGAL: HP anak tidak melihat tugasnya'; end if;
    if (select count(*) from catatan_pengawas) <> 0 then raise exception 'GAGAL: HP anak melihat catatan untuk orang tua'; end if;
    if jsonb_array_length(kelas_keluarga()) <> 1 then raise exception 'GAGAL: kelas_keluarga di HP anak'; end if;
    if tandai_tugas_selesai(array['50000000-0000-0000-0000-0000000000a1']::uuid[]) <> 1 then raise exception 'GAGAL: HP anak tidak bisa menyelesaikan tugas'; end if;
    begin
      update tugas set judul = 'diubah anak';
      if exists (select 1 from tugas where judul = 'diubah anak') then raise exception 'GAGAL: HP anak bisa mengubah tugas'; end if;
    exception when insufficient_privilege then null;
    end;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare awal timestamptz;
  begin
    if (select count(*) from catatan_pengawas) <> 1 then raise exception 'GAGAL: orang tua A tidak melihat catatan'; end if;
    if (select selesai from tugas) is null then raise exception 'GAGAL: tugas selesai tidak terlihat orang tua'; end if;
    if tandai_catatan_dibaca(array['40000000-0000-0000-0000-0000000000a1']::uuid[]) <> 1 then raise exception 'GAGAL: tandai catatan dibaca'; end if;
    begin
      update catatan_pengawas set isi = 'diubah ortu';
      if exists (select 1 from catatan_pengawas where isi = 'diubah ortu') then raise exception 'GAGAL: orang tua bisa mengubah catatan pengawas'; end if;
    exception when insufficient_privilege then null;
    end;
    -- Keluar lalu masuk lagi: masa coba tidak diulang.
    awal := (select coba_sampai from anggota_kelas where anak_id = '20000000-0000-0000-0000-0000000000a2' and keluar is null);
    if keluar_kelas('20000000-0000-0000-0000-0000000000a2') <> 1 then raise exception 'GAGAL: keluar kelas'; end if;
    insert into simpan values ('coba_budi', awal::text);
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$
  begin
    if exists (select 1 from anak where nama = 'Budi') then raise exception 'GAGAL: pengawas masih melihat anak yang sudah keluar'; end if;
  end $$;

  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000a1", "role": "authenticated"}';
  do $$
  declare h jsonb;
  begin
    h := gabung_kelas((select nilai from simpan where nama = 'kode'), '20000000-0000-0000-0000-0000000000a2', 'dasar', 'kelas-v1', false);
    if (h ->> 'coba_sampai')::timestamptz > (select nilai from simpan where nama = 'coba_budi')::timestamptz then
      raise exception 'GAGAL: masa coba diulang setelah keluar-masuk: %', h;
    end if;
    -- Batas tebakan kode kelas.
    for i in 1..5 loop perform gabung_kelas('QQQQQQ', '20000000-0000-0000-0000-0000000000a2', 'dasar', 'kelas-v1', false); end loop;
    if gabung_kelas((select nilai from simpan where nama = 'kode'), '20000000-0000-0000-0000-0000000000a2', 'dasar', 'kelas-v1', false) ->> 'alasan'
       is distinct from 'terlalu_sering' then
      raise exception 'GAGAL: tebakan kode kelas tidak dibatasi';
    end if;
    begin
      perform count(*) from catatan_kegiatan;
      raise exception 'GAGAL: orang tua bisa membaca catatan kegiatan';
    exception when insufficient_privilege then null;
    end;
  end $$;

  -- ---------- 6. super admin menghentikan pengawas ----------
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000005a", "role": "authenticated"}';
  do $$
  begin
    perform papan_kelas((select nilai from simpan where nama = 'kelas')::uuid);
    perform atur_staf_aktif('00000000-0000-0000-0000-0000000000e1', false);
  end $$;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000000e1", "role": "authenticated"}';
  do $$
  begin
    if (select count(*) from kelas) + (select count(*) from anak) <> 0 then raise exception 'GAGAL: pengawas yang dihentikan masih melihat kelas'; end if;
  end $$;

  reset role;
  do $$
  begin
    if not exists (select 1 from catatan_kegiatan where tindakan = 'lihat_papan') then raise exception 'GAGAL: super admin membuka papan tidak tercatat'; end if;
    if not exists (select 1 from catatan_kegiatan where tindakan = 'hentikan_staf') then raise exception 'GAGAL: penghentian staf tidak tercatat'; end if;
  end $$;
rollback;
