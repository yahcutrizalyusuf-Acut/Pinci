"""Mengubah .docx menjadi .pdf lewat Microsoft Word (pywin32).

python konversi.py <folder_masuk> <folder_keluar> [--daftar-isi]
"""
import os, sys, glob
import win32com.client as wc


def konversi(masuk, keluar, daftar_isi=False):
    os.makedirs(keluar, exist_ok=True)
    app = wc.DispatchEx("Word.Application")
    app.Visible = False
    app.DisplayAlerts = 0
    try:
        for f in sorted(glob.glob(os.path.join(masuk, "*.docx"))):
            if os.path.basename(f).startswith("~$"):
                continue
            d = app.Documents.Open(os.path.abspath(f), False, not daftar_isi)
            if daftar_isi:
                for i in range(1, d.TablesOfContents.Count + 1):
                    d.TablesOfContents(i).Update()
            out = os.path.join(os.path.abspath(keluar), os.path.basename(f)[:-5] + ".pdf")
            d.ExportAsFixedFormat(out, 17)
            d.Close(False)
            print("pdf", os.path.basename(out), flush=True)
    finally:
        app.Quit()


if __name__ == "__main__":
    konversi(sys.argv[1], sys.argv[2], "--daftar-isi" in sys.argv)
