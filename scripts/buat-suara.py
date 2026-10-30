"""
Membuat rekaman suara Inggris untuk Pintar Main dengan Kokoro-82M (lisensi Apache-2.0), berjalan offline.

Dipanggil oleh `npm run suara` (scripts/buat-suara.ts):
    python3 scripts/buat-suara.py <daftar-en.json> <folder-keluaran>

Butuh: pip install kokoro-onnx soundfile, dan ffmpeg.
Model (±330 MB) diunduh sekali ke ~/.cache/pintar-main-suara dari Hugging Face (onnx-community/Kokoro-82M-v1.0-ONNX).
"""
import json
import os
import subprocess
import sys
import tempfile
import urllib.request

SUARA = os.environ.get("SUARA_KOKORO", "af_heart")  # suara perempuan Amerika, paling jelas untuk anak
KECEPATAN = float(os.environ.get("KECEPATAN_SUARA", "0.85"))
CACHE = os.path.expanduser("~/.cache/pintar-main-suara")
BERKAS = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}


def unduh():
    os.makedirs(CACHE, exist_ok=True)
    for nama, url in BERKAS.items():
        tujuan = os.path.join(CACHE, nama)
        if not os.path.exists(tujuan):
            print(f"Mengunduh {nama} …", flush=True)
            urllib.request.urlretrieve(url, tujuan + ".sebagian")
            os.replace(tujuan + ".sebagian", tujuan)


def main():
    daftar_path, keluar = sys.argv[1], sys.argv[2]
    daftar = json.load(open(daftar_path, encoding="utf-8"))
    kurang = [d for d in daftar if not os.path.exists(os.path.join(keluar, d["kunci"] + ".mp3"))]
    if not kurang:
        return
    unduh()
    import soundfile as sf
    from kokoro_onnx import Kokoro

    k = Kokoro(os.path.join(CACHE, "kokoro-v1.0.onnx"), os.path.join(CACHE, "voices-v1.0.bin"))
    with tempfile.TemporaryDirectory() as tmp:
        for i, d in enumerate(kurang, 1):
            sampel, sr = k.create(d["teks"], voice=SUARA, speed=KECEPATAN, lang="en-us")
            wav = os.path.join(tmp, "a.wav")
            sf.write(wav, sampel, sr)
            # mono, 24 kHz, MP3 48 kbps; buang hening di awal/akhir; tambah jeda 0,15 detik di awal
            subprocess.run(
                [
                    "ffmpeg", "-loglevel", "error", "-y", "-i", wav,
                    "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,adelay=150,loudnorm=I=-16:TP=-1.5",
                    "-ac", "1", "-ar", "24000", "-b:a", "48k",
                    os.path.join(keluar, d["kunci"] + ".mp3"),
                ],
                check=True,
            )
            if i % 25 == 0 or i == len(kurang):
                print(f"  {i}/{len(kurang)}", flush=True)


if __name__ == "__main__":
    main()
