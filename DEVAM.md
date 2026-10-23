# Devam: Örencik yaşam alanı fizibilitesi

Son durum: 23 Ekim 2026. Bu dosya yeni bir oturumun işe kaldığı yerden devam edebilmesi için yazıldı. Önce bunu, sonra `İhtiyaçlar ve sunum brifi.md` ve `docs/onayli_plan.md` dosyalarını okuyun.

## 1. Proje bir paragrafta

Belen & Partners (mimarlık ofisi), Kahramankazan Örencik Mahallesi'ndeki 511.000 m²'lik (51,1 ha) Maliye Hazinesi arazisi için bir fizibilite raporu ve Cumhurbaşkanlığı Sarayı'na 20–30 dakikalık bir sunum hazırlıyor. Mesaj şu: "Bu araziye savunma ve havacılık sanayi çalışanları (öncelikle TUSAŞ mühendisleri) için okulu, sağlığı ve gölüyle bir yaşam alanı yapılabilir; avantajları şunlar." Arazi para ile alınmayacak; ne yapılacağına Saray karar verecek. TUSAŞ'a toplu satış yok. Konutlar satılık, herkese açık, savunma çalışanlarına öncelikli. Kimin yapıp satacağı tartışılmıyor.

## 2. Kararlar (23 Ekim 2026, proje ekibiyle)

- **Alan programı:** Yalnızca yaşam alanı: konut, okullar, yapay göl ve sosyal tesisler, mahalle ticareti. Çalışma alanı ya da teknopark yok.
- **Master plan:** Alan programı tablosu ve soyut, ölçekli bir bölgeleme şeması. Parsel sınırı elde olmadığı için şema haritaya oturtulmadı.
- **Finans:** Yatırım tutarı ve kamu faydası. Satış fiyatı, ödeme gücü, arazi edinim yolu ve arazi maliyet tavanı çıkarıldı.
- **Yapay göl:** Arazinin içinde, 2–3 ha. Su kaynağı yok; dolum suyu için öneri: yağmur suyu ile ileri arıtılmış atıksu, şebeke yalnızca acil durumda.
- **Sunum:** 20–30 dakika, 20–25 slayt.
- **Dil ve kurallar:**
  - Türkçe, çözüm odaklı.
  - "Harp Savunma" öne çıkarılmıyor.
  - TAI Ankara Lodgings ile TAI Kahramanmaraş Lodgings and Factory için "yaptık" denebiliyor.
  - Portföyün 74. sayfası (UPEM) kullanılmıyor.

**Bizim kararlarımız** (ayrıntısı `docs/onayli_plan.md` içinde):
- Sunumun talebi, arazinin bu amaçla değerlendirilmesi.
- "Yakınlık" en yakın nokta diye değil, aynı ilçe ve trafik koridorunun değişmesi diye anlatılıyor. Örencik TUSAŞ'a kuş uçuşu 19–22 km; Eryaman ve Yenikent daha yakın.
- Arazinin yaklaşık %20'si yamaç ve yarıntı olarak korunuyor.

## 3. Bitenler

| İş | Nerede |
|---|---|
| Yeni çerçeveyle 10 araştırma ve hesap notu | `research_notes/Örencik yaşam alanı fizibilitesi/01…10` |
| Politika uyumu (12. Kalkınma Planı, 2026 Yıllık Program, SSB Stratejik Planı) ve savunma kümesi | not 01 |
| Saha koşulları ve drone bulguları (yamaç, yarıntı, teraslı ağaçlandırma) | not 02 (bölüm 11) ve not 08 |
| Maliyet ve fayda parametreleri | not 03, 05, 06 |
| Dünya ve Türkiye örnekleri | not 04 ve 07 |
| Alan programı (2.000 / 2.500 / 3.000 konut senaryoları; önerilen 2.500 konut, yaklaşık 7.500 kişi) | not 09, `araclar/area_program.py` |
| Bölgeleme şeması | `reports/gorseller/bolgeleme_semasi.svg` ve `.png`, `araclar/schema.py` |
| Yatırım ve fayda hesabı | not 10, `araclar/invest.py` |
| Seçilmiş 6 drone karesi | `reports/gorseller/drone_01…06.jpg` |
| Yeni notların ek PDF'i (61 sayfa) | `reports/Örencik yaşam alanı fizibilitesi - Ek araştırma notları.pdf` |
| Yeni rapor için PDF betiği | `araclar/build_v2.py` |
| Sunum Artifact'i (oluşturuldu, slaytları yazılmadı) | https://claude.ai/artifact/WGozLrEFnFyK8DqfR9dYRW |

Ana rakamlar (not 09 ve 10):

| Gösterge | Değer |
|---|---|
| Önerilen senaryo | 2.500 konut, yaklaşık 7.500 kişi |
| Konut alanları | net 13,1 ha, emsal 2,29, brüt 49 konut/ha |
| Toplam yatırım (2026 TL, KDV ve arazi hariç) | yaklaşık 12,5 milyar TL (9,9–15,9) |
| Kamu ve ortak kullanım payı | yaklaşık 3,3 milyar TL (2,5–4,1) |
| Ölçülebilen ulaşım faydası | yılda 40–127 milyon TL; tek başına kamu payını ödemiyor, asıl gerekçe stratejik |
| Savunma sanayii istihdamı (12. Kalkınma Planı) | 2022'de 81,1 bin, 2028 hedefi 158 bin |
| Örencik–TUSAŞ Ekspres | 13 elektrikli otobüs; sabah pikinde Batıkent–Susuz–Eryaman koridorundan yaklaşık 560 otomobil çekilir |
| Sağlık | Kahramankazan'da "şehir hastanesi" yok. Kahramankazan Devlet Hastanesi 2022'de açıldı, yaklaşık 150 yatak (kaynaklarda 150 ile 190 arasında çelişki var). |

