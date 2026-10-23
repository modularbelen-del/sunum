# Örencik yaşam alanı: kamu faydası parametreleri ve elektrikli ekspres otobüs maliyeti

Not: ~31 arama/çekme yapıldı. Türkiye'ye özgü resmi zaman değeri (KGM/UAB/SBB kılavuzu), KGM araç işletme gideri, Ankara araç doluluğu, Kazan yolu AADT'si ve 2025-26 elektrikli otobüs ihale birim fiyatı bulunamadı; bunlar Gaps altındadır ve uydurulmamıştır. "Inferences" satırları kaynaklı değil, hesap veya varsayımdır. Çözüm için gerekli girdiler başta "Hızlı parametre tablosu"nda toplandı. Dolaylı kaynaklı değerler (haber, arama özeti) ayrıca işaretlendi.

## 0. Hızlı parametre tablosu (benefit modeli girdileri)

| Parametre | Değer | Birim | Yıl | Kaynak durumu | Kullanım |
|---|---|---|---|---|---|
| Benzin Ankara | 84,90 (19 Eki) -> ~80,60 (20 Eki, 4,30 TL indirim) | TL/L | Eki 2026 | Dünya gazetesi; indirim için arama özeti | Yakıt tasarrufu parası |
| Motorin Ankara | 97,80 | TL/L | Eki 2026 | Dünya gazetesi | Dizel servis/otobüs yakıtı |
| LPG Ankara | 41,29 | TL/L | Eki 2026 | Dünya | - |
| Elektrik üretim EF | 0,438 tCO2/MWh (0,442 CO2e) | t/MWh | 2022 (yayın 06.12.2024) | ETKB EVÇED (birincil) | Elektrikli otobüs emisyonu |
| Tüketim noktası EF (iletim / dağıtım) | 0,442 / 0,474 tCO2/MWh (CO2e 0,445 / 0,478) | t/MWh | 2022 | ETKB EVÇED | Şarj deposu enerjisi için tercih edilen |
| Saatlik işgücü maliyeti | 248,1 | TL/saat (aylık 45.777) | 2024 | TÜİK, Habertürk aktarımı | Zaman değeri çıpası |
| Saatlik brüt ücret ortalaması | 55,4 | TL/saat (yıllık 144.390; yükseköğretim erkek 207.112, kadın 171.568) | 2022 | TÜİK Kazanç Yapısı 2022 (Alomaliye/Sanayi Gazetesi) | Eski çıpa, 2026'ya taşımak için |
| Saatlik kazanç endeksi artışı | +%35,0 (IV.Ç 2025/IV.Ç 2024) | % | 2025 | TÜİK, Karar | 2024->2025 güncelleme |
| Trafik zaman kaybı değeri | 0,94-12,44 | TL/dakika (56-746 TL/saat, kendi x60) | 2025 verisi, makale Tem 2026 | UAB dergisi çalışması (Takvim aktarımı, TomTom tabanlı) | Üst-alt sınır |
| EU ETS | 82,40 | EUR/tCO2 | 5 Eki 2026 | önceki notta (S&P Global) | CO2 parasallaştırma |
| EUR/TL (örtük) | ~53,7 | TL/EUR | 2026 | Takvim: 143,5 M EUR = 7,7 mlr TL (kendi hesabım) | Kur varsayımı; güncel kurla değiştirin |
| Elektrikli otobüs tüketimi 12 m | 1,15 (18 m: 1,63) | kWh/km | 2020, Hollanda | ViriCiti, Sustainable Bus | Enerji hesabı; soğukta +%14 |
| e-ATA 10 m birim fiyat | ~468 bin (17,8 M EUR / 38 adet, KDV hariç) | EUR/adet | Eki 2024 | Karsan KAP, DonanımHaber | Fiyat çıpası (10 m!) |
| 12 m e-otobüs (analist tahmini) | 593.600 (dizel eşdeğeri 212.800) | EUR | 2022 | İş Yatırım/Karsan analist raporu (arama özeti) | Eski üst çıpa |
| DC halka açık şarj | 12,99-16,50 | TL/kWh | Mart-2026 | Hesapkurdu, Araclo | Üst sınır enerji maliyeti |
| AC halka açık / ev şarjı | 8,50-9,99 / 2,60-3,90 | TL/kWh | 2026 | Araclo (arama özeti) | Alt sınır |
| Brüt asgari ücret | 26.005,50 | TL/ay | 2025 | ÇSGB bülteni (arama özeti) | İnşaat işçiliği karşılaştırması |
| İnşaat sektörü istihdamı | 1.903.511 (Haz, +%8,2 y/y); doğrudan ~1,8 milyon; yan sektörlerle >6 milyon | kişi | 2025 | TÜİK; İNDER; Çelikradar | İstihdam bağlamı |
| TOKİ | ~70 bin kişi doğrudan şantiye istihdamı (2021, 36,5 mlr TL yatırım) | kişi | 2021 | Para Dergi 23.02.2022 | Yatırım başına istihdam yedeği |

