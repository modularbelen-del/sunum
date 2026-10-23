# Devam: Kahramankazan Uydukent fizibilitesi

Son durum: 23 Ekim 2026. Bu dosya, yeni bir oturumun işe kaldığı yerden devam edebilmesi için yazıldı. Önce bunu, sonra `İhtiyaçlar ve sunum brifi.md` ve `docs/onayli_plan.md` dosyalarını okuyun. Proje becerileri `.claude/skills/` altındadır: `beyin-firtinasi`, `sunum-uret`, `rapor-pdf`.

## 1. Proje bir paragrafta

Belen & Partners (mimarlık ofisi), Kahramankazan Sarıayak Mahallesi'ndeki 511.000 m²'lik (51,1 ha) Maliye Hazinesi arazisi için bir fizibilite raporu ve Cumhurbaşkanlığı'na bir sunum hazırlıyor. Projenin adı **Kahramankazan Uydukent**.

Önerilen yaşam alanı savunma ve havacılık sanayi çalışanlarına öncelikli ve herkese açık; okulu, sağlığı ve gölüyle kurgulanıyor. Proje, proje ekibinin "Kahramankazan 2030 Savunma Sanayii Ekosistemi" vizyonunun yaşam alanı bileşeni.

Arazi para ile alınmayacak; ne yapılacağına Saray karar verecek. Konutlar satılık, herkese açık ve savunma çalışanlarına öncelikli. Kimin yapıp satacağı tartışılmıyor.

## 2. Kararlar (23 Ekim 2026, proje ekibiyle)

- **Yer ve ad:** Arazi Sarıayak'ta (önceden Örencik varsayılmıştı). Ad: Kahramankazan Uydukent. Drone görüntüleri bölgeyi gösteriyor.
- **Ekosistem:** 35,6 milyon m² ve 100–200 bin kişi ekosistemin tamamına, diğer projelerle birliktedir. Görseller: `resim (23).png` ve `resim (24).png`; kopyaları `reports/gorseller/ekosistem_*.jpg`.
- **Mesafeler:** Sarıayak–Kahramankazan merkezi 8 km; Sarıayak–Kınık 11 km; Kınık–Kışla (HAB) 8 km; Kahramankazan–Kışla 16 km. Uydukent'ten HAB'a Kınık üzerinden ~19 km (hesap).
- **Adlandırma:** Varış noktaları genel adlarla yazılır (HAB / Kışla, Kınık sanayi alanları). TUSAŞ yalnızca kaynak, resmi ad veya referans proje adında geçer.
- **Okul:** Özel okul yalnızca nitelikli eğitim odaklı; havacılık lisesi yok.
- **Alan programı:** Yalnızca yaşam alanı; çalışma alanı ya da teknopark yok. Önerilen senaryo 2.500 konut, ~7.500 kişi. Arazinin ~%20'si korunan yamaç.
- **Finans:** Yatırım tutarı ve kamu faydası. Satış fiyatı, ödeme gücü, arazi edinim yolu ve arazi maliyet tavanı çıkarıldı.
- **Yapay göl:** Arazinin içinde 2,5 ha. Dolum yağmur suyu ve ileri arıtılmış atıksuyla yapılacak; şebeke yalnızca acil durumda.
- **Sunum:** Slayt sınırı yok; dolu, görselli ve resmi dilli. "Taslak" yazılmaz.
- **Rapor:** Ek notların içeriği rapora birleştirilir. Dünya örneklerine geniş yer verilir.
- **Dil:** Türkçe, resmi ve çözüm odaklı. "Harp Savunma" kullanılmaz. TAI Ankara Lodgings ve TAI Kahramanmaraş Lodgings and Factory için "yaptık" denebilir. Portföyün 74. sayfası (UPEM) kullanılmaz.

## 3. Bitenler

