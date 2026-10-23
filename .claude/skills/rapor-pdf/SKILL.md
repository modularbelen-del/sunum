---
name: rapor-pdf
description: Kahramankazan Uydukent fizibilite raporunu (reports/Kahramankazan Uydukent fizibilitesi.md) düzenleme, denetleme ve PDF olarak üretme. Rapora bölüm eklemek, metni resmileştirmek, notlardaki bilgiyi rapora işlemek, yasaklı terim ve rakam tutarlılığı denetimi yapmak veya PDF almak istendiğinde kullanılır.
---

# Rapor ve PDF (Kahramankazan Uydukent)

## Dosyalar

- `reports/Kahramankazan Uydukent fizibilitesi.md`: raporun kaynağı. Notların içeriği rapora işlenmiştir; ayrı ek notlar PDF'i yalnızca iç kullanım içindir.
- `research_notes/`: kaynak notlar. Klasör adlarında "Örencik" geçer; bu tarihsel bir addır, saha Sarıayak'tır.
- `araclar/build_v2.py`: Markdown'dan baskıya hazır HTML üretir; kapak, içindekiler, gösterge kutuları ve sayfa altlığı burada tanımlıdır.
- `reports/gorseller/`: rapordaki görseller (drone, bölgeleme şeması, ekosistem, kavram görselleri).

## PDF üretimi

```
pip install markdown pypdfium2 pillow
python araclar/build_v2.py report        # araclar/report_v2.html
chrome --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="reports/Kahramankazan Uydukent fizibilitesi.pdf" "file:///<tam yol>/araclar/report_v2.html"
```

Windows'ta Chrome yolu `C:/Program Files/Google/Chrome/Application/chrome.exe` olabilir. Linux bulut oturumunda `/opt/pw-browsers/chromium --no-sandbox` kullanılır.

Ek notlar PDF'i gerekiyorsa `python araclar/build_v2.py notes` çalıştırılır. Bu komut not başlıklarındaki "Örencik" adını "Sarıayak" yapar.

## Yazım kuralları

- Dil resmidir ve kişisiz anlatım kullanılır: "önerilmektedir", "öngörülmektedir", "bu çalışmada". "Biz" ve "yaptık" yalnızca "Referanslarımız" bölümünde geçer.
- Her sorun çözümüyle birlikte yazılır; sorun analizleri arka plana gider.
- Teyitsiz rakamlar "teyit edilecek", "varsayım" ya da "hesap" diye işaretlenir. Notlar çelişiyorsa bu kısaca belirtilir.
- GitHub uyumlu Markdown kullanılır: her liste ve tablodan önce boş satır olur, HTML kullanılmaz. Görseller ayrı paragrafta `![alt](gorseller/…)` biçimindedir ve ardından italik alt yazı gelir.
- "Taslak" yazılmaz.

## Denetim (her düzenlemeden sonra)

1. **Yasaklı terim taraması:**

   ```
   grep -n -E "2886|taksit|ödeme gücü|toplu satış|Harp|havacılık lisesi|STEM ve havacılık|Örencik–TUSAŞ|0,4 km|800–1.000|Taslak" "reports/Kahramankazan Uydukent fizibilitesi.md"
   ```

   "şehir hastanesi" en çok bir kez geçebilir; geçtiği yerde ekibin andığı tesisin Kahramankazan Devlet Hastanesi olduğu açıklanır.

2. **Örencik:** Başlıkta geçmez. Metinde yalnızca Ek B değişiklik kaydında ve Kaynakça'daki eski rapor ve not klasörü adlarında geçebilir.

3. **Rakam tutarlılığı:** 09 (alan programı) ve 10 (yatırım ve fayda) notlarındaki tablolar raporda birebir olmalı. İzin verilen tek fark Türkçe ondalık virgüldür.

4. **Kaynakça:** Metinde atıf yapılan her bağlantı Kaynakça'da bulunmalı.

5. **PDF kontrolü:** PDF'in sayfalarını pypdfium2 ile PNG'ye çevir. Tablolara, görsellere, gösterge kutularına ve sayfa numaralarına bak; sayfa sayısını not et.
