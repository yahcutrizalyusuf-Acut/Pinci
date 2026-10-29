-- Uji wajib RLS (03-basis-data.md bagian 4): jalankan di proyek uji dengan `supabase test db` atau psql.
-- Orang tua keluarga A tidak boleh membaca satu baris pun milik keluarga B.
begin;
  insert into auth.users (id, email) values ('00000000-0000-0000-0000-00000000000a', 'a@contoh.id'), ('00000000-0000-0000-0000-00000000000b', 'b@contoh.id');
  insert into keluarga (id) values ('10000000-0000-0000-0000-00000000000a'), ('10000000-0000-0000-0000-00000000000b');
  insert into orang_tua (id, keluarga_id) values ('00000000-0000-0000-0000-00000000000a', '10000000-0000-0000-0000-00000000000a'), ('00000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b');
  insert into anak (id, keluarga_id, nama, kelas, hewan) values ('20000000-0000-0000-0000-00000000000b', '10000000-0000-0000-0000-00000000000b', 'Rani', 3, 'kucing');

  set local role authenticated;
  set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-00000000000a", "role": "authenticated"}';
  do $$ begin
    if (select count(*) from anak) <> 0 then raise exception 'RLS bocor: keluarga A melihat anak keluarga B'; end if;
  end $$;
rollback;
