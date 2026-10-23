"""Investment (2026 TL, KDV hariç, arazi hariç) and public-benefit estimate for the 2,500-unit scenario."""
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
NOTE = Path(r"C:\Users\muhammedalicinar\Documents\SavunmaSanayiOturum\research_notes\Örencik yaşam alanı fizibilitesi\10_yatirim_ve_fayda_hesabi.md")

UNITS, GFA_UNIT, HH = 2500, 120, 3.0
EUR_TL = 53.7
M = 1e6

# --- investment items: (name, low, base, high, public?, basis)
housing_gfa = UNITS * GFA_UNIT
items = []
def add(name, low, base, high, public, basis):
    items.append((name, low, base, high, public, basis))

add("Konutlar", housing_gfa * 21050, housing_gfa * 26450, housing_gfa * 33900, False,
    f"{housing_gfa:,} m²".replace(",", ".") + f" × ÇŞİDB 2026 yaklaşık birim maliyeti (III-B 21.050 / IV-A 26.450 / IV-B 33.900 TL/m²)")
h = items[0]
add("Kentsel altyapı (yol, su, kanalizasyon, yağmur suyu, elektrik, doğalgaz, fiber)",
    h[2] * 0.15, h[2] * 0.20, h[2] * 0.25, True, "konut maliyetinin %15–25'i (duyarlılık aralığı; Türkiye'ye özgü TL/ha verisi bulunamadı)")
add("Devlet okul kampüsü (yaklaşık 32 derslik)", 32 * 6.0 * M, 32 * 6.2 * M, 32 * 7.1 * M, True,
    "derslik başına 6,0–7,1 milyon TL (Gemlik 16 derslik 2026, Nazilli anaokulu 2025)")
add("Özel okul kampüsü (yaklaşık 25 derslik)", 25 * 6.0 * M, 25 * 6.2 * M, 25 * 7.1 * M, False,
    "aynı birim; özel okul yatırımcısı")
add("ASM, 112 istasyonu ve poliklinik (yaklaşık 2.500 m²)", 2500 * 21050, 2500 * 26450, 2500 * 33900, True,
    "2.500 m² × ÇŞİDB 2026 birim maliyetleri")
add("Kültür merkezi, kütüphane ve atölyeler (yaklaşık 3.000 m²)", 3000 * 17800, 3000 * 22600, 3000 * 26450, True,
    "Bursa Yıldırım 2025 (≈17.800 TL/m²) 2026'ya %27 artışla")
add("Spor kompleksi (spor salonu yaklaşık 3.000 m² ve açık sahalar)", 3000 * 30400 + 10000 * 2500,
    3000 * 38000 + 10000 * 3100, 3000 * 44000 + 10000 * 3700, True,
    "Aydın Efeler 2025 ≈30.400, Bursa 2024 ≈34.900 TL/m² (2026'ya taşındı); açık sahalar park birim maliyetiyle")
lake_m2 = 25000
add("Yapay göl (2,5 ha; kazı, geçirimsizlik, kenar, sirkülasyon ve arıtma, yağmur suyu toplama)",
    lake_m2 * 2200, lake_m2 * 4400, lake_m2 * 6600, True,
    "metraj tahmini ≈4.400 TL/m² su yüzeyi, ±%50 (Türkiye'de gölet birim fiyatı bulunamadı)")
add("Göl parkı ve mahalle parkları (5 ha)", 50000 * 2480, 50000 * 3100, 50000 * 3700, True,
    "Kelkit Millet Bahçesi Aralık 2024 ≈2.480 TL/m², 2026'ya taşındı")
add("Korunan yamaçlar: yürüyüş parkurları, seyir noktaları, ek ağaçlandırma (10 ha)", 100000 * 200,
    100000 * 300, 100000 * 450, True, "hafif peyzaj varsayımı (kaynaksız)")
add("Mahalle merkezi ve ticaret (yaklaşık 12.000 m²)", 12000 * 21050, 12000 * 26450, 12000 * 33900, False,
    "12.000 m² × ÇŞİDB 2026 birim maliyetleri")
add("Akıllı şehir sistemleri (fiber, akıllı sayaç, sensörler, platform, operasyon merkezi)",
    UNITS * 40000, UNITS * 60000, UNITS * 90000, True, "konut başına 40–90 bin TL varsayımı (kaynaksız)")
bus_n = 13
add(f"Örencik–TUSAŞ Ekspres: {bus_n} elektrikli otobüs (12 m) ve şarj deposu",
    bus_n * 480000 * EUR_TL * 1.15, bus_n * 540000 * EUR_TL * 1.20, bus_n * 600000 * EUR_TL * 1.25, True,
    "12 m e-otobüs 480–600 bin EUR (Karsan 2024 ihalesi, 2022 analist tahmini), depo için +%15–25, kur 53,7")
add("Servis ve aktarma istasyonu, duraklar", 20 * M, 30 * M, 45 * M, True, "varsayım (kaynaksız)")

