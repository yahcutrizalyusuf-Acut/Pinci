-- Pintar Main — melonggarkan batas pendaftaran masa coba: 3 menjadi 15 per kontak per hari.
-- Sebabnya: satu keluarga bisa punya beberapa anak dan mendaftar dengan nomor yang sama (laporan Acut 4 Nov 2026).
-- Batas 300 per jam di seluruh server tetap ada untuk mencegah banjir pendaftaran.

-- Dipanggil website (tanpa masuk) dan mode orang tua di aplikasi. Dibatasi 15 kali per kontak per hari (satu keluarga bisa mendaftarkan beberapa anak), 300 per jam.
create or replace function daftar_coba(p jsonb) returns jsonb
  language plpgsql security definer set search_path = public
as $$
declare
  v_email text := nullif(lower(trim(coalesce(p ->> 'email', ''))), '');
  v_wa text := nullif(left(regexp_replace(coalesce(p ->> 'wa', ''), '[^0-9+]', '', 'g'), 20), '');
  v_kelas int := case when (p ->> 'kelas') ~ '^[1-6]$' then (p ->> 'kelas')::int end;
  v_pel text[];
  v_cara text := coalesce(p ->> 'cara', 'online');
  v_peng jsonb := case when jsonb_typeof(p -> 'pengenalan') = 'object' then p -> 'pengenalan' end;
  v_telp text := nullif(p ->> 'waktu_telepon', '');
  v_kontak text;
  v_antre int;
begin
  if jsonb_typeof(p -> 'pelajaran') = 'array' then
    select coalesce(array_agg(distinct x order by x), '{}') into v_pel from jsonb_array_elements_text(p -> 'pelajaran') x;
  else v_pel := '{}'; end if;
  if char_length(trim(coalesce(p ->> 'nama_ortu', ''))) = 0 or char_length(trim(coalesce(p ->> 'nama_lengkap_anak', ''))) = 0
     or v_kelas is null or (v_email is null and v_wa is null)
     or (v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
     or (v_wa is not null and char_length(regexp_replace(v_wa, '[^0-9]', '', 'g')) < 9) then
    return jsonb_build_object('ok', false, 'alasan', 'isian_tidak_lengkap');
  end if;
  if not coalesce((p ->> 'izin_kontak')::boolean, false) or char_length(coalesce(p ->> 'versi_teks', '')) = 0 then
    return jsonb_build_object('ok', false, 'alasan', 'belum_setuju');
  end if;
  if not pelajaran_sah(v_pel) or v_cara not in ('online', 'antre_tatap_muka') or not pengenalan_sah(v_peng)
     or (v_telp is not null and v_telp not in ('pagi', 'siang', 'sore', 'malam')) then
    return jsonb_build_object('ok', false, 'alasan', 'isian_tidak_valid');
  end if;
  if v_cara = 'antre_tatap_muka' and char_length(trim(coalesce(p ->> 'kota', ''))) = 0 then
    return jsonb_build_object('ok', false, 'alasan', 'kota_kosong');
  end if;
  v_pel := array(select x from unnest(v_pel) x where x <> 'tka' or v_kelas = 6);
  v_kontak := coalesce(v_email, v_wa);
  if (select count(*) from pendaftar where coalesce(email, wa) = v_kontak and waktu > now() - interval '1 day') >= 15
     or (select count(*) from pendaftar where waktu > now() - interval '1 hour') >= 300 then
    return jsonb_build_object('ok', false, 'alasan', 'terlalu_sering');
  end if;
  insert into pendaftar (jenis, nama_ortu, email, wa, kelas_anak, nama_anak, nama_lengkap_anak, sumber, pelajaran, tujuan, cara, kota,
                         pengenalan, minta_telepon, waktu_telepon, izin_kontak, izin_pengembangan, versi_teks, asal)
  values ('keluarga', left(trim(p ->> 'nama_ortu'), 40), v_email, v_wa, v_kelas,
          left(split_part(trim(p ->> 'nama_lengkap_anak'), ' ', 1), 16), left(trim(p ->> 'nama_lengkap_anak'), 60),
          left(trim(p ->> 'sumber'), 40), v_pel, left(nullif(trim(p ->> 'tujuan'), ''), 200), v_cara,
          case when v_cara = 'antre_tatap_muka' then left(trim(p ->> 'kota'), 40) end,
          v_peng, coalesce((p ->> 'minta_telepon')::boolean, false), case when coalesce((p ->> 'minta_telepon')::boolean, false) then v_telp end,
          true, coalesce((p ->> 'izin_pengembangan')::boolean, false), left(p ->> 'versi_teks', 40),
          case when p ->> 'asal' = 'aplikasi' then 'aplikasi' else 'web' end);
  if v_cara = 'antre_tatap_muka' then
    select count(*) into v_antre from pendaftar
      where cara = 'antre_tatap_muka' and lower(kota) = lower(trim(p ->> 'kota')) and status <> 'batal';
  end if;
  return jsonb_build_object('ok', true, 'harga', hitung_harga(v_pel, v_kelas, 1), 'nomor_antrean', v_antre);
end $$;
grant execute on function daftar_coba(jsonb) to anon, authenticated;
