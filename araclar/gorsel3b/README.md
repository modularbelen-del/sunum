# Kavramsal 3B görseller

Bölgeleme şemasındaki (araclar/schema.py) bölgelerden beyaz maket estetiğinde beş görsel üretir: `genel`, `gol`, `okul`, `konut`, `istasyon`. Görseller temsilidir; mimari tasarım değildir.

```
python araclar/gorsel3b/plan_export.py
cd araclar/gorsel3b && npm install
node shoot.js cikti genel gol okul konut istasyon --w=1600 --h=900 --dpr=2
```

`shoot.js` Playwright ve Chromium kullanır (PLAYWRIGHT ve CHROMIUM ortam değişkenleriyle yolları verilebilir). Çıktılar 2400 piksele küçültülüp `reports/gorseller/kavram_*.jpg` olarak kaydedilir.
