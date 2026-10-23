# Yatırım tutarı ve kamu faydası (hesap)

Not: Tarih 2026-10-23. Bu not koordinatörün hesabıdır; birim değerler 03, 05 ve 06 numaralı notlardan, 2026 yapı yaklaşık birim maliyetleri önceki fizibilite notlarından (03_arazi_hukuk_maliyet) alındı. Kaynağı olmayan her değer "varsayım" diye işaretli. Tutarlar 2026 TL, KDV hariç, arazi bedeli hariç (arazi Hazine'nin; satın alınmıyor). Önerilen senaryo: 2.500 konut, yaklaşık 7.500 kişi. Betik: scratchpad `invest.py`.

## Yatırım tablosu (milyon TL)

| Kalem | Düşük | Baz | Yüksek | Kamu ve ortak kullanım | Dayanak |
|---|---:|---:|---:|:---:|---|
| Konutlar | 6.315 | 7.935 | 10.170 | hayır | 300.000 m² × ÇŞİDB 2026 yaklaşık birim maliyeti (III-B 21.050 / IV-A 26.450 / IV-B 33.900 TL/m²) |
| Kentsel altyapı (yol, su, kanalizasyon, yağmur suyu, elektrik, doğalgaz, fiber) | 1.190 | 1.587 | 1.984 | evet | konut maliyetinin %15–25'i (duyarlılık aralığı; Türkiye'ye özgü TL/ha verisi bulunamadı) |
| Devlet okul kampüsü (yaklaşık 32 derslik) | 192 | 198 | 227 | evet | derslik başına 6,0–7,1 milyon TL (Gemlik 16 derslik 2026, Nazilli anaokulu 2025) |
| Özel okul kampüsü (yaklaşık 25 derslik) | 150 | 155 | 178 | hayır | aynı birim; özel okul yatırımcısı |
| ASM, 112 istasyonu ve poliklinik (yaklaşık 2.500 m²) | 53 | 66 | 85 | evet | 2.500 m² × ÇŞİDB 2026 birim maliyetleri |
| Kültür merkezi, kütüphane ve atölyeler (yaklaşık 3.000 m²) | 53 | 68 | 79 | evet | Bursa Yıldırım 2025 (≈17.800 TL/m²) 2026'ya %27 artışla |
| Spor kompleksi (spor salonu yaklaşık 3.000 m² ve açık sahalar) | 116 | 145 | 169 | evet | Aydın Efeler 2025 ≈30.400, Bursa 2024 ≈34.900 TL/m² (2026'ya taşındı); açık sahalar park birim maliyetiyle |
| Yapay göl (2,5 ha; kazı, geçirimsizlik, kenar, sirkülasyon ve arıtma, yağmur suyu toplama) | 55 | 110 | 165 | evet | metraj tahmini ≈4.400 TL/m² su yüzeyi, ±%50 (Türkiye'de gölet birim fiyatı bulunamadı) |
| Göl parkı ve mahalle parkları (5 ha) | 124 | 155 | 185 | evet | Kelkit Millet Bahçesi Aralık 2024 ≈2.480 TL/m², 2026'ya taşındı |
| Korunan yamaçlar: yürüyüş parkurları, seyir noktaları, ek ağaçlandırma (10 ha) | 20 | 30 | 45 | evet | hafif peyzaj varsayımı (kaynaksız) |
| Mahalle merkezi ve ticaret (yaklaşık 12.000 m²) | 253 | 317 | 407 | hayır | 12.000 m² × ÇŞİDB 2026 birim maliyetleri |
| Akıllı şehir sistemleri (fiber, akıllı sayaç, sensörler, platform, operasyon merkezi) | 100 | 150 | 225 | evet | konut başına 40–90 bin TL varsayımı (kaynaksız) |
| Örencik–TUSAŞ Ekspres: 13 elektrikli otobüs (12 m) ve şarj deposu | 385 | 452 | 524 | evet | 12 m e-otobüs 480–600 bin EUR (Karsan 2024 ihalesi, 2022 analist tahmini), depo için +%15–25, kur 53,7 |
| Servis ve aktarma istasyonu, duraklar | 20 | 30 | 45 | evet | varsayım (kaynaksız) |
| Ara toplam | 9.026 | 11.399 | 14.487 | | |
| Proje, etüt, müşavirlik ve beklenmeyen giderler (%10, varsayım) | 903 | 1.140 | 1.449 | | |
| **Toplam yatırım** | **9.929** | **12.539** | **15.936** | | |
| **Kamu ve ortak kullanım payı (%10 dahil)** | **2.540** | **3.291** | **4.106** | | |

- Toplam yatırım baz senaryoda yaklaşık **12,54 milyar TL** (aralık 9,93–15,94). Konut başına yaklaşık 5 milyon TL.
- Kamu ve ortak kullanım kalemleri (altyapı, devlet okulları, sağlık, kültür ve spor, göl ve parklar, akıllı şehir, ulaşım) yaklaşık **3,29 milyar TL** (aralık 2,54–4,11); toplamın %26'i.
- Konut, özel okul ve ticaret yatırımları satış ve işletme gelirleriyle karşılanan kalemlerdir. Kamu ve ortak kullanım kalemlerinin bir kısmı (site içi altyapı, göl ve parklar, akıllı şehir) uygulama modeline göre konut bedeline yüklenebilir; bu rapor uygulama modelini tartışmıyor.
- Cami yatırımı (yaklaşık 1.500 m²) genelde hayırsever ya da dernek eliyle yapıldığı için tabloya alınmadı.
- En büyük belirsizlikler: konutun yapı sınıfı (kat yüksekliğine göre III-B ile IV-B arası), altyapı oranı, zemin koşulları (drone: yarıntılı, olası jipsli zemin; jeoteknik etüt gerekir) ve 2026 sonrası maliyet artışı (TÜİK inşaat maliyet endeksi yıllık %25–30).

## Ekspres hattın boyutu

- Çalışan sakin: 2.500 hane × 1,4 çalışan = 3.500 kişi (varsayım). En az yarısı savunma ve havacılık kümesinde: **1.750 kişi** (ilk brif).
- Ekspres payı %50 ile sabah pikinde yaklaşık 875 yolcu; 12 m otobüs başına yaklaşık 85 yolcu, %15 yedekle **13 otobüs**.
- Elektrikli otobüs tüketimi 1,15 kWh/km (Hollanda verisi, soğukta +%14); işletme TUSAŞ servis sözleşmesi modeliyle.

## Yıllık kamu faydası (ölçülebilen kısım)

Varsayımlar: 220 iş günü; Batıkent–Susuz–Eryaman koridorundan gelen çalışanın Örencik–TUSAŞ Ekspres ile günde 20–50 dakika (baz 35) kazandığı; zaman değeri 200 TL/saat (yüksek senaryoda mühendis için 350); otomobil payı %40'tan %25'e iner; araç doluluğu 1,25; tek yön 25 km; 7 L/100 km; benzin 80,6 TL/L; 162 g CO2/km; karbon 82,4 EUR/t. Zaman değeri, doluluk ve otomobil payları kaynaksız varsayımdır (06 numaralı not).

| Fayda | Düşük | Baz | Yüksek |
|---|---:|---:|---:|
| Kazanılan zaman (milyon TL/yıl) | 26 | 45 | 112 |
| Yakıt tasarrufu (milyon TL/yıl) | 13 | 13 | 13 |
| Önlenen CO2 (milyon TL/yıl) | 1.7 | 1.7 | 1.7 |
| **Toplam (milyon TL/yıl)** | **40** | **60** | **127** |
| 30 yıllık bugünkü değer, reel %5 (milyar TL) | 0,62 | 0,92 | 1,95 |

- Batıkent–Susuz–Eryaman koridorundan sabah ve akşam pikinde çekilen otomobil: yaklaşık **560 araç** (her yönde). KGM 2024 verisine göre Ankara–Sincan–Yenikent kesimlerinde günlük 100 binin üzerinde araç var; bu tek başına koridoru çözmez, ama aynı modelin başka savunma firmalarına yayılmasıyla etki büyür.
- Önlenen otomobil yolculuğu: yılda yaklaşık 2.310 bin araç-km, 374 ton CO2.
- İnşaat döneminde yıllık ortalama yaklaşık **617 kişilik** şantiye istihdamı (TOKİ 2021 oranı: 36,5 milyar TL'de 70 bin kişi, maliyet artışıyla düzeltildi; varsayım). Yan sektörlerle daha fazla.

## Değerlendirme

- Ölçülebilen ulaşım faydaları tek başına kamu ve ortak kullanım payını geri ödemez: 30 yıllık bugünkü değer, kamu payının yaklaşık %19–59'i kadar. Bu bir alt sınırdır; zaman tasarrufunun koridordaki diğer sürücülere etkisi, kaza ve bakım maliyetleri, sağlık ve eğitime erişim, belediye gelirleri ölçülmedi.
- Asıl gerekçe stratejik: 12. Kalkınma Planı savunma sanayii istihdamını 2022'deki 81,1 binden 2028'de 158 bine çıkarmayı hedefliyor (Tablo 22). SSB Stratejik Planı 2024–2028 deneyimli personelin yurt dışına ya da başka sektörlere geçmesini resmi bir tehdit olarak yazıyor. Bu insanlar için yaşanabilir, eğitim ve sosyal olanakları olan bir yaşam alanı, istihdam hedefinin altyapısıdır. Bir mühendisin ayrılmasının işverene maliyeti (işe alma, yetiştirme, kayıp üretkenlik) bu hesaba katılmadı; kaynaklı veri bulunamadı.
