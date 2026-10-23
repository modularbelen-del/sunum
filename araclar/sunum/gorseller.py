"""Sunum görsellerini üretir: drone karelerini slayt oranlarına kırpar, bölgeleme şemasının başlığını keser,
konum ve koridor diyagramını çizer. Çıktı: araclar/sunum/assets/ (git dışı) ve reports/gorseller/konum_koridor_semasi.png."""
import subprocess
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
G = ROOT / "reports" / "gorseller"
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)


def crop(src, aspect, out, width=2000, fx=0.5, fy=0.5):
    im = Image.open(G / src).convert("RGB")
    w, h = im.size
    if w / h > aspect:
        nw = int(h * aspect)
        x = int((w - nw) * fx)
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(w / aspect)
        y = int((h - nh) * fy)
        im = im.crop((0, y, w, y + nh))
    if im.width > width:
        im = im.resize((width, int(width / im.width * im.height)), Image.LANCZOS)
    im.save(OUT / out, quality=88)


crop("drone_05_ova_manzarasi.jpg", 16 / 9, "kapak.jpg")
crop("drone_03_orencik_koyu_ve_plato.jpg", 7.35 / 4.8, "saha_buyuk.jpg")
crop("drone_01_yarinti_ve_teras_agaclandirma.jpg", 4.58 / 2.3, "saha_sag1.jpg", fy=0.55)
crop("drone_02_yamac_teraslari_ve_yollar.jpg", 4.58 / 2.3, "saha_sag2.jpg")
crop("drone_04_plato_tarlalari.jpg", 4.55 / 7.5, "karar.jpg", fx=0.45)
Image.open(G / "bolgeleme_semasi.png").crop((0, 58, 1500, 980)).save(OUT / "bolgeleme.png")
subprocess.run([sys.executable, str(HERE / "harita.py"), str(OUT / "harita.png")], check=True)
Image.open(OUT / "harita.png").save(G / "konum_koridor_semasi.png")
print("görseller hazır:", OUT)