## 4. Yarım kalanlar ve sıradaki adımlar

1. **Raporu yazdır.** Rapor yazarı ajanı, `reports/Örencik yaşam alanı fizibilitesi.md` dosyasını yazmadan durduruldu. Aynı istem `docs/rapor_yazari_istemi.md` içinde; deep-research becerisinin rapor yazarı adımıyla yeniden çalıştırın. Araştırma turu bitti, yeni araştırma gerekmiyor.
2. **Raporu gözden geçir.**
   - Çıkarılması gereken terimleri ara: "2886", "taksit", "ödeme gücü", "toplu satış", "Harp", "şehir hastanesi".
   - Tablolar not 09 ve 10 ile aynı mı, kontrol et.
   - "Yaptık" dili ve roller doğru mu, kontrol et.
3. **PDF üret.** `python araclar/build_v2.py report` komutu `araclar/report_v2.html` dosyasını üretir. Sonra Chrome ile PDF'e çevir:
   `"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="<çıktı>.pdf" "file:///<tam yol>/report_v2.html"`
   Çıktıyı `reports/Örencik yaşam alanı fizibilitesi.pdf` olarak kaydet. Sayfaları `araclar/sheet.py` ile PNG'ye çevirip gözle kontrol et.
   Gerekli paketler: `pip install markdown pypdfium2 pillow`. Drone karesi çıkarmak için ayrıca `imageio-ffmpeg` gerekir.
4. **Sunumu doldur.** Artifact zaten var: https://claude.ai/artifact/WGozLrEFnFyK8DqfR9dYRW. Bu bir "Slides" tipi; yeni deste açmayın. Önerilen 24 slayt:
   1. Kapak (drone_05)
   2. Tek cümlelik mesaj ve 5 gösterge
   3. Neden şimdi: istihdam hedefi 81 binden 158 bine; SSB'nin yetenek kaybı tehdidi
   4. Konum ve uzaklıklar
   5. Neden Örencik: A/B/C karşılaştırması
   6. Saha: drone fotoğrafları
   7. Saha analizi: bulgu, anlamı, sonraki adım
   8. Politika uyum matrisi
   9. Alan programı
   10. Bölgeleme şeması
   11. Eğitim
   12. Eğitimde dünya örnekleri
   13. Sağlık
   14. Sosyal yaşam ve yapay göl
   15. Göl ve park örnekleri (Reston Lake Anne, Columbia, Göksu Parkı, Bishan)
   16. Ulaşım
   17. Akıllı şehir ve veri güvenliği
   18. Savunma sanayi için faydalar
   19. Yatırım
   20. Kamu faydası
   21. Etaplama ve takvim
   22. Referanslarımız
   23. Riskler
   24. Karar talebi ve sonraki adımlar

   Önerilen yazı tipleri: Source Serif 4 (başlık) ve IBM Plex Sans (metin). Önerilen renkler: lacivert #0B2E4F, açık zemin #F6F4EE, vurgu #9A5418. Görseller asset olarak yüklenmeli (`reports/gorseller/`).
5. **Kayıt.** `İhtiyaçlar ve sunum brifi.md` yeni çerçeveye göre güncellenmedi; hâlâ eski "geliştirici satış" sorularını içeriyor. Bölüm 1, 4, 7 ve 8 güncellenmeli.

## 5. Proje ekibinden beklenen teyitler

- Parsel ada/parsel numarası, sınırı ve sayısal halihazır harita (şema bunlarla haritaya oturtulacak).
- Yamaçlardaki teraslı ağaçlandırmanın hukuki statüsü (6831 sayılı Kanun; Orman İşletme Müdürlüğü ve Milli Emlak kayıtları). Bu en kritik teyit, çünkü yapılaşabilir alanı değiştirir.
- Zemin etüdü ve jeoteknik rapor (olası jipsli ya da marnlı zemin).
- İmar durumu ve üst ölçekli plan kararı; ASKİ, Başkent EDAŞ ve Başkentgaz kapasite görüşleri.
- Hastanenin adı ve kapasitesi; özel okulların sayısı ve kademeleri.
- TUSAŞ çalışanlarına ön talep anketi.
- Sunumun süresi ve dinleyicisi kesinleştiyse slayt sayısı.

## 6. Dikkat

- **Büyük dosyalar repoya konmadı:** `Belen&Partners.pdf` (363 MB) ve `Örencik Mahallesi.MP4` (1,5 GB) GitHub'ın 100 MB dosya sınırını aşıyor. Bu dosyalar yerel klasörde duruyor.
- **Portföyün ilgili sayfaları repoda:** `docs/portfoy/Belen_Partners_ilgili_sayfalar.pdf` (12 sayfa, 30 MB). Kaynak PDF'teki sayfa karşılıkları: 1 kapak; 3 hakkımızda; 10–12 GIA (Niğde); 15–16 Serapınar; 32 TAI Ankara Lodgings (2022, 400.000 m², 1.500 konut); 51 Kahramankazan Kentsel Dönüşüm (523.000 m²); 52 Kahramankazan Kent Merkezi (412.175 m²); 80–81 referans listesi (TAI Kahramanmaraş Lodgings and Factory burada geçiyor). 74. sayfa (UPEM) bilerek dahil edilmedi.
- **Gizlilik:** Raporlar taslaktır. Savunma tesisleriyle ilgili yalnızca kamuya açık ve genel bilgi kullanıldı. Portföyün 74. sayfası dışarı verilmez.
- **Eski çıktılar:** `reports/Kahramankazan TUSAŞ çalışan yerleşimi.md` ve PDF'i eski çerçevededir; yalnızca arka plan olarak kullanılmalı.