| İş | Nerede |
|---|---|
| Sunum (67 slayt, PPTX ve PDF) | `reports/Kahramankazan Uydukent sunumu.pptx` ve `.pdf` |
| Sunum betiği ve içerik dosyası | `araclar/sunum/build.js`, `gorseller.py`, `icerik.json` (notlardan 28 slayt, 39 dünya örneği) |
| Kavramsal 3B görseller (5) | `reports/gorseller/kavram_*.jpg`; üretim `araclar/gorsel3b/` |
| Bölgeleme şeması (Uydukent etiketli) | `reports/gorseller/bolgeleme_semasi.svg` ve `.png`, `araclar/schema.py` |
| Rapor (md ve PDF) | `reports/Kahramankazan Uydukent fizibilitesi.md` ve `.pdf` |
| Ek araştırma notları PDF'i (başlıklar Sarıayak) | `reports/Kahramankazan Uydukent fizibilitesi - Ek araştırma notları.pdf` |
| Proje becerileri | `.claude/skills/beyin-firtinasi`, `sunum-uret`, `rapor-pdf` |
| Eski çerçevedeki PDF'ler | `reports/arsiv/` |

**Ana rakamlar** (notlar 09 ve 10):

| Gösterge | Değer |
|---|---|
| Önerilen senaryo | 2.500 konut, yaklaşık 7.500 kişi |
| Konut alanları | net 13,1 ha, emsal 2,29, brüt 49 konut/ha |
| Toplam yatırım (2026 TL, KDV ve arazi hariç) | yaklaşık 12,54 milyar TL (9,93–15,94) |
| Kamu ve ortak kullanım payı | yaklaşık 3,29 milyar TL (2,54–4,11) |
| Ölçülebilen ulaşım faydası | yılda 40–127 milyon TL; tek başına kamu payını karşılamıyor, asıl gerekçe stratejik |
| Uydukent Ekspres | 13 elektrikli otobüs; sabah zirvesinde ~875 yolcu, ~560 otomobil koridordan çekilir |

## 4. Sıradaki adımlar

1. **Rapor birleştirmesi:** Notların rapora işlenmesi, dünya örnekleri bölümünün genişletilmesi, ulaşım projeleri tablosu, resmi dil ve "Taslak" kaldırma işleri bir ajanla yürütülüyordu. Bitince `rapor-pdf` becerisindeki denetimler yapılır ve PDF yeniden üretilir.
2. **Kamu faydası hesabı:** İlk hesap tek yön 25 km varsayıyor. Sarıayak için ~19 km ile yeniden hesaplanıp hesaplanmayacağı proje ekibine sorulacak.
3. **Teyitler:** Brifin 7. bölümündeki teyitler (parsel, 6831 statüsü, zemin, imar, mesafe türü, ekosistem kaynağı vb.).

## 5. Üretim komutları (kısa)

```
python araclar/sunum/gorseller.py
NODE_PATH=araclar/sunum/node_modules PPTX_SKILL=<pptx becerisi> node araclar/sunum/build.js "reports/Kahramankazan Uydukent sunumu.pptx"
python araclar/build_v2.py report     # sonra Chrome ile PDF (bkz. rapor-pdf becerisi)
python araclar/gorsel3b/plan_export.py && (cd araclar/gorsel3b && npm install && node shoot.js cikti)
```

Ayrıntı becerilerin içinde.

## 6. Dikkat

- **Depo public:** Savunma bağlamındaki taslaklar nedeniyle private yapılması önerilir (Settings → General → Danger Zone → Change repository visibility).
- **Büyük dosyalar repoda yok:** `Belen&Partners.pdf` (363 MB) ve `Örencik Mahallesi.MP4` (1,5 GB) yerel klasörde. Portföyün ilgili sayfaları `docs/portfoy/Belen_Partners_ilgili_sayfalar.pdf` içinde; 74. sayfa bilerek dahil edilmedi.
- **Gizlilik:** Savunma tesisleriyle ilgili yalnızca kamuya açık ve genel bilgi kullanılır. Pist ekseni ve tesis ayrıntısı çizilmez.
- **Araştırma not klasörleri:** Adlarındaki "Örencik" tarihseldir; içerik Sarıayak'a uyarlanarak kullanılır.