sub = [sum(i[k] for i in items) for k in (1, 2, 3)]
cont = [s * 0.10 for s in sub]
tot = [s + c for s, c in zip(sub, cont)]
pub = [sum(i[k] for i in items if i[4]) * 1.10 for k in (1, 2, 3)]

# --- benefits (annual, base and range)
households = UNITS
workers = households * 1.4
defense = workers * 0.50
days = 220
vot = (200, 200, 350)                  # TL/saat
saved_min_day = (20, 35, 50)           # dakika/gün/kişi (gidiş-dönüş), Örencik–TUSAŞ Ekspres karşısında koridor
car_before, car_after, occ = 0.40, 0.25, 1.25
km_one_way = 25
fuel_l_100, fuel_tl = 7.0, 80.6
co2_g_km, co2_eur = 162, 82.4
cars_removed_corridor = defense * car_before / occ
cars_avoided = defense * (car_before - car_after) / occ
car_km = cars_avoided * 2 * km_one_way * days
time_tl = [defense * m / 60 * days * v for m, v in zip(saved_min_day, vot)]
fuel_tl_y = car_km * fuel_l_100 / 100 * fuel_tl
co2_t = car_km * co2_g_km / 1e6
co2_tl = co2_t * co2_eur * EUR_TL
ben = [t + fuel_tl_y + co2_tl for t in time_tl]
pv_factor = sum(1 / 1.05 ** y for y in range(1, 31))
jobs_per_bn = 70000 / 36.5 / 6.5      # TOKİ 2021 oranı, 2021→2026 maliyet artışı ≈6,5 kat (varsayım)
jobs = tot[1] / 1e9 * jobs_per_bn / 6  # 6 yıllık inşaat süresine yayılmış yıllık ortalama


def bn(x):
    return f"{x / 1e9:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def mn(x):
    return f"{x / 1e6:,.0f}".replace(",", ".")


def n0(x):
    return f"{x:,.0f}".replace(",", ".")


lines = ["# Yatırım tutarı ve kamu faydası (hesap)", "",
         "Not: Tarih 2026-10-23. Bu not koordinatörün hesabıdır; birim değerler 03, 05 ve 06 numaralı notlardan, 2026 yapı yaklaşık birim maliyetleri önceki fizibilite notlarından (03_arazi_hukuk_maliyet) alındı. Kaynağı olmayan her değer \"varsayım\" diye işaretli. Tutarlar 2026 TL, KDV hariç, arazi bedeli hariç (arazi Hazine'nin; satın alınmıyor). Önerilen senaryo: 2.500 konut, yaklaşık 7.500 kişi. Betik: scratchpad `invest.py`.",
         "", "## Yatırım tablosu (milyon TL)", "",
         "| Kalem | Düşük | Baz | Yüksek | Kamu ve ortak kullanım | Dayanak |", "|---|---:|---:|---:|:---:|---|"]
for name, lo, ba, hi, p, basis in items:
    lines.append(f"| {name} | {mn(lo)} | {mn(ba)} | {mn(hi)} | {'evet' if p else 'hayır'} | {basis} |")
