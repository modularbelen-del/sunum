# Kavramsal 3B görseller

Sunumdaki görseller `blender_sahne.py` ile Blender Cycles motorunda üretilir (fiziksel gökyüzü, yansımalar, yumuşak gölgeler). `scene.js` ve `shoot.js` daha hızlı ama daha basit bir three.js önizlemesidir.

```
# bpy modülü (Blender 4.2) Python 3.11 gerektirir
uv venv -p 3.11 blendenv && VIRTUAL_ENV=blendenv uv pip install bpy==4.2.0
python araclar/gorsel3b/plan_export.py
blendenv/bin/python araclar/gorsel3b/blender_sahne.py --shot genel --out genel.png --res 1920x1080 --samples 96
```

Sahneler: genel, gol, okul, konut, istasyon. Bir kare 4 çekirdekte yaklaşık 2–4 dakika sürer.

## three.js önizlemesi

Bölgeleme şemasındaki (araclar/schema.py) bölgelerden beyaz maket estetiğinde beş görsel üretir: `genel`, `gol`, `okul`, `konut`, `istasyon`. Görseller temsilidir; mimari tasarım değildir.

```
python araclar/gorsel3b/plan_export.py
cd araclar/gorsel3b && npm install
node shoot.js cikti genel gol okul konut istasyon --w=1600 --h=900 --dpr=2
```

`shoot.js` Playwright ve Chromium kullanır (PLAYWRIGHT ve CHROMIUM ortam değişkenleriyle yolları verilebilir). Çıktılar 2400 piksele küçültülüp `reports/gorseller/kavram_*.jpg` olarak kaydedilir.
