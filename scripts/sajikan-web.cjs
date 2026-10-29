/** Penyaji statis kecil untuk folder dist/ (fallback ke index.html untuk rute expo-router). */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const akar = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 8081);
const jenis = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.ttf': 'font/ttf', '.wav': 'audio/wav', '.ico': 'image/x-icon' };

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let berkas = path.join(akar, url);
    if (!berkas.startsWith(akar) || !fs.existsSync(berkas) || fs.statSync(berkas).isDirectory()) berkas = path.join(akar, 'index.html');
    res.writeHead(200, { 'Content-Type': jenis[path.extname(berkas)] || 'application/octet-stream' });
    fs.createReadStream(berkas).pipe(res);
  })
  .listen(port, () => console.log(`Menyajikan ${akar} di http://localhost:${port}`));