## 1. Zaman değeri (TL/saat, 2026)

### Takeaway
Türkiye için resmi KGM/UAB/SBB zaman değeri tablosuna ulaşılamadı. Kaynaklı en yakın veri UAB dergisinde yayımlanan TomTom tabanlı çalışmanın dakika değeri aralığı (0,94-12,44 TL/dk) ve TÜİK saatlik işgücü maliyeti; bunlardan ücret-temelli yöntemle ~200 TL/saat (2026, işe gidiş-geliş zamanı, kendi hesabım) önerilir, mühendis grubu için ~1,5-2x duyarlılık.

### Cited Findings
- UAB "Ulaştırma ve Altyapı Dergisi" çalışması: trafikte 1 dakikalık zaman kaybının parasal değeri 0,94-12,44 TL; yıllık ek maliyet 245,6 mlr TL (otomobil 163,6, ticari 82); 803 milyon L yakıt israfı; ~1,89 milyon t ek CO2 (143,5 M EUR); TomTom Traffic Index verisi; 112 saat/yıl hesabı İstanbul-Ankara-İzmir'de zirve saatte ~10 km gidiş-dönüş için; makale 22.07.2026; doğrudan doluluk varsayımı verilmemiş — [Takvim](https://www.takvim.com.tr/ekonomi/2026/07/22/trafikte-zaman-kaybi-cuzdanlari-yakiyor) (ikincil aktarım; birincil dergi makalesi görülmedi)
- 2024'te saatlik ortalama işgücü maliyeti 248,1 TL (aylık 45.777 TL); 2025 IV.Ç saatlik işgücü maliyeti endeksi %34,2, saatlik kazanç endeksi %35,0 y/y — [Habertürk](https://www.haberturk.com/abde-iscilik-maliyetleri-4-1-artti-3873770-ekonomi); [Karar](https://www.karar.com/guncel-haberler/tuik-son-verileri-acikladi-isgucu-girdi-endeksleri-2025-yilinin-2030758) (arama özeti)
- TÜİK Kazanç Yapısı 2022: saatlik ortalama brüt ücret-maaş 55,4 TL; yıllık ortalama brüt 144.390 TL; yükseköğretim erkek 207.112, kadın 171.568 TL; mühendise özgü rakam yok — [Alomaliye](https://www.alomaliye.com/2023/12/25/kazanc-yapisi-istatistikleri-2022/)
- İzmir metrosu hedonik çalışması: zamanın değeri ~1,47-1,83 USD/saat (yıl belirsiz, emlakçı anketine dayalı, zayıf) — [İYTE](https://openaccess.iyte.edu.tr:443/bitstream/11147/2193/1/2193.pdf) (arama özeti)
- KGM %15 iskonto oranı (2001, eski) — önceki notta.

### Inferences
- Ücret-temelli yöntem: 248,1 TL/sa (2024) x 1,345 (2025 kazanç endeksi artışı, kabaca) ≈ 334 TL/sa (2025); 2026 için ~%25-30 artışla ~420 TL/sa (varsayım). Bu işgücü maliyetidir (işveren primleri dahil); yolculuk zamanı (iş dışı) için yaygın uluslararası uygulama ücret oranının ~%50'si olduğundan ~200 TL/sa temel değer; mühendis/uzman için 300-400 TL/sa üst senaryo; UAB dergisi aralığının dakika değerinin orta-alt kısmı (3,3 TL/dk = 200 TL/sa) ile uyumlu. %50 kuralı bu çalışmada kaynaklanmadı (hesap varsayımı; sunumda belirtin).
- TUSAŞ mühendisi için saat değeri genel ortalamadan yüksek olacağından 200 TL/sa muhafazakâr kabul edilebilir.

### Gaps
- UAB/KGM/AYGM/SBB resmi zaman değeri, Dünya Bankası/EBRD/JICA/EIB Türkiye değerlendirmelerindeki zaman değeri (aramalar sonuç vermedi), TÜİK 2025 TL cinsinden ortalama ücret, mühendis saatlik ücreti: bulunamadı.

## 2. Araç işletme maliyeti ve yakıt (özel otomobil, 2026)

### Takeaway
Pompa fiyatları net (benzin ~80,6-84,9; motorin 97,8 TL/L, Ekim 2026). KGM resmi araç işletme gideri yok; tüketim için yeni filo ortalaması eski ve NEDC bazlı. Tam maliyet yaklaşımı yerine yalnızca yakıt + değişken bakım/lastik önerilir (kaçınılan km'ye bağlı kalemler).

### Cited Findings
- Ankara 19.10.2026: benzin 84,90; motorin 97,80; LPG 41,29 TL/L — [Dünya](https://www.dunya.com/enerji/akaryakit-fiyatlarinda-son-durum-benzin-motorin-ve-lpgye-zam-indirim-var-mi-19-ekim-2026-haberi-844370)
- 20.10.2026'dan itibaren benzine 4,30 TL indirim (Ankara ~80,60); 2 Ekim'de Ankara benzin 85,60, motorin 98,30; kaynaklar arasında fark var (9 Ekim Dünya'da motorin 91,30) — [Hisse.net / Motor1 arama özeti](https://tr.motor1.com/news/810575/akaryakit-fiyatlari-2-ekim-2026/)
- Yeni filo ortalaması 2012'de 5,5, 2013'te 5,3 L/100 km (NEDC) — [GFEI Türkiye](https://www.globalfueleconomy.org/media/461048/me-and-wa_turkey.pdf); Türkiye'de yeni araç CO2'si 2013'ten sonra AB ortalamasına yakın, zorunlu CO2 standardı yok (ICCT 2019) — [ICCT](https://theicct.org/wp-content/uploads/2021/06/Registration_Tax_-in_-Turkey_-TK_2019_05_17.pdf)
- Yıllık sahip olma maliyeti (15 bin km/yıl, 2026): Clio 88.907 TL/ay (kaynakta ay mı yıl mı karışık; haber başka yerde "yıllık ~90 bin TL" diyor, çelişki), Corolla Hybrid 112.340, Togg T10X 95.721; 2025'te yıllık ~70 bin TL — [Tamindir](https://www.tamindir.com/blog/bir-otomobilin-aylik-maliyeti_111301/); [CNN Türk](https://cnnturk.com/ekonomi/galeri/mtv-kasko-sigorta-yakit-bakim-iste-2025te-kontagi-cevirmenin-maliyeti-2219508) (arama özetleri; kaynak içi tutarsızlık nedeniyle km başı maliyet için kullanılmamalı)
- Bakım örneği: orta segment ilk bakım (20.000 km) >5 bin TL (Temmuz 2024) — [CNN Türk](https://cnnturk.com/otomobil/galeri/astari-yuzunden-pahali-arac-almak-bir-dert-bakimi-ayri-bir-dert-2135595)

### Inferences
- Gerçek yol tüketimi için 7,0 L/100 km (benzin, kentlerarası zirve) varsayımı; NEDC 5,5'in ~%25 üzeri (kaynaksız varsayım). Yakıt maliyeti ≈ 0,07 x 81 = ~5,7 TL/km. Değişken bakım+lastik için ek ~1,5-2,5 TL/km kaynaksız varsayımdır (doğrulayın). Toplam ~7-8 TL/km.

### Gaps
- KGM araç işletme gideri tabloları, Ankara'daki otomobil filosunda yakıt türü payı, tüketim için TÜİK/OSD güncel ortalaması: bulunamadı.

## 3. CO2 faktörleri

### Takeaway
Elektrik için resmi 2022 faktörü kaynaklı (0,438-0,474 t/MWh); 2023-24 faktörü bulunamadı. Yakıt faktörleri IPCC ile uyumlu (benzin ~2,3 kg/L, dizel ~2,7 kg/L); Türkiye filo g/km kaynağı yok.

### Cited Findings
- 2022 Türkiye üretim EF 0,438 tCO2/MWh (0,442 CO2e); iletimden bağlı tüketim noktası 0,442 (0,445); dağıtımdan bağlı 0,474 (0,478); IEA metodolojisi, TEİAŞ + ulusal envanter verisi, yayım 06.12.2024 — [ETKB EVÇED PDF](https://enerji.gov.tr//Media/Dizin/EVCED/tr/ÇevreVeİklim/İklimDeğişikliği/EmisyonFaktorleri/2022_Uretim_Tuketim_EF.pdf) (metin PDF'den çıkarıldı)
- 2020 üretim EF 0,417; linyit 1,177, taş kömürü 1,007 tCO2/MWh (2022) — aynı seri.
- 2021 şebeke marj: işletme marjı 0,7279, yapı marjı 0,3541 tCO2/MWh (CDM Tool 07; arama özeti; proje bazlı azaltım için, ortalama değil)
- ABD EPA: benzin 8,78, dizel 10,21 kg CO2/galon (≈2,32 ve 2,70 kg/L) — [EPA](https://www.epa.gov/system/files/documents/2022-04/ghg_emission_factors_hub.pdf); IPCC 2006 varsayılanı benzin 69,3, dizel 74,1 kg/GJ (arama özeti, doğrulanmalı)
- UAB dergisi çalışması: 803 milyon L yakıt = 1,89 milyon t CO2 → ~2,35 kg/L (kendi bölme; Takvim aktarımı)

### Inferences
- Otomobil: 7 L/100 km x 2,31 kg/L ≈ 162 g/km (benzin). Dizel 2,68 kg/L esas alınırsa 6 L/100 km ≈ 161 g/km. Fark yok; ~160 g/km kullanın.
- Elektrikli otobüs: 1,15 kWh/km x 0,474 t/MWh ≈ 0,55 kg/km (şarj deposu dağıtım hattı bağlantısı varsayımı; iletim hattı için 0,51). 2026 şebekesi 2022'den daha az karbonlu olabileceğinden muhafazakâr. Dizel otobüs için kaynak bulunamadı (kaba: 35-40 L/100 km x 2,68 ≈ 0,9-1,1 kg/km; kaynaksız mühendislik varsayımı).
- Servis otobüsü/ekspres hat yolcu başına: 0,55 kg/km / 40-50 yolcu ≈ 11-14 g/yolcu-km, otomobilin (162 g/km / 1,2-1,5 kişi = 108-135 g/kişi-km) yaklaşık 1/10'u.

### Gaps
- 2023-2025 Türkiye elektrik EF'si, TÜİK/Ulusal Envanter filo ortalama g/km, EEA Türkiye değeri, dizel otobüs g/km: bulunamadı.

## 4. Araç doluluğu ve servis payı

### Takeaway
Ankara'ya özgü işe gidiş otomobil doluluğu ve TUSAŞ servis payı için kaynak bulunamadı. Doluluk 1,2-1,4 kişi/araç duyarlılık aralığı olarak varsayılmalı (kaynaksız).

### Cited Findings
- Ankara'da 2018 sonu 2,8 kişiye bir araç (İstanbul 3,6) — [Habertürk/TÜİK](https://www.haberturk.com/turkiye-de-yaklasik-4-kisiye-bir-arac-dusuyor-2345497-ekonomi)
- ABB Sürdürülebilir Ulaşım Ana Planı çalışması ve 15 bin haneli ulaşım anketi başlıyor; sonuçlar henüz yok — mevcut 08 notu.
- 2015 AUAP'nın metni ve modal pay tablosu erişilemedi.
- TUSAŞ ve komşu firmaların ağırlıklı özel servisle taşıma yaptığı (pazarlama kaynağı, doğrulanmamış) — mevcut 02 notu.

### Inferences
- Faydayı iki koldan hesaplayın: (a) servis kullanan çalışan: otobüs-km azalması ve süre; (b) özel araç kullanan: araç-km, yakıt ve zirve araç azalması. Servis payı bilinmediğinden %40/%60 gibi senaryolar çalıştırın ve anket önerin (TUSAŞ İK).

### Gaps
- AUAP 2015 doluluk, EGO anketleri, TUSAŞ servis/özel araç payı: bulunamadı.

## 5. Trafik: Batıkent-Susuz-Eryaman -> Kazan koridoru

### Takeaway
Koridorun kesim bazlı AADT'si ve zirve sıkışıklık haberi bulunamadı. Yalnızca KGM 2024 genel Ankara rakamları var; zirve saat araç azalması için çalışan sayısı x özel araç payı / doluluk formülü kullanılmalı.

### Cited Findings
- KGM 2024 trafik hacmi (Bakan Uraloğlu, 18.07.2025): Esenboğa yolu bazı kesimlerde ~70 bin, Ankara-Gölbaşı ~80 bin, Ankara-Sincan-Yenikent bazı kesimlerde >100 bin, Ankara çevre yolu bazı kesimlerde ~110 bin araç (zaman bazı belirtilmemiş, muhtemelen günlük) — [Mynet](https://finans.mynet.com/haber/detay/ekonomi/bakan-uraloglu-tasit-hareketliligi-verilerini-degerlendirdi/508904/)
- Kızılcahamam-Kahramankazan-Ankara yolunda yol yapım kapamaları (25.03.2026 başlangıç; KGM 11.04.2026) — mevcut 02 notu.
- Ankara'da günlük ~2,5 saat zaman kaybı iddiası (Radyo Trafik, tartışmalı; yöntem yok) — [Hürriyet](https://www.hurriyet.com.tr/yerel-haberler/ankara/trafikte-gunluk-kaybimiz-2-5-saat-43034574) (arama özeti, kullanmayın)

### Inferences
- Zirve saat azalması = (Örencik'e taşınacak çalışan x aynı vardiya payı x özel araç payı) / doluluk x (zirve payı). Örnek: 3.000 çalışan, %60 otomobil, doluluk 1,3, tek vardiya zirvesi %60 -> ~830 araç/zirve saat/yön. 100 binlik AADT'ye göre ~%1 etki; yani ana fayda sıkışıklık değil süre/yakıt/CO2 ve servis filosu azalması olarak yazılmalı.

### Gaps
- D140/Kazan yolu AADT (KGM Trafik Hacim Haritası PDF/tabloları), Susuz-Saray-Kazan kapı sıkışıklığı haberleri, Eryaman/Batıkent çıkış sayımları: bulunamadı.

## 6. Elektrikli ekspres otobüs maliyeti

### Takeaway
Türkiye'de 12/18 m e-otobüs güncel TL ihale birim fiyatı bulunamadı; kaynaklı en yakın çıpa 10 m e-ATA için ~468 bin EUR (2024, KDV hariç) ve 12 m için 593,6 bin EUR (2022 analist tahmini). Şarj, depo ve işletme maliyeti kaynaklı yok; kWh tüketimi Hollanda verisi.

### Cited Findings
- Karsan-Botoşani (Romanya): 38 adet e-ATA 10, 17,8 M EUR (665,7 M TL) KDV hariç; teslimat 2025; şarj dahil olup olmadığı belirtilmemiş; yıl 2024 — [DonanımHaber](https://www.donanimhaber.com/karsan-dan-romanya-ya-665-milyon-tl-lik-elektrikli-otobus-satisi--182942)
- 2022 analist raporu: 12 m elektrikli belediye otobüsü 593.600 EUR (batarya dahil), dizel eşdeğeri 212.800 EUR; KDV belirsiz — [Karsan/İş Yatırım raporu](https://cdn.karsan.com/Delivery/Public/File/info-yatirimkarsan-analist-raporu23-05-2022-_9132193983_czlucahe74.pdf) (arama özeti)
- Karsan resmi sitesi fiyatı "talep üzerine" belirtiyor; e-ATA 12 m: 528 kWh'e kadar LFP, ~500-530 km menzil, 150 kW'a kadar kablolu şarj — [Karsan](https://www.karsan.com/en/electric-bus/e-ata-12)
- Mersin: 17 adet 12 m e-ATA teslim edildi (AB IPA II fonlu), bedel haberde yok — [Ticari Gazete](https://www.ticarigazetesi.com/9105.html)
- Karsan 2025: 330 M EUR ciro, 220 M EUR elektrikli; Bari 42 adet 18 m e-ATA (2026 teslim) — [Ekonomist](https://www.ekonomist.com.tr/otomotiv/karsan-dan-2025-yili-bilanco-degerlendirmesi-var-72513)
- ViriCiti (Hollanda, 2020): 79 adet 12 m ortalaması 1,15 kWh/km, 18 m 1,63 kWh/km; soğukta +%14, sıcakta +%9 — [Sustainable Bus](https://sustainable-bus.com/news/electric-bus-consumption-energy-report-viriciti); Fraunhofer 2026 ön baskı sabit 1,5 kWh/km planlama değerini eleştiriyor — [Trolleymotion](https://trolleymotion.eu/wp-content/uploads/2026/07/Empirical-Energy-Consumption-Estimation-and-Battery.pdf)
- Elektrik zammı 4 Nisan 2026: sanayi (OG) %5,8, AG ticarethane/kamu %17,5, mesken %25; mutlak TL/kWh bulunamadı — [Uzmanpara](https://uzmanpara.milliyet.com.tr/uzmanpara/elektrik-zammi-2026-nisanda-ne-kadar-oldu-elektrige-ne-kadar-zam-geldi-iste-yeni-tarife-7565631)
- Halka açık şarj fiyatı: DC 12,99-16,50 TL/kWh, AC 8,50-9,99, ev 2,60-3,90 (2026) — [Hesapkurdu](https://www.hesapkurdu.com/tasit-kredisi/rehber/elektrikli-arac-sarj-maliyeti-hesaplama-ve-fiyatlari); [Araclo](https://www.araclo.com/blog/elektrikli-arac-pazari-2026-ilk-yari-pay-artti-ama-satis-neden-dustu) (arama özetleri)
- EGO 2019-2026'da 534 yeni otobüs aldı, son alımlar dizel; 2026-27 alımlara devam — önceki not ve [24saat](https://www.24saatgazetesi.com/ego-filosuna-10-yeni-otobus-dahil-edildi)
- Eski/uygulanamaz: İzmir 20 adet e-otobüs + şarj 8,8 M TL (yıl belirsiz, eski), İETT 60 minibüs 378 M TL (2017).

### Inferences
- Taslak birim fiyat (12 m, KDV hariç): 480-600 bin EUR/adet (2024 10 m çıpası 468 bin; 12 m için +%10-25; 2022 tahmini 594 bin); 53,7 TL/EUR ile ~26-32 milyon TL/adet, KDV %20 ile 31-39 milyon TL. 18 m için ~1,4-1,6x (kaynaksız oran). Kullanmadan önce Karsan/Otokar/BMC/Temsa'dan teklif alınmalı.
- Yedek filo + yedek oranı %10-15 (kaynaksız); şarj: Karsan'ın belirttiği 150 kW'a kadar kablolu şarj esas alınabilir; depo şarj yatırımı için kaynaklı birim maliyet yok, geçici olarak filo bedelinin %10-15'i (kaynaksız varsayım) girilip teklifle değiştirilmelidir.
- Enerji maliyeti/km: 1,15-1,5 kWh/km x depo tarifesi (bilinmiyor; AC kamu 8,5-10, DC 13-16,5 TL/kWh aralığında üst sınır) -> 10-25 TL/km. Kıyas: dizel otobüs 35-40 L/100 km x 97,8 ≈ 34-39 TL/km (tüketim kaynaksız varsayım). Sürücü, bakım, sigorta, amortisman ayrı kalemler; kaynak bulunamadı.

### Gaps
- 2025-2026 Türkiye 12/18 m e-otobüs ihale birim fiyatları (EGO, İETT, Kocaeli, Konya, ESHOT, Mersin sözleşme bedeli), depo/şarj yatırımı, kWh/km Türkiye yol verisi, sürücü maliyeti, km başı işletme maliyeti, depo OG sanayi tarifesi TL/kWh: bulunamadı. EKAP/KAP ve belediye meclis kararları taranmalı.

## 7. İnşaat dönemi istihdamı

### Takeaway
Konut başına veya milyon TL başına resmi istihdam çarpanı bulunamadı. Kaynaklı bağlam: sektör ~1,9 milyon çalışan; TOKİ 2021'de 36,5 mlr TL yatırımla ~70 bin doğrudan istihdam (~1,9 kişi/milyon TL, 2021 fiyatıyla) – 2026 TL'ye doğrudan uygulanamaz.

### Cited Findings
- TÜİK: inşaatta çalışan sayısı Haziran'da (yıl 2025) yıllık %8,2 artışla 1.903.511 — [Capital](https://www.capital.com.tr/haberler/tum-haberler/insaat-sektoru-istihdami-rekor-serisini-sürdürüyor) (arama özeti); İNDER: doğrudan 1,8 milyon, GSYH payı %4,7 — [Sanayi Gazetesi](https://sanayigazetesi.com.tr/?p=223623); 250 yan sektörle >6 milyon — [Çelikradar](https://www.steelradar.com/insaatin-etkiledigi-250-sektorun-istihdami-6-milyonu-geciyor/)
- TOKİ 2021: ~36,5 mlr TL yatırım, 70 bin kişi istihdam — [Para Dergi](https://paradergi.com.tr/is-dunyasi-kulis/2022/02/23/toki-42-bin-yeni-konut-ihale-edecek)
- KONUTDER: bir projede eskiden 5 kişi çalışırken şimdi 7-8; ruhsatlı daire başına ücretli çalışan 2010-2024 arasında %60 arttı (arama özeti) — [Sanayi Gazetesi](https://sanayigazetesi.com.tr/?p=223623)
- TOKİ yetkilisi doğrudan+dolaylı 900 bin kişi (dönem belirsiz) — [TBMM tutanağı](https://tbmm.gov.tr/Tutanaklar/TutanakGoster/3005)
- Maliyet bağlamı: ÇŞİDB 2026 m² maliyetleri önceki notlarda.

### Inferences
- Yöntem: toplam inşaat maliyeti x işçilik payı (%25-35, kaynaksız varsayım) / (yıllık işçi maliyeti: brüt asgari ücret 26.005 TL x 12 x işveren primi ~1,2 + ek = ~375 bin TL; 2026 asgari ücret değeriyle değiştirin) = doğrudan kişi-yıl. Örn. 40 mlr TL x %30 / 0,5 milyon TL = ~24.000 kişi-yıl; 3 yıllık yapımda ~8.000 kişi (yüksek; yapı payı ve ücret doğrulanmalı). Bu çarpan 2021 TOKİ (1,9 kişi/milyon TL) ile karşılaştırıldığında 2026 TL'de ~0,6 kişi/milyon TL çıkar; enflasyonla uyumlu görünüyor.
- Dolaylı/indüklenmiş istihdam için resmi çarpan bulunamadığından yalnızca doğrudan istihdam raporlayın.

### Gaps
- TÜİK/ÇŞİDB/İNTES konut başına kişi-yıl, TMB/İNTES işçilik payı, Ankara'ya özgü veri, 2026 asgari ücret: bulunamadı.

## 8. Mühendis devir/değiştirme maliyeti (opsiyonel)

### Takeaway
Kaynak aranmadı (araç bütçesi sınırlıydı) ve bulunamadı. Fayda kalemi olarak dışarıda bırakın veya duyarlılık analizinde "ikame maliyeti = yıllık ücretin %X" olarak, açıkça varsayım diye işaretleyin.

### Gaps
- Savunma sanayisinde mühendis ayrılma/ikame maliyeti: aranmadı/bulunamadı.

## 9. Kısa hesap yöntemi (benefit chapter)

Girdiler: N_a = Örencik'e taşınacak çalışan sayısı; p_c = otomobil payı; ρ = doluluk (1,2-1,4); d = tek yön km kısalma (Batıkent/Eryaman->TUSAŞ ile Örencik->TUSAŞ farkı; mevcut 08 notunda EGO 556-1 hattı Sezenler-Kazan 38 km/45 dk; Örencik-TUSAŞ mesafesi bu notlarda bulunamadı); Δt = günlük süre kazancı (dk); D = 220 iş günü (varsayım); c = 7 L/100 km; f = fiyat; e = 2,31 kg/L; VOT = 200 TL/sa.

1. Süre kazancı (kişi): Δt/60 x D x VOT. Örn. Δt = 40 dk -> 147 saat/yıl -> ~29.300 TL/kişi-yıl (2026 TL). Toplam = N_a x bu.
2. Araç-km: N_a x p_c / ρ x 2d x D. Örn. d = 30 km: 13.200 km/yıl/araç.
3. Yakıt: araç-km x c = 924 L/yıl/araç x 80,6 TL/L ≈ 74.500 TL/araç-yıl (yalnızca benzin; dizel 97,8 TL/L).
4. CO2: 924 L x 2,31 kg = 2,13 t/araç-yıl; parasal: x 82,4 EUR x 53,7 TL/EUR ≈ 9.400 TL/araç-yıl (gölge fiyat; Türkiye ETS yolcu taşımacılığını kapsamıyor).
5. Elektrikli ekspres hat ek emisyonu: otobüs-km x 0,55 kg (şarj dağıtım EF 0,474); net CO2 = (2) x 0,162 kg/km - otobüs-km x 0,55.
6. Zirve araç azalması: N_a x p_c / ρ x (zirve vardiya payı).
7. İnşaat istihdamı: bölüm 7 yöntemi; yalnızca doğrudan.
8. Ortak çıktı: fayda akımını 15-20 yıl, iskonto %15 (KGM eski) ve duyarlılık %8-10; zaman değeri +/-%50, doluluk 1,2-1,4, d aralığı.

Örnek (1.000 otomobil kullanıcısı, bu varsayımlarla): 29,3 M TL zaman + 74,5 M TL yakıt + 9,4 M TL CO2 ≈ 113 M TL/yıl (2026 TL, kaba). Zaman değeri ve mesafe en hassas parametrelerdir.
