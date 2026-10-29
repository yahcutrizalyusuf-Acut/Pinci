"""Membuka .docx di Microsoft Word, memperbarui daftar isi, lalu menyimpannya.
python perbarui_daftar_isi.py <berkas.docx> [...]"""
import os, sys
import win32com.client as wc

app = wc.DispatchEx("Word.Application")
app.Visible = False
app.DisplayAlerts = 0
try:
    for f in sys.argv[1:]:
        d = app.Documents.Open(os.path.abspath(f), False, False)
        for i in range(1, d.TablesOfContents.Count + 1):
            d.TablesOfContents(i).Update()
        d.Save()
        d.Close(False)
        print("daftar isi diperbarui:", os.path.basename(f))
finally:
    app.Quit()
