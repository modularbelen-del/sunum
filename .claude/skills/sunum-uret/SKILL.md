---
name: sunum-uret
description: Kahramankazan Uydukent PowerPoint sunumunu güncelleme ve yeniden üretme. Tasarım sistemi, resmi dil kuralları, içerik kuralları, slayt türleri, 3B kavram görselleri ve kontrol adımları burada. Sunumda slayt eklenmesi, metin değişikliği, görsel ya da PDF çıktısı istendiğinde kullanılır.
---

# Sunum üretimi (Kahramankazan Uydukent)

## Dosyalar

| Dosya | Görevi |
|---|---|
| `araclar/sunum/build.js` | Sunumun tamamı (pptxgenjs). Slayt metinleri ve konuşmacı notları burada. |
| `araclar/sunum/gorseller.py` | Drone, portföy, ekosistem ve 3B görselleri `araclar/sunum/assets/` altına hazırlar. |
| `araclar/sunum/icerik.json` | Notlardan çıkarılan ek slaytlar (`slides`) ve dünya örnekleri (`examples`). |
| `araclar/gorsel3b/` | Kavramsal 3B görseller (three.js); bkz. oradaki README. |
| `reports/Kahramankazan Uydukent sunumu.pptx` ve `.pdf` | Çıktılar. |

## Üretim

```
python araclar/sunum/gorseller.py
cd araclar/sunum && npm install && cd ../..
NODE_PATH=araclar/sunum/node_modules PPTX_SKILL=<pptx becerisi klasörü> node araclar/sunum/build.js "reports/Kahramankazan Uydukent sunumu.pptx"
```

PDF için LibreOffice kullanılır:

```
soffice --headless --convert-to pdf "reports/Kahramankazan Uydukent sunumu.pptx"
```

`PPTX_SKILL`, pptx becerisinin `scripts/apply_theme.js` dosyasını içeren klasördür. Tema renkleri bu betikle yazılır.

## Tasarım sistemi

- **Renkler:**
  - lacivert `0B2E4F` (başlıklar, koyu slaytlar)
  - açık zemin `F6F4EE`
  - vurgu toprak `9A5418`
  - buğday `D9A441`
  - göl mavisi `3E7CB1`
  - adaçayı `6B8F5E`
  - risk kırmızısı `B5453A`
- **Yazı tipleri:** başlık Cambria, metin Calibri. Office ile gelir; başka bilgisayarda bozulmaz.
- **Düzenler:**
  - `ICERIK`: açık zemin, içerik
  - `KOYU`: lacivert zemin, özet
  - `KAPAK`
  - `KARAR`: başlık sola, sağda fotoğraf
  - `FOTO`: tam sayfa görsel, sol altta başlık paneli
- **Motif:** ikonlar daire içinde, kartlar beyaz ve hafif gölgeli. Renk şeridi ve başlık altı çizgi kullanılmaz.
- **Boyutlar:** başlık 36 pt (44 karakteri aşarsa `headFit` 30 pt yapar); metin en az 13–14 pt; dipnot 11 pt.
- **Altlık:** "Belen & Partners · Kahramankazan Uydukent fizibilitesi · Ekim 2026". "Taslak" yazılmaz.

## Resmi dil kuralları

- Sunum Cumhurbaşkanlığına yapılır. Metinler resmi ve kişisiz Türkçeyle yazılır: "önerilmektedir", "öngörülmektedir", "hedeflenmektedir", "teyit edilecektir".
- Başlıklar isim tamlaması biçimindedir, nokta ile bitmez. Örnek: "Yatırım tutarı: yaklaşık 12,5 milyar TL".
- Gündelik ifade, soru cümlesi ve "biz" kullanılmaz. "Belen & Partners olarak" ve "yaptık" yalnızca Referanslar slaytında ve notunda geçer.
- Konuşmacı notları da resmidir, slayt başına 3–5 cümle.

## İçerik kuralları

- **Yer ve ad:** Sarıayak, Kahramankazan; proje adı Kahramankazan Uydukent. "Örencik" başlıklarda geçmez.
- **Ekosistem:** 35,6 milyon m² ve 100–200 bin kişi ekosistemin tamamına, diğer projelerle birliktedir. Uydukent'in kendi rakamları 51,1 ha, 2.500 konut, ~7.500 kişidir.
- **Mesafeler:** Sarıayak–Kahramankazan merkezi 8 km; Sarıayak–Kınık 11 km; Kınık–Kışla (HAB) 8 km; Uydukent→HAB yaklaşık 19 km (Kınık üzerinden).
- **Varış noktaları:** genel adlarla yazılır (HAB / Kışla, Kınık sanayi alanları). TUSAŞ yalnızca kaynak, resmi ad veya referans proje adında geçer.
- **Yasaklı içerik:**
  - arazi edinim yolları
  - satış fiyatı, ödeme planı, taksit
  - toplu satış
  - "Harp"
  - havacılık odaklı okul
  - askeri tesis ayrıntısı
- **Rakamlar:** Alan programı ve yatırım rakamları `research_notes/.../09` ve `10` notlarından birebir alınır. Teyitsiz rakamlar işaretlenir.
- **Görseller:** Kavram görselleri "temsilî; mimari tasarım değildir" notuyla verilir. Dünya örneklerinin fotoğrafları kullanılmaz (telif).

## Slayt türleri (build.js)

- `fotoSlide(bölüm, görsel, etiket, başlık, alt yazı, not)`: tam sayfa görsel
- `gridTable(s, başlıklar, satırlar, seçenekler)`: tablo
- `jsonSlides(anahtar, bölüm)`: `icerik.json` içindeki `slides` (madde, tablo, gösterge, iki sütun düzenleri)
- `examplesSlides(bölüm)`: dünya örnekleri, slayt başına 6 kart
- `stat`, `card`, `iconCircle`: gösterge kutusu, kart, ikon

## Kontrol (her değişiklikten sonra)

1. Pptx becerisinin `scripts/office/validate.py` betiğini çalıştır; "All validations PASSED" görülmeli.
2. PDF'e çevir, `pdftoppm -jpeg -r 80` ile slaytları görüntüye çevir ve değişen her slayta bak. Taşma, üst üste binme ve satır sonunda kopan sayı kalmamalı.
3. `markitdown` ile metni çıkar; "Örencik", "Taslak", "Harp", "taksit", "toplu satış" ve "STEM" aramaları boş dönmeli. "Örencik" yalnızca drone notunda geçebilir.
4. Sunumdaki rakamlar raporla aynı olmalı: konut, nüfus, yatırım, kamu payı, süre.
