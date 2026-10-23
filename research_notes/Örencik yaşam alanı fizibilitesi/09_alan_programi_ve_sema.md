# Alan programı ve bölgeleme şeması (hesap)

Not: Tarih 2026-10-23. Bu not araştırma değil, koordinatörün hesabıdır. Betik: scratchpad `area_program.py`; şema: `reports/gorseller/bolgeleme_semasi.svg` ve `.png`.

## Varsayımlar

- Brüt alan 51,1 ha. Parsel sınırı yok; şema ölçekli ama sınır ve yön temsili.
- Hane büyüklüğü 3,0 kişi. Konut başına ortalama brüt inşaat alanı 120 m² (ortak alanlar dahil).
- Korunan yamaç ve yarıntılar 10 ha (drone tespiti; topoğrafik haritayla kesinleşecek).
- Yapay göl su yüzeyi 2,5 ha (proje ekibi: 2–3 ha, arazinin içinde), çevresinde 3,5 ha park.
- Spor kompleksi 1,0 ha; mahalle parkları ve çocuk bahçeleri 2 m²/kişi.
- Donatılar MPYY Ek-2'nin 75.001–150.000 kademesindeki kişi başı değerlerle hesaplandı (ihtiyatlı seçim): eğitim 6,5; sağlık 1,5; sosyal-kültürel 1,0; ibadet 0,5; teknik altyapı 1,25 m²/kişi. Kademe, ilçe projeksiyon nüfusuyla teyit edilmeli (Kahramankazan 2022'de 59.123 kişi; yeni yerleşimle birlikte 0–75.000 kademesinde kalabilir, o zaman bazı değerler düşer).
- Mahalle merkezi ve ticaret 1,2 ha; yollar, otopark, servis ve aktarma istasyonu brüt alanın %20'si.
- Öğrenci oranları (1.000 kişi başına; genç aile varsayımı): kreş ve anaokulu 45, ilkokul 60, ortaokul 55, lise 45.

## Senaryolar
| Gösterge | 2.000 konut | 2.500 konut | 3.000 konut |
|---|---:|---:|---:|
| Nüfus (kişi) | 6.000 | 7.500 | 9.000 |
| Net konut alanı (ha) | 15,0 | 13,1 | 11,2 |
| Konut inşaat alanı (m²) | 240.000 | 300.000 | 360.000 |
| Net konut adasında emsal | 1,60 | 2,29 | 3,21 |
| Net yoğunluk (konut/ha) | 133 | 191 | 268 |
| Brüt yoğunluk (konut/ha) | 39 | 49 | 59 |
| Kişi başı yeşil alan (m²) | 30,3 | 24,7 | 20,9 |

## Önerilen senaryo: 2.500 konut
| Kullanım | Alan (ha) | Pay (%) |
|---|---:|---:|
| Korunan yamaç ve yarıntılar (ağaçlandırma, yürüyüş) | 10,00 | 19,6 |
| Yapay göl (su yüzeyi) | 2,50 | 4,9 |
| Göl çevresi park | 3,50 | 6,8 |
| Spor kompleksi | 1,00 | 2,0 |
| Mahalle parkları ve çocuk bahçeleri | 1,50 | 2,9 |
| Eğitim (anaokulu, ilkokul, ortaokul, lise) | 4,88 | 9,5 |
| Sağlık (ASM, 112, poliklinik) | 1,12 | 2,2 |
| Sosyal ve kültürel tesisler | 0,75 | 1,5 |
| İbadet | 0,38 | 0,7 |
| Teknik altyapı (trafo, su deposu, atık, operasyon merkezi) | 0,94 | 1,8 |
| Mahalle merkezi ve ticaret | 1,20 | 2,3 |
| Yollar, otopark, servis ve aktarma istasyonu | 10,22 | 20,0 |
| Konut adaları (net) | 13,12 | 25,7 |
| **Toplam** | **51,10** | **100,0** |

## Öğrenci tahmini (önerilen senaryo)
| Kademe | Öğrenci |
|---|---:|
| Kreş ve anaokulu (3–5) | 338 |
| İlkokul (6–9) | 450 |
| Ortaokul (10–13) | 412 |
| Lise (14–17) | 338 |

## Okullar (önerilen senaryo için öneri)

Yaklaşık 1.540 öğrenci; derslik başına 30 öğrenci (anaokulunda 20) ile yaklaşık 57 derslik.

- **Devlet okul kampüsü (2,2 ha):** anaokulu, ilkokul ve ortaokul bir arada; yaklaşık 32 derslik.
- **Özel okul kampüsü (2,4 ha):** iki dilli anaokulundan liseye; yaklaşık 25 derslik. Lise kademesi STEM ve havacılık ağırlıklı.
- Kreş: konut adalarının zemin katlarında ve mahalle merkezinde.

## Şemadaki yerleşim mantığı

- Konut: dört mahalle (Kuzey, Batı, Doğu, Güney), platolarda ve manzaraya yönelik.
- Merkez: yapay göl ve göl parkı; kuzey kıyısında mahalle merkezi, kültür merkezi ve cami; doğuda ASM ve 112 istasyonu; güneyde spor kompleksi.
- Okullar: göl parkının batısında, iki kampüs; konutlara yürüme mesafesinde (en uzak konut yaklaşık 500 m).
- Ulaşım: güneybatı girişinde Örencik–TUSAŞ Ekspres ve Kahramankazan ring hattı için servis ve aktarma istasyonu; göl parkının çevresinde halka yol.
- Yeşil kuşak: korunan yamaçlar ve yarıntılar alanın çevresini sarıyor; ağaçlandırma korunuyor, yürüyüş parkurları ve seyir noktaları ekleniyor.

Şemadaki alanlar programla uyumlu: konut 13,9 ha, eğitim 4,6 ha, göl 2,4 ha, park 3,6 ha, mahalle merkezi 1,3 ha, sağlık 1,1 ha, spor 1,1 ha, teknik altyapı 1,0 ha.

## Karşılaştırma

- TAI Ankara Lodgings (Belen & Partners, 2022): 400.000 m², 1.500 konut; brüt yaklaşık 37,5 konut/ha. Önerilen Örencik senaryosu brüt 49 konut/ha.
- Göksu Parkı, Eryaman: 50,8 ha park, 12–14 ha gölet (07 numaralı not). Örencik'in tamamı kadar bir alan yalnızca park olarak kullanılıyor; Örencik'te göl 2,5 ha.