lines += [f"| Ara toplam | {mn(sub[0])} | {mn(sub[1])} | {mn(sub[2])} | | |",
          f"| Proje, etüt, müşavirlik ve beklenmeyen giderler (%10, varsayım) | {mn(cont[0])} | {mn(cont[1])} | {mn(cont[2])} | | |",
          f"| **Toplam yatırım** | **{mn(tot[0])}** | **{mn(tot[1])}** | **{mn(tot[2])}** | | |",
          f"| **Kamu ve ortak kullanım payı (%10 dahil)** | **{mn(pub[0])}** | **{mn(pub[1])}** | **{mn(pub[2])}** | | |",
          "",
          f"- Toplam yatırım baz senaryoda yaklaşık **{bn(tot[1])} milyar TL** (aralık {bn(tot[0])}–{bn(tot[2])}). Konut başına yaklaşık {mn(tot[1] / UNITS)} milyon TL.",
          f"- Kamu ve ortak kullanım kalemleri (altyapı, devlet okulları, sağlık, kültür ve spor, göl ve parklar, akıllı şehir, ulaşım) yaklaşık **{bn(pub[1])} milyar TL** (aralık {bn(pub[0])}–{bn(pub[2])}); toplamın %{pub[1] / tot[1] * 100:.0f}'i.",
          "- Konut, özel okul ve ticaret yatırımları satış ve işletme gelirleriyle karşılanan kalemlerdir. Kamu ve ortak kullanım kalemlerinin bir kısmı (site içi altyapı, göl ve parklar, akıllı şehir) uygulama modeline göre konut bedeline yüklenebilir; bu rapor uygulama modelini tartışmıyor.",
          "- Cami yatırımı (yaklaşık 1.500 m²) genelde hayırsever ya da dernek eliyle yapıldığı için tabloya alınmadı.",
          "- En büyük belirsizlikler: konutun yapı sınıfı (kat yüksekliğine göre III-B ile IV-B arası), altyapı oranı, zemin koşulları (drone: yarıntılı, olası jipsli zemin; jeoteknik etüt gerekir) ve 2026 sonrası maliyet artışı (TÜİK inşaat maliyet endeksi yıllık %25–30).",
          "", "## Ekspres hattın boyutu", "",
          f"- Çalışan sakin: {n0(households)} hane × 1,4 çalışan = {n0(workers)} kişi (varsayım). En az yarısı savunma ve havacılık kümesinde: **{n0(defense)} kişi** (ilk brif).",
          f"- Ekspres payı %50 ile sabah pikinde yaklaşık {n0(defense * 0.5)} yolcu; 12 m otobüs başına yaklaşık 85 yolcu, %15 yedekle **{bus_n} otobüs**.",
          "- Elektrikli otobüs tüketimi 1,15 kWh/km (Hollanda verisi, soğukta +%14); işletme TUSAŞ servis sözleşmesi modeliyle.",
          "", "## Yıllık kamu faydası (ölçülebilen kısım)", "",
          f"Varsayımlar: {days} iş günü; Batıkent–Susuz–Eryaman koridorundan gelen çalışanın Örencik–TUSAŞ Ekspres ile günde {saved_min_day[0]}–{saved_min_day[2]} dakika (baz {saved_min_day[1]}) kazandığı; zaman değeri 200 TL/saat (yüksek senaryoda mühendis için 350); otomobil payı %40'tan %25'e iner; araç doluluğu 1,25; tek yön 25 km; 7 L/100 km; benzin 80,6 TL/L; 162 g CO2/km; karbon 82,4 EUR/t. Zaman değeri, doluluk ve otomobil payları kaynaksız varsayımdır (06 numaralı not).",
          "",
          "| Fayda | Düşük | Baz | Yüksek |", "|---|---:|---:|---:|",
          f"| Kazanılan zaman (milyon TL/yıl) | {mn(time_tl[0])} | {mn(time_tl[1])} | {mn(time_tl[2])} |",
          f"| Yakıt tasarrufu (milyon TL/yıl) | {mn(fuel_tl_y)} | {mn(fuel_tl_y)} | {mn(fuel_tl_y)} |",
          f"| Önlenen CO2 (milyon TL/yıl) | {co2_tl / 1e6:.1f} | {co2_tl / 1e6:.1f} | {co2_tl / 1e6:.1f} |",
          f"| **Toplam (milyon TL/yıl)** | **{mn(ben[0])}** | **{mn(ben[1])}** | **{mn(ben[2])}** |",
          f"| 30 yıllık bugünkü değer, reel %5 (milyar TL) | {bn(ben[0] * pv_factor)} | {bn(ben[1] * pv_factor)} | {bn(ben[2] * pv_factor)} |",
          "",
          f"- Batıkent–Susuz–Eryaman koridorundan sabah ve akşam pikinde çekilen otomobil: yaklaşık **{n0(cars_removed_corridor)} araç** (her yönde). KGM 2024 verisine göre Ankara–Sincan–Yenikent kesimlerinde günlük 100 binin üzerinde araç var; bu tek başına koridoru çözmez, ama aynı modelin başka savunma firmalarına yayılmasıyla etki büyür.",
          f"- Önlenen otomobil yolculuğu: yılda yaklaşık {n0(car_km / 1e6 * 1000)} bin araç-km, {n0(co2_t)} ton CO2.",
          f"- İnşaat döneminde yıllık ortalama yaklaşık **{n0(jobs)} kişilik** şantiye istihdamı (TOKİ 2021 oranı: 36,5 milyar TL'de 70 bin kişi, maliyet artışıyla düzeltildi; varsayım). Yan sektörlerle daha fazla.",
          "",
          "## Değerlendirme",
          "",
          "- Ölçülebilen ulaşım faydaları tek başına kamu ve ortak kullanım payını geri ödemez: 30 yıllık bugünkü değer, kamu payının yaklaşık "
          f"%{ben[0] * pv_factor / pub[1] * 100:.0f}–{ben[2] * pv_factor / pub[1] * 100:.0f}'i kadar. Bu bir alt sınırdır; zaman tasarrufunun koridordaki diğer sürücülere etkisi, kaza ve bakım maliyetleri, sağlık ve eğitime erişim, belediye gelirleri ölçülmedi.",
          "- Asıl gerekçe stratejik: 12. Kalkınma Planı savunma sanayii istihdamını 2022'deki 81,1 binden 2028'de 158 bine çıkarmayı hedefliyor (Tablo 22). SSB Stratejik Planı 2024–2028 deneyimli personelin yurt dışına ya da başka sektörlere geçmesini resmi bir tehdit olarak yazıyor. Bu insanlar için yaşanabilir, eğitim ve sosyal olanakları olan bir yaşam alanı, istihdam hedefinin altyapısıdır. Bir mühendisin ayrılmasının işverene maliyeti (işe alma, yetiştirme, kayıp üretkenlik) bu hesaba katılmadı; kaynaklı veri bulunamadı.",
          ]
NOTE.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines))
