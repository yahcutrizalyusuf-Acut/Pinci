/**
 * Formulir daftar: kirim ke fungsi server daftar_minat (Supabase). Asal pengunjung diambil dari ?dari=…
 * di tautan iklan (contoh ?dari=fb-tka-1). Tanpa pelacak pihak ketiga dan tanpa kuki.
 */
(function () {
  var cfg = window.PINTAR || {};
  var param = new URLSearchParams(location.search);
  var sumber = (param.get('dari') || '').slice(0, 40);
  try {
    if (sumber) sessionStorage.setItem('pintar-dari', sumber);
    else sumber = sessionStorage.getItem('pintar-dari') || 'langsung';
  } catch (e) {
    sumber = sumber || 'langsung';
  }

  // Harga dari config.js
  document.querySelectorAll('[data-harga]').forEach(function (el) {
    var h = (cfg.harga || {})[el.getAttribute('data-harga')];
    if (h) el.textContent = h;
  });
  // Tombol WhatsApp admin
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    if (!cfg.waAdmin) {
      el.style.display = 'none';
      return;
    }
    el.href = 'https://wa.me/' + cfg.waAdmin + '?text=' + encodeURIComponent(el.getAttribute('data-wa'));
  });

  var form = document.querySelector('form[data-jenis]');
  if (!form) return;
  var ok = document.querySelector('.pesan-ok');
  var galat = document.querySelector('.pesan-galat');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    galat.style.display = 'none';
    var d = new FormData(form);
    var badan = {
      p_jenis: form.getAttribute('data-jenis'),
      p_nama_ortu: String(d.get('nama_ortu') || ''),
      p_email: String(d.get('email') || ''),
      p_wa: String(d.get('wa') || ''),
      p_kelas_anak: d.get('kelas_anak') ? Number(d.get('kelas_anak')) : null,
      p_nama_anak: String(d.get('nama_anak') || ''),
      p_nama_les: String(d.get('nama_les') || ''),
      p_sumber: sumber,
    };
    if (!cfg.supabaseUrl || !cfg.kunciAnon) {
      galat.textContent = 'Formulir belum tersambung ke server. Hubungi admin lewat WhatsApp.';
      galat.style.display = 'block';
      return;
    }
    var tombol = form.querySelector('button');
    tombol.disabled = true;
    fetch(cfg.supabaseUrl.replace(/\/$/, '') + '/rest/v1/rpc/daftar_minat', {
      method: 'POST',
      headers: { apikey: cfg.kunciAnon, Authorization: 'Bearer ' + cfg.kunciAnon, 'Content-Type': 'application/json' },
      body: JSON.stringify(badan),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (h) {
        tombol.disabled = false;
        if (h && h.ok) {
          form.style.display = 'none';
          ok.style.display = 'block';
        } else {
          galat.textContent = h && h.alasan === 'terlalu_sering' ? 'Email ini sudah mendaftar hari ini. Kami akan segera menghubungi Anda.' : 'Periksa lagi nama dan email Anda.';
          galat.style.display = 'block';
        }
      })
      .catch(function () {
        tombol.disabled = false;
        galat.textContent = 'Belum tersambung. Periksa internet, lalu coba lagi.';
        galat.style.display = 'block';
      });
  });
})();
