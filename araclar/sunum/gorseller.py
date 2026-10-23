"""Sunum görsellerini üretir: drone karelerini slayt oranlarına kırpar, bölgeleme şemasının başlığını keser,
ekosistem görsellerini ve portföy görsellerini hazırlar. Çıktı: araclar/sunum/assets/ (git dışı)."""
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
# Proje ekibinin ekosistem görselleri (resim 23 ve 24; reports/gorseller altında kopyaları var)
crop("ekosistem_2030.jpg", 16 / 9, "ekosistem.jpg")
crop("ekosistem_mesafeler.jpg", 16 / 9, "mesafeler.jpg", width=2400)
print("görseller hazır:", OUT)

# Portföyden kendi projelerimizin görselleri (docs/portfoy; 74. sayfa bu dosyada yok)
import pypdfium2 as pdfium

PORTFOY = ROOT / "docs" / "portfoy" / "Belen_Partners_ilgili_sayfalar.pdf"
pdf = pdfium.PdfDocument(str(PORTFOY))


def sayfa(no, dpi=100):
    return pdf[no - 1].render(scale=dpi / 72).to_pil().convert("RGB")


def kes(im, box, out):
    im.crop(box).save(OUT / out, quality=88)


kes(sayfa(8), (620, 51, 2441, 776), "ref_tai_ankara.jpg")        # TAI Ankara Lodgings vaziyet perspektifi
kes(sayfa(9), (100, 430, 709, 746), "ref_kentsel_donusum.jpg")   # Kahramankazan Kentsel Dönüşüm
kes(sayfa(10), (400, 76, 1702, 752), "ref_kent_merkezi.jpg")      # Kahramankazan Kent Merkezi
print("portföy görselleri hazır")
