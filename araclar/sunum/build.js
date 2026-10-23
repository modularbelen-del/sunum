// Kahramankazan Uydukent sunumu (PowerPoint).
// Kullanım: python araclar/sunum/gorseller.py && NODE_PATH=araclar/sunum/node_modules PPTX_SKILL=<pptx becerisi> node araclar/sunum/build.js <çıktı.pptx>
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const OUT = process.argv[2] || "sunum.pptx";
const A = (f) => path.join(__dirname, "assets", f); // gorseller.py üretir

const HEX = {
  ink: "1B2430", navy: "0B2E4F", bg: "F6F4EE", white: "FFFFFF",
  ochre: "9A5418", lake: "3E7CB1", sage: "6B8F5E", wheat: "D9A441", slate: "5E6875", red: "B5453A",
  line: "DDD8CC", good: "E2ECDD", mid: "F7EBD3", bad: "F6DFDB", tint: "F3E6D3", navy2: "15406A",
};
const THEME = {
  name: "Uydukent",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.ink, lt1: HEX.white, dk2: HEX.navy, lt2: HEX.bg,
    accent1: HEX.ochre, accent2: HEX.lake, accent3: HEX.sage, accent4: HEX.wheat, accent5: HEX.slate, accent6: HEX.red,
    hlink: HEX.lake, folHlink: "6B5B95",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Belen & Partners";
pres.company = "Belen &amp; Partners";
pres.title = "Kahramankazan Uydukent fizibilitesi";
pres.subject = "Savunma ve havacılık sanayi çalışanları için akıllı bir yaşam alanı";
const C = pres.SchemeColor;

const W = 13.333, L = 0.6, CW = 12.133, TOP = 1.75;
const FOOT = "Belen & Partners · Kahramankazan Uydukent fizibilitesi · Ekim 2026";

// ---------- Layouts ----------
function kickerPh(color) {
  return { placeholder: { options: { name: "kicker", type: "body", x: L, y: 0.42, w: 9, h: 0.3, fontSize: 12, bold: true,
    color, margin: 0, charSpacing: 1.5, valign: "top" }, text: "" } };
}
function titlePh(color, w) {
  return { placeholder: { options: { name: "title", type: "title", x: L, y: 0.72, w: w || CW, h: 0.82, fontSize: 36, bold: true,
    color, margin: 0, valign: "top", align: "left" }, text: "" } };
}
pres.defineSlideMaster({
  title: "ICERIK",
  background: { color: C.background2 },
  objects: [
    kickerPh(C.accent1), titlePh(C.text2),
    { text: { text: FOOT, options: { x: L, y: 7.02, w: 9, h: 0.28, fontSize: 10, color: C.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 7.02, w: 0.5, h: 0.28, fontSize: 10, color: C.accent5, align: "right", margin: 0 },
});
pres.defineSlideMaster({
  title: "KOYU",
  background: { color: C.text2 },
  objects: [
    kickerPh(C.accent4), titlePh(C.background1),
    { text: { text: FOOT, options: { x: L, y: 7.02, w: 9, h: 0.28, fontSize: 10, color: C.background2, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 7.02, w: 0.5, h: 0.28, fontSize: 10, color: C.background2, align: "right", margin: 0 },
});
pres.defineSlideMaster({
  title: "KAPAK",
  background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: L, y: 2.35, w: 9.5, h: 1.2, fontSize: 54, bold: true,
      color: C.background1, margin: 0, valign: "bottom", align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: L, y: 3.7, w: 8.6, h: 1.0, fontSize: 22,
      color: C.background1, margin: 0, valign: "top", align: "left" }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "KARAR",
  background: { color: C.text2 },
  objects: [
    kickerPh(C.accent4), titlePh(C.background1, 7.6),
    { text: { text: FOOT, options: { x: L, y: 7.02, w: 7.6, h: 0.28, fontSize: 10, color: C.background2, margin: 0 } } },
  ],
});

// ---------- Helpers ----------
const iconCache = new Map();
async function icon(name, hex) {
  const key = name + hex;
  if (iconCache.has(key)) return iconCache.get(key);
  const Comp = fa[name];
  if (!Comp) throw new Error("ikon yok: " + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache.set(key, data);
  return data;
}
const shadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 1.5, angle: 90, opacity: 0.12 });

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || C.background1, transparency: opts.transparency || 0 },
    line: opts.line ? { color: opts.line, width: 1, dashType: opts.dash || "solid" } : { type: "none" },
    shadow: opts.noShadow ? undefined : shadow(), objectName: opts.name || "Kart",
  });
}
async function iconCircle(s, name, x, y, d, circle = C.text2, iconHex = HEX.white) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: circle }, line: { type: "none" }, objectName: "İkon zemini" });
  const p = d * 0.24;
  s.addImage({ data: await icon(name, iconHex), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, objectName: "İkon " + name });
}
function txt(s, text, o) {
  s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", fontSize: 14, color: C.text1 }, o));
}
function source(s, text, dark = false) {
  txt(s, text, { x: L, y: 6.6, w: CW, h: 0.3, fontSize: 11, italic: true, color: dark ? C.background2 : C.accent5, valign: "bottom" });
}
function head(s, kicker, title) {
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
}
function stat(s, x, y, w, h, value, label, o = {}) {
  card(s, x, y, w, h, { fill: o.fill, transparency: o.transparency, noShadow: o.noShadow, name: "Gösterge" });
  txt(s, value, { x: x + 0.2, y: y + 0.14, w: w - 0.4, h: h * 0.5, fontSize: o.vsize || 30, bold: true,
    fontFace: "Cambria", color: o.vcolor || C.text2, valign: "bottom", fit: "none" });
  txt(s, label, { x: x + 0.2, y: y + 0.16 + h * 0.5, w: w - 0.4, h: h * 0.5 - 0.26, fontSize: o.lsize || 13,
    color: o.lcolor || C.text1 });
}
function table(s, rows, o) {
  const hdr = (t, fill) => ({ text: t, options: { bold: true, color: HEX.white, fill: { color: fill || HEX.navy }, valign: "middle" } });
  const data = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return hdr(c, o.hdrFill && o.hdrFill[j]);
    if (typeof c === "object" && c !== null && c.text !== undefined) return c;
    return { text: c, options: { bold: j === 0 && o.boldFirst !== false, fill: { color: HEX.white } } };
  }));
  s.addTable(data, Object.assign({
    x: L, y: TOP, w: CW, fontSize: 14, color: HEX.ink, valign: "middle", margin: [0.06, 0.1, 0.06, 0.1],
    border: { type: "solid", pt: 0.75, color: HEX.line }, autoPage: false,
  }, o.table));
}
function bullets(items, o = {}) {
  return items.map((t, i) => ({ text: t, options: Object.assign({ bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 6 }, o) }));
}
function arrow(s, x, y, w, h, color = C.accent5, dash = "solid") {
  s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color, width: 2, endArrowType: "triangle", dashType: dash }, objectName: "Ok" });
}
const chartBase = (title) => ({
  showTitle: !!title, title, titleFontSize: 14, titleColor: HEX.ink, titleFontFace: "+mn-lt",
  catAxisLabelColor: HEX.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt",
  valAxisLabelColor: HEX.slate, valAxisLabelFontSize: 12, valAxisLabelFontFace: "+mn-lt",
  valGridLine: { color: HEX.line, size: 0.75 }, catGridLine: { style: "none" },
  showValue: true, dataLabelFontSize: 13, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt",
  catAxisLineShow: false, valAxisLineShow: false,
});

function slideOf(master, section) {
  return pres.addSlide({ masterName: master, sectionTitle: section });
}

// ---------- Slides ----------
async function build() {
  // ===== Giriş =====
  pres.addSection({ title: "Giriş" });
  {
    const s = slideOf("KAPAK", "Giriş");
    s.addImage({ path: A("kapak.jpg"), x: 0, y: 0, w: W, h: 7.5, objectName: "Kapak fotoğrafı: bölgeden ova manzarası" });
    s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 7.5, fill: { color: C.text2, transparency: 28 }, line: { type: "none" }, objectName: "Karartma" });
    txt(s, "FİZİBİLİTE SUNUMU", { x: L, y: 1.75, w: 8, h: 0.35, fontSize: 14, bold: true, color: C.accent4, charSpacing: 2 });
    s.addText("Kahramankazan Uydukent", { placeholder: "title" });
    s.addText("Savunma ve havacılık sanayi çalışanları için akıllı bir yaşam alanı", { placeholder: "subtitle" });
    txt(s, "Sarıayak, Kahramankazan · 511.000 m² Hazine arazisi", { x: L, y: 4.9, w: 8, h: 0.35, fontSize: 16, color: C.background2 });
    txt(s, "Belen & Partners · Ekim 2026", { x: L, y: 6.55, w: 8, h: 0.35, fontSize: 14, bold: true, color: C.background1 });
    s.addNotes("Açılış. Belen & Partners olarak Kahramankazan Sarıayak'taki 511 bin metrekarelik Hazine arazisi için hazırladığımız Kahramankazan Uydukent fizibilitesini sunuyoruz. Arka plandaki fotoğraf bölgeden Kahramankazan ovasına bakıyor; drone çekimi 22 Eylül 2026. Rakamların bir kısmı kurumlardan teyit bekliyor.");
  }
  {
    const s = slideOf("KOYU", "Giriş");
    head(s, "ÖZET", "Önerimiz bir cümlede");
    txt(s, "Sarıayak'taki 511 bin m²'lik Hazine arazisine, savunma ve havacılık sanayi çalışanları için okulu, sağlığı ve gölüyle, herkese açık bir yaşam alanı kurulabilir: Kahramankazan Uydukent.",
      { x: L, y: 1.85, w: 11.2, h: 1.5, fontSize: 26, italic: true, fontFace: "Cambria", color: C.background1 });
    const tiles = [
      ["51,1 ha", "Hazine arazisi; satın alma yok"],
      ["2.500", "konut (önerilen senaryo)"],
      ["~7.500", "kişi"],
      ["~12,5 mlr", "TL toplam yatırım (9,9–15,9)"],
      ["< 35 dk", "sanayi bölgelerine ekspresle (hedef)"],
    ];
    const tw = (CW - 4 * 0.25) / 5;
    tiles.forEach(([v, l], i) => stat(s, L + i * (tw + 0.25), 3.85, tw, 1.95, v, l,
      { fill: C.background1, transparency: 88, noShadow: true, vcolor: C.accent4, lcolor: C.background1, vsize: 28, lsize: 14 }));
    txt(s, "Konutlar satılık ve herkese açık; savunma sanayi çalışanlarına öncelikli. Tutarlar 2026 TL, KDV ve arazi hariç.",
      { x: L, y: 6.15, w: CW, h: 0.35, fontSize: 13, color: C.background2 });
    s.addNotes("Tek cümlelik mesaj bu. Arazi Hazine'nin; satın alınmıyor, ne yapılacağına Cumhurbaşkanlığı karar verecek. Önerilen senaryo 2.500 konut ve yaklaşık 7.500 kişi. Toplam yatırım baz senaryoda yaklaşık 12,5 milyar TL; aralık 9,9 ile 15,9 milyar TL. HAB ve Kınık sanayi alanlarına 35 dakikanın altı bir hedef; Uydukent Ekspres ile sağlanıyor.");
  }
  {
    const s = slideOf("ICERIK", "Giriş");
    head(s, "GİRİŞ · NEDEN ŞİMDİ", "Sektör büyüyor, insan kaynağı kritik");
    s.addChart(pres.charts.BAR, [{ name: "Savunma sanayii istihdamı", labels: ["2022", "2028 hedefi"], values: [81.1, 158] }],
      Object.assign(chartBase("Savunma sanayii istihdamı (bin kişi)"), {
        x: L, y: TOP, w: 5.3, h: 4.75, barDir: "col", chartColors: [HEX.navy], barGapWidthPct: 70,
        dataLabelPosition: "outEnd", dataLabelFormatCode: "General", valAxisHidden: true, valGridLine: { style: "none" },
        showLegend: false, valAxisMinVal: 0, valAxisMaxVal: 180, dataLabelFontSize: 18, catAxisLabelFontSize: 14,
      }));
    const rows = [
      ["FaChartLine", "Hedef: iki kat istihdam", "12. Kalkınma Planı, sektör istihdamını 2022'deki 81,1 binden 2028'de 158 bine çıkarmayı hedefliyor."],
      ["FaTriangleExclamation", "Resmi tehdit: yetenek kaybı", "SSB Stratejik Planı 2024–2028, deneyimli personelin yurt dışına ya da başka sektörlere geçmesini tehdit olarak yazıyor."],
      ["FaIndustry", "Kahramankazan kümesi", "Kümenin ana firmasında 13–17 bin çalışan (TUSAŞ, 2023–24 beyanları); HAB OSB'de 15 bin istihdam hedefi."],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = TOP + 0.05 + i * 1.6;
      await iconCircle(s, rows[i][0], 6.4, y, 0.7);
      txt(s, rows[i][1], { x: 7.3, y, w: 5.4, h: 0.4, fontSize: 18, bold: true, color: C.text2 });
      txt(s, rows[i][2], { x: 7.3, y: y + 0.45, w: 5.4, h: 0.95, fontSize: 15 });
    }
    source(s, "Kaynak: 12. Kalkınma Planı, Tablo 22; SSB Stratejik Planı 2024–2028, s. 46; TUSAŞ çalışan sayıları basın beyanlarından, teyit edilecek.");
    s.addNotes("Neden şimdi? Kalkınma Planı sektörün istihdamını altı yılda neredeyse ikiye katlamayı hedefliyor. Bu insanların yaşayacağı, çocuklarını okutacağı yer bir altyapı sorunu. SSB'nin kendi stratejik planı deneyimli personelin ayrılmasını resmi tehdit olarak tanımlıyor. TUSAŞ çalışan sayısı kaynağa göre 13 ile 17 bin arasında; 2026 için resmi rakam yok, teyit edilecek.");
  }

  {
    const s = slideOf("ICERIK", "Giriş");
    head(s, "GİRİŞ · EKOSİSTEM", "Kahramankazan 2030 ekosistemi");
    const iw = 7.55, ih = iw * 9 / 16;
    s.addImage({ path: A("ekosistem.jpg"), x: L, y: TOP, w: iw, h: ih, objectName: "Kahramankazan 2030 savunma sanayii ekosistemi" });
    const rx = L + iw + 0.35, rw = W - L - rx;
    const parts = [
      ["1", "C93BB8", "Kentsel Dönüşüm Bölgesi", "Kahramankazan merkezi"],
      ["2", "D9363E", "HAB Uzay Gelişim Alanı", "Kışla Bölgesi"],
      ["3", "2F7DE1", "Uydukent: bu çalışma", "Sarıayak Bölgesi · 51,1 ha"],
      ["4", "E8831F", "Kınık Özel Endüstri Sanayi Alanı", "Kınık Bölgesi"],
      ["5", "F0A040", "Hafif raylı ulaşım sistemi", "Kahramankazan–Kışla hattı"],
      ["+", "2AAFB8", "Tropik yaşam ve sağlık merkezi", "Soğucak Bölgesi"],
    ];
    parts.forEach(([n, col, t, d], i) => {
      const y = TOP + i * 0.6;
      if (n === "3") s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx - 0.1, y: y - 0.06, w: rw + 0.1, h: 0.6, rectRadius: 0.06, fill: { color: C.background1 }, line: { color: "2F7DE1", width: 1.25 }, objectName: "Bu çalışma" });
      s.addText(n, { shape: pres.shapes.OVAL, x: rx, y: y + 0.03, w: 0.42, h: 0.42, fill: { color: col }, color: HEX.white, fontSize: 14, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Bölge " + n });
      txt(s, [{ text: t, options: { bold: true, color: C.text2, fontSize: 14, breakLine: true } }, { text: d, options: { fontSize: 12, color: C.accent5 } }],
        { x: rx + 0.55, y: y - 0.03, w: rw - 0.6, h: 0.55, valign: "middle" });
    });
    stat(s, rx - 0.1, TOP + 3.7, rw + 0.1, 1.1, "35,6 mn m² · 100–200 bin kişi", "ekosistemin tamamı, diğer projelerle birlikte", { vsize: 18, lsize: 12 });
    source(s, "Kaynak: proje ekibinin ekosistem görseli (vizyon; teyit edilecek). Uydukent'in kendi programı: 51,1 ha, 2.500 konut, ~7.500 kişi.");
    s.addNotes("Uydukent tek başına bir proje değil; Kahramankazan için kurgulanan 2030 savunma sanayii ekosisteminin parçası. Ekosistemde ilçe merkezinin kentsel dönüşümü, Kışla'daki HAB uzay gelişim alanı, Kınık'taki özel endüstri sanayi alanı, Soğucak'taki tropik yaşam ve sağlık merkezi ve bunları bağlayan hafif raylı sistem var. Ekosistemin tamamı 35,6 milyon metrekare ve diğer projelerle birlikte 100 ile 200 bin kişilik bir kapasite. Uydukent bunun yaşam alanı ayağı: 51,1 hektar, 2.500 konut, yaklaşık 7.500 kişi. İlk brifteki 100 bin kişi rakamı da bu ekosistem ölçeğine karşılık geliyor.");
  }

  // ===== Yer ve saha =====
  pres.addSection({ title: "Yer ve saha" });
  {
    const s = slideOf("ICERIK", "Yer ve saha");
    head(s, "YER VE SAHA · KONUM", "Aynı ilçede, sıkışık koridorun dışında");
    const iw = 7.3, ih = iw * 1350 / 2400;
    s.addImage({ path: A("mesafeler.jpg"), x: L, y: TOP, w: iw, h: ih, objectName: "Bölge mesafeleri" });
    txt(s, "Proje ekibinin bölge görseli; ölçeksiz perspektif, mesafeler görseldeki değerlerdir.", { x: L, y: TOP + ih + 0.08, w: iw, h: 0.3, fontSize: 11, color: C.accent5 });
    const bx = L + iw + 0.35, bw = W - L - bx;
    txt(s, "Uydukent'ten uzaklık (km)", { x: bx, y: TOP, w: bw, h: 0.35, fontSize: 16, bold: true, color: C.text2 });
    const dist = [["Kahramankazan merkezi", 8, false], ["Kınık sanayi alanı", 11, false], ["HAB / Kışla, Kınık üzerinden", 19, true], ["HAB / Kışla, merkez üzerinden", 24, false]];
    const scale = 3.6 / 24;
    dist.forEach(([n, v, hi], i) => {
      const y = TOP + 0.45 + i * 0.6;
      txt(s, n, { x: bx, y, w: bw, h: 0.26, fontSize: 13, bold: hi, color: hi ? C.accent1 : C.text1 });
      s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + 0.29, w: v * scale, h: 0.2, fill: { color: hi ? C.accent1 : C.accent5 }, line: { type: "none" }, objectName: "Uzaklık çubuğu " + n });
      txt(s, String(v), { x: bx + v * scale + 0.08, y: y + 0.22, w: 0.6, h: 0.32, fontSize: 14, bold: true, valign: "middle", color: hi ? C.accent1 : C.text1 });
    });
    card(s, bx, TOP + 2.95, bw, 1.5, { fill: C.background1 });
    txt(s, [
      { text: "Yakınlık değil, koridor değişimi", options: { bold: true, color: C.text2, fontSize: 15, breakLine: true } },
      { text: "Eryaman'dan TUSAŞ'a kuş uçuşu 11,7 km, Yenikent'ten 9,1 km. Kazanç, yolculuğun Batıkent–Susuz kesiminden çıkıp ilçe içinde ekspresle gitmesi.", options: { fontSize: 13 } },
    ], { x: bx + 0.2, y: TOP + 3.07, w: bw - 0.4, h: 1.3, paraSpaceAfter: 4 });
    source(s, "19 ve 24 km, görseldeki iki bacağın toplamıdır (hesap). Kahramankazan–Kışla 16 km değeri, OSM'den hesaplanan 16,9 km ile uyumlu.");
    s.addNotes("Uydukent Sarıayak'ta, Kahramankazan merkezine 8 kilometre. Kınık sanayi alanına 11, Kınık üzerinden HAB ve Kışla bölgesine yaklaşık 19 kilometre. Sanayi bölgelerine en yakın nokta değil: Eryaman ve Yenikent TUSAŞ'a daha yakın, bunu açıkça söylüyoruz. Avantaj, Ankara'nın en sıkışık sabah koridoru olan Batıkent–Susuz kesimine hiç girmeden, ilçe içinden ekspres hatla gidilmesi. Mesafeler proje ekibinin bölge görselinden; yol mesafesi mi kuş uçuşu mu olduğu teyit edilecek.");
  }
  {
    const s = slideOf("ICERIK", "Yer ve saha");
    head(s, "YER VE SAHA · YER SEÇİMİ", "Alternatiflere göre Uydukent");
    const G = HEX.good, M = HEX.mid, B = HEX.bad;
    const c = (t, fill, bold) => ({ text: t, options: { fill: { color: fill }, bold: !!bold } });
    const rows = [
      ["Ölçüt", "(A) Bir şey yapmamak", "(B) HAB'a bitişik saha", "(C) Yenikent", "Uydukent (Sarıayak)"],
      ["Arazi", c("Yeni arazi yok", B), c("Belirsiz; askeri alan ve OSB ile iç içe", B), c("Belirsiz, kentsel parseller", M), c("511 bin m², tek malik Hazine", G, true)],
      ["Askeri kısıtlar", c("Etkilenmez", G), c("Yasak bölge içinde, yükseklik sınırı", B), c("Sınıra yakın olabilir", M), c("HAB'a ~19 km; yasak bölge dışında (teyit)", G, true)],
      ["Sabah piki", c("Sürer ve büyür", B), c("Azalır", G), c("Azalır", G), c("Azalır: yolculuk koridor değiştirir", G, true)],
      ["Sanayi bölgesine uzaklık", c("12–17 km", M), c("5 km'den az", G), c("~9 km", G), c("Kınık 11 km, HAB ~19 km", M, true)],
      ["Raylı erişim", c("Var", G), c("Yok", B), c("Var (Başkentray)", G), c("Planlanan hafif raylı sisteme bağlanır", M, true)],
      ["Kent hizmetleri", c("Tam", G), c("Sıfırdan kurulur", B), c("Sincan hizmetleri", G), c("İlçe merkezi 8 km", G, true)],
      ["Tesisin büyüme alanı", c("Korunur", G), c("Daralır", B), c("Kısmen etkilenir", M), c("Korunur", G, true)],
    ];
    table(s, rows, { hdrFill: [HEX.navy, HEX.navy, HEX.navy, HEX.navy, HEX.ochre],
      table: { colW: [2.1, 2.25, 2.75, 2.25, 2.783], rowH: 0.56, fontSize: 14 } });
    const ly = 6.38;
    [[G, "Avantaj"], [M, "Orta"], [B, "Zayıf nokta"]].forEach(([col, t], i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: L + i * 1.7, y: ly + 0.05, w: 0.22, h: 0.22, fill: { color: col }, line: { color: HEX.line, width: 0.75 }, objectName: "Gösterim" });
      txt(s, t, { x: L + 0.3 + i * 1.7, y: ly, w: 1.3, h: 0.32, fontSize: 12, valign: "middle" });
    });
    txt(s, "Uzaklığın yanıtı: Uydukent Ekspres ve planlanan hafif raylı sistem.", { x: 5.8, y: ly, w: 6.93, h: 0.32, fontSize: 13, bold: true, color: C.text2, valign: "middle", align: "right" });
    s.addNotes("Uydukent'i üç seçenekle karşılaştırdık: hiçbir şey yapmamak, HAB'ın hemen yanında bir saha ve Yenikent. Uydukent'in orta düzeyde iki noktası var: sanayi bölgelerine uzaklık ve raylı sistemin henüz olmaması; ikisini de ekspres hat ve ekosistemde planlanan hafif raylı sistemle karşılıyoruz. Güçlü yanları: tek malikli kamu arazisi, kamulaştırma yok; askeri yasak bölgenin ve uçuş yüzeylerinin dışında; konut stratejik tesisin etrafını sarmıyor, tesisin büyüme alanı korunuyor; ilçe merkezinin hizmetlerine yaslanıyor. B ve C için arazi mülkiyeti araştırılmadı.");
  }
  {
    const s = slideOf("ICERIK", "Yer ve saha");
    head(s, "YER VE SAHA · BÖLGEDEN GÖRÜNÜM", "Bölge: platolar ve yeşil yamaçlar");
    s.addImage({ path: A("saha_buyuk.jpg"), x: L, y: TOP, w: 7.35, h: 4.8, objectName: "Sarıayak bölgesinde köy ve plato" });
    s.addImage({ path: A("saha_sag1.jpg"), x: 8.15, y: TOP, w: 4.58, h: 2.3, objectName: "Yarıntı ve teraslı ağaçlandırma" });
    s.addImage({ path: A("saha_sag2.jpg"), x: 8.15, y: TOP + 2.5, w: 4.58, h: 2.3, objectName: "Yamaç terasları ve yollar" });
    const chip = (t, x, y, w) => s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x, y, w, h: 0.4,
      fill: { color: C.text2, transparency: 10 }, color: C.background1, fontSize: 13, bold: true, margin: [0, 0.12, 0, 0.12], valign: "middle", objectName: "Fotoğraf etiketi" });
    chip("Vadide köy yerleşimi, platoda tarlalar", L + 0.2, TOP + 4.2, 3.7);
    chip("Yarıntı ve teraslı çam ağaçlandırması", 8.35, TOP + 1.7, 3.4);
    chip("Yamaç terasları, enerji hattı ve yollar", 8.35, TOP + 4.2, 3.45);
    source(s, "Drone çekimi: 22 Eylül 2026, Sarıayak bölgesi, proje ekibi. Parsel sınırı işaretli değildir; topoğrafya halihazır haritayla teyit edilecek.");
    s.addNotes("Drone görüntüleri Sarıayak bölgesinin arazi tipini gösteriyor; parsel sınırı işaretli değil, topoğrafya halihazır haritayla teyit edilecek. Arazi düz değil. Tepe üstündeki buğday platoları yapılaşmaya uygun bölümler. Yamaçlarda erozyon yarıntıları ve eşyükselti teraslarına dikilmiş genç çamlar var; bu teraslı ağaçlandırmanın hukuki statüsü teyit edilecek. Vadilerde eski köy yerleşimleri var; yeni yaşam alanı mevcut köyle birlikte tasarlanmalı. Platolardan ovaya geniş bir manzara açılıyor; bu bir değer.");
  }
  {
    const s = slideOf("ICERIK", "Yer ve saha");
    head(s, "YER VE SAHA · SAHA ANALİZİ", "Saha bulguları ve sonraki adımlar");
    const rows = [
      ["Konu", "Bulgu", "Anlamı", "Sonraki adım"],
      ["Topoğrafya", "Bölgede platolar, dik yamaçlar, yarıntılar", "Konut platolara; alanın ~%20'si korunur", "Halihazır harita, eğim analizi"],
      ["Ağaçlandırma", "Bölge yamaçlarında teraslı çam dikimi", "Statü varsa yapılaşma dışında kalır", "6831 statüsü: Orman İşletme, Milli Emlak"],
      ["Zemin", "Olası jipsli, marnlı birimler (tahmin)", "Temel ve altyapı maliyetini etkiler", "Zemin etüdü ve jeoteknik rapor"],
      ["Plan durumu", "Ankara ÇDP 2020'de iptal; 2050 planı onaylanmadı", "İmar statüsü belirsiz", "İmar durumu yazısı (ABB, ÇŞİDB)"],
      ["Deprem", "Akademik çalışma: Kazan için 0,30–0,35 g bandı", "Ankara ortalamasının üzerinde olabilir", "AFAD sorgusu, TBDY 2018"],
      ["Altyapı", "Enerji hattı, stabilize yollar; kapasite verisi yok", "Hat güzergâhı yerleşimi etkiler", "ASKİ, Başkent EDAŞ, Başkentgaz görüşü"],
      ["Uçuş ekseni", "HAB'a ~19 km; pist ekseni ilişkisi hesaplanmadı", "Gürültü ve algı riski olabilir", "Parsel koordinatıyla MSB ve SHGM verisi"],
    ];
    table(s, rows, { table: { colW: [1.75, 3.9, 3.2, 3.283], rowH: 0.58, fontSize: 14 } });
    source(s, "Kaynak: bölgedeki drone tespitleri (22 Eylül 2026), ABB jeoloji raporu, akademik olasılıksal tehlike çalışması. Tümü Sarıayak parseli için teyit edilecek.");
    s.addNotes("Sahanın yedi başlığı. En kritik teyit, yamaçlardaki teraslı ağaçlandırmanın orman ya da ağaçlandırma statüsü; 6831 sayılı Kanun kapsamındaysa o alanlar yapılaşma dışında kalır. Programımız bu alanları zaten korunan yamaç olarak ayırıyor. Zemin için jeoteknik etüt şart. Ankara'nın üst ölçek planı iptal edildiği için imar durumu kurumlardan yazıyla istenmeli. Uydukent HAB ve Kışla bölgesine yaklaşık 19 kilometre; bu, askeri yasak bölgenin dışında kalmasını olası kılıyor. Pist ekseni ve gürültü ilişkisi parsel koordinatıyla yeniden hesaplanacak; okul ve sağlık tesisleri gerekirse eksenden uzak yerleştirilecek.");
  }
  {
    const s = slideOf("ICERIK", "Yer ve saha");
    head(s, "YER VE SAHA · POLİTİKA UYUMU", "Üst politika belgeleriyle uyum");
    const kp = { text: "12. Kalkınma Planı (2024–2028)", options: { rowspan: 5, bold: true, fill: { color: HEX.white }, valign: "middle" } };
    const rows = [
      ["Belge", "Madde ve hedef", "Uydukent'teki karşılığı"],
      [kp, "m. 520.3, Tablo 22: istihdam 81,1 → 158 bin", "Nitelikli personelin bölgede yerleşmesi"],
      ["m. 430", "Sanayi yatırım yeri ile yaşam alanı erişimi"],
      ["m. 850, 853.2, 857", "Akıllı, yeşil, dirençli, mahalle kültürlü yerleşim"],
      ["m. 884.2, 885", "Yerleşim ile toplu taşımanın birlikte planlanması"],
      ["m. 880.5, 881–882", "Sıfır atık, yağmur suyu hasadı (göl ve peyzaj)"],
      ["2026 Yıllık Program", "853.2, 885.4", "Akıllı şehir öğeleri; Akıllı Ulaşım Eylem Planı 2025–2030"],
      ["SSB Stratejik Planı 2024–2028", "H3.5; s. 46 tehdit tespiti", "Deneyimli personeli sektörde tutmak"],
      ["2030 Ulusal Akıllı Şehirler Stratejisi", "Veri yönetimi, dijital güvenlik", "Akıllı yaşam alanı ve veri güvenliği"],
    ];
    const data = rows.map((r, i) => {
      if (i === 0) return r.map((t) => ({ text: t, options: { bold: true, color: HEX.white, fill: { color: HEX.navy } } }));
      return r.map((t, j) => (typeof t === "object" ? t : { text: t, options: { fill: { color: HEX.white }, bold: (i >= 6 && j === 0) } }));
    });
    s.addTable(data, { x: L, y: TOP, w: CW, colW: [3.3, 4.0, 4.833], rowH: 0.5, fontSize: 14, color: HEX.ink, valign: "middle",
      margin: [0.05, 0.1, 0.05, 0.1], border: { type: "solid", pt: 0.75, color: HEX.line } });
    source(s, "Kaynak: 12. Kalkınma Planı; 2026 Cumhurbaşkanlığı Yıllık Programı; SSB Stratejik Planı 2024–2028. Akıllı şehirler stratejisindeki eylem numarası teyit edilecek.");
    s.addNotes("Proje beş belgeyle doğrudan örtüşüyor. En güçlü bağ, Kalkınma Planı'nın savunma sanayii istihdam hedefi ve SSB'nin insan kaynağı tehdidi. Yerleşim ile toplu taşımanın birlikte planlanması, akıllı ve yeşil yerleşim ve sıfır atık da plan maddeleri. Akıllı şehirler stratejisinin hangi eylemine karşılık geldiğini sunumdan önce teyit edeceğiz.");
  }

  // ===== Yaşam alanı =====
  pres.addSection({ title: "Yaşam alanı" });
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · ALAN PROGRAMI", "Önerilen program: 2.500 konut");
    const labels = ["Konut adaları (net)", "Yollar, otopark, aktarma", "Korunan yamaç ve yarıntılar", "Yapay göl ve göl parkı", "Eğitim", "Sağlık, sosyal, ibadet, teknik", "Spor ve mahalle parkları", "Mahalle merkezi ve ticaret"];
    const values = [13.1, 10.2, 10.0, 6.0, 4.9, 3.2, 2.5, 1.2];
    s.addChart(pres.charts.BAR, [{ name: "Alan (ha)", labels, values }], Object.assign(chartBase("Arazi kullanımı (ha; toplam 51,1)"), {
      x: L, y: TOP, w: 6.6, h: 4.8, barDir: "bar", chartColors: [HEX.sage], catAxisOrientation: "maxMin", barGapWidthPct: 45,
      dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0", valAxisHidden: true, valGridLine: { style: "none" }, showLegend: false,
      valAxisMaxVal: 15, catAxisLabelFontSize: 13,
    }));
    const tiles = [["13,1 ha", "net konut alanı"], ["2,29", "net emsal"], ["49", "konut/ha (brüt)"], ["24,7 m²", "kişi başı yeşil alan"]];
    tiles.forEach(([v, l], i) => stat(s, 7.55 + (i % 2) * 2.7, TOP + Math.floor(i / 2) * 1.35, 2.5, 1.18, v, l, { vsize: 26 }));
    const sc = [
      ["Senaryo", "2.000", "2.500", "3.000"],
      ["Nüfus", "6.000", "7.500", "9.000"],
      ["Net emsal", "1,60", "2,29", "3,21"],
      ["Kişi başı yeşil (m²)", "30,3", "24,7", "20,9"],
    ];
    const data = sc.map((r, i) => r.map((t, j) => ({ text: t, options: {
      bold: i === 0 || j === 0 || j === 2, align: j === 0 ? "left" : "right",
      color: i === 0 ? HEX.white : HEX.ink, fill: { color: i === 0 ? (j === 2 ? HEX.ochre : HEX.navy) : (j === 2 ? HEX.tint : HEX.white) } } })));
    s.addTable(data, { x: 7.55, y: TOP + 2.85, w: 5.18, colW: [2.18, 1.0, 1.0, 1.0], rowH: 0.42, fontSize: 14, valign: "middle",
      margin: [0.04, 0.1, 0.04, 0.1], border: { type: "solid", pt: 0.75, color: HEX.line } });
    source(s, "Varsayımlar: hane 3,0 kişi; konut başına 120 m² brüt inşaat; donatılar MPYY Ek-2. Karşılaştırma: TAI Ankara Lodgings brüt ~37,5 konut/ha.");
    s.addNotes("Üç senaryo hesapladık: 2.000, 2.500 ve 3.000 konut. Önerimiz 2.500 konut, yaklaşık 7.500 kişi. Arazinin yaklaşık beşte biri korunan yamaç; konut adaları net 13,1 hektar. Donatı alanları imar yönetmeliğinin Ek-2 standartlarıyla, ihtiyatlı kademeden hesaplandı. Brüt yoğunluk hektarda 49 konut; kendi projemiz TAI Ankara Lodgings'te bu değer 37,5.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · BÖLGELEME", "Göl merkezde, mahalleler platolarda");
    const ih = 4.85, iw = ih * 1500 / 922;
    card(s, L, TOP, iw, ih, { fill: C.background1 });
    s.addImage({ path: A("bolgeleme.png"), x: L, y: TOP, w: iw, h: ih, objectName: "Bölgeleme şeması" });
    const bx = L + iw + 0.35, bw = W - L - bx;
    const rows = [
      ["FaHouse", "Dört mahalle platolarda, manzaraya yönelik"],
      ["FaSchool", "İki okul kampüsü göl parkının batısında; en uzak konut ~500 m"],
      ["FaBus", "Ana girişte servis ve aktarma istasyonu"],
      ["FaTree", "Korunan yamaçlar yeşil kuşak: yürüyüş ve seyir noktaları"],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = TOP + 0.1 + i * 1.2;
      await iconCircle(s, rows[i][0], bx, y, 0.6);
      txt(s, rows[i][1], { x: bx + 0.75, y: y - 0.02, w: bw - 0.75, h: 1.05, fontSize: 15 });
    }
    source(s, "Şematiktir. Ölçeklidir; parsel sınırı ve yön temsilidir. Sınır ve topoğrafik harita gelince yeniden çizilecek.");
    s.addNotes("Bu şema ölçekli ama haritaya oturtulmadı, çünkü parsel sınırı elimizde değil. Mantık şu: yapay göl ve göl parkı merkezde. Kuzey kıyısında mahalle merkezi, kültür merkezi ve cami; doğuda aile sağlığı merkezi ve 112; güneyde spor kompleksi. Okullar batıda, konutlara yürüme mesafesinde. Dört mahalle platolarda. Yamaçlar ve yarıntılar alanı saran bir yeşil kuşak.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · EĞİTİM", "Eğitim: yürüme mesafesinde okul");
    stat(s, L, TOP, 2.25, 1.2, "~1.540", "öğrenci (tahmin)");
    stat(s, L + 2.45, TOP, 2.25, 1.2, "~57", "derslik");
    s.addChart(pres.charts.BAR, [{ name: "Öğrenci", labels: ["Kreş ve anaokulu", "İlkokul", "Ortaokul", "Lise"], values: [338, 450, 412, 338] }],
      Object.assign(chartBase("Kademelere göre öğrenci"), {
        x: L, y: TOP + 1.4, w: 4.7, h: 3.4, barDir: "col", chartColors: [HEX.lake], dataLabelPosition: "outEnd", dataLabelFormatCode: "General",
        valAxisHidden: true, valGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 520, catAxisLabelFontSize: 12,
      }));
    const cx = 5.65, cw = (W - L - cx - 0.3) / 2;
    const cards = [
      ["FaSchool", "Devlet okul kampüsü", "2,2 ha · ~32 derslik", "Anaokulu, ilkokul ve ortaokul bir arada; MEB normunda. Spor salonu ve kütüphane akşamları mahalleye açık."],
      ["FaUserGraduate", "Özel okul kampüsü", "2,4 ha · ~25 derslik", "İki dilli; anaokulundan liseye. Güçlü akademik program ve nitelikli öğretmen kadrosu."],
    ];
    for (let i = 0; i < cards.length; i++) {
      const x = cx + i * (cw + 0.3);
      card(s, x, TOP, cw, 2.7);
      await iconCircle(s, cards[i][0], x + 0.25, TOP + 0.25, 0.6);
      txt(s, cards[i][1], { x: x + 1.0, y: TOP + 0.25, w: cw - 1.2, h: 0.35, fontSize: 17, bold: true, color: C.text2 });
      txt(s, cards[i][2], { x: x + 1.0, y: TOP + 0.6, w: cw - 1.2, h: 0.3, fontSize: 13, bold: true, color: C.accent1 });
      txt(s, cards[i][3], { x: x + 0.25, y: TOP + 1.1, w: cw - 0.5, h: 1.5, fontSize: 15 });
    }
    card(s, cx, TOP + 2.95, W - L - cx, 1.85, { fill: C.background1 });
    txt(s, [
      { text: "Ayrıca: ", options: { bold: true, color: C.text2 } },
      { text: "kreşler zemin katlarda ve mahalle merkezinde; her okulda Deneyap ve makerspace atölyesi; ilçedeki meslek yüksekokuluyla staj ve sürekli eğitim.", options: { breakLine: true } },
      { text: "Kim ve ne zaman: ", options: { bold: true, color: C.text2 } },
      { text: "MEB, özel okul yatırımcıları, sanayi kuruluşları. İlk gün kreş ve modüler sınıflar." },
    ], { x: cx + 0.25, y: TOP + 3.12, w: W - L - cx - 0.5, h: 1.55, fontSize: 15, paraSpaceAfter: 8 });
    source(s, "1.000 kişi başına öğrenci (genç aile varsayımı): kreş-anaokulu 45, ilkokul 60, ortaokul 55, lise 45. Derslik başına 30 öğrenci (anaokulunda 20).");
    s.addNotes("Eğitim, ailelerin taşınma kararında birinci ölçüt. Genç aile varsayımıyla yaklaşık 1.540 öğrenci ve 57 derslik çıkıyor. Önerimiz iki kampüs: MEB normunda bir devlet okul kampüsü ve iki dilli, nitelikli bir özel okul kampüsü. Kalıcı binalar bitene kadar modüler sınıflar ilk gün hizmet verir.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · DÜNYADAN ÖRNEKLER", "Bunlar yapılıyor: işveren yakınında okul");
    const ex = [
      ["FaPlaneDeparture", "Toulouse, Fransa · 1999", "International School of Toulouse", "Airbus'ın talebiyle kuruldu; uluslararası mühendis aileleri için.", "Okul, mühendis ailesini çeken ilk unsur."],
      ["FaSchool", "Songdo, Kore · 2010", "Chadwick International", "260–280 öğrenciyle açıldı; bugün ~1.500 öğrenci.", "Okul talebi büyür; kampüs büyümeye göre planlanır."],
      ["FaBuildingColumns", "Wolfsburg, Almanya · 2009", "Neue Schule Wolfsburg", "Volkswagen okulu kurdu ve şehre bağışladı.", "İşveren katkısıyla nitelikli okul mümkün."],
      ["FaFlask", "Türkiye · 2022", "Deneyap atölyeleri", "50 atölye, 6.803 öğrenci.", "Teknoloji atölyesi her okula eklenebilir."],
    ];
    const cw = (CW - 3 * 0.3) / 4;
    for (let i = 0; i < ex.length; i++) {
      const x = L + i * (cw + 0.3), y = TOP;
      card(s, x, y, cw, 4.75);
      await iconCircle(s, ex[i][0], x + 0.25, y + 0.25, 0.62);
      txt(s, ex[i][1], { x: x + 0.25, y: y + 1.05, w: cw - 0.5, h: 0.3, fontSize: 13, bold: true, color: C.accent1 });
      txt(s, ex[i][2], { x: x + 0.25, y: y + 1.4, w: cw - 0.5, h: 0.75, fontSize: 17, bold: true, color: C.text2 });
      txt(s, ex[i][3], { x: x + 0.25, y: y + 2.2, w: cw - 0.5, h: 1.2, fontSize: 15 });
      txt(s, [{ text: "Uydukent için ders", options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } }, { text: ex[i][4], options: { fontSize: 15 } }],
        { x: x + 0.25, y: y + 3.45, w: cw - 0.5, h: 1.2 });
    }
    source(s, "Kaynak: araştırma notları 04 ve 07 (kurum ve basın kaynakları). Dünya örneklerinin fotoğrafları telif nedeniyle kullanılmadı.");
    s.addNotes("Dünyada büyük işverenlerin yanında okul kurmak yaygın. Toulouse'daki uluslararası okul Airbus'ın talebiyle açıldı. Songdo'daki Chadwick 260–280 öğrenciyle başladı, bugün yaklaşık 1.500 öğrencisi var: talep büyüyor, kampüs buna göre planlanmalı. Wolfsburg'da Volkswagen okulu kurup şehre bağışladı. Türkiye'de Deneyap atölyeleri okullara eklenebilecek hazır bir model.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · SAĞLIK", "Sağlık: birinci basamak yerleşimde");
    const tiers = [
      ["FaKitMedical", "Yerleşim içinde · ilk gün", "Aile sağlığı merkezi, 112 istasyonu ve poliklinik", "~2.500 m² bina, 1,12 ha alan; yürüme mesafesinde.", 7.2],
      ["FaHospital", "İlçede · ~8 km", "Kahramankazan Devlet Hastanesi", "2022'de açıldı; ~150 yatak (kaynaklarda 150–190). Ring hat ve randevuya bağlı servis.", 7.2],
      ["FaHeartPulse", "Ankara", "Üst basamak hastaneler", "Sevk zinciri ve tele-sağlık bağlantısı.", 7.2],
    ];
    for (let i = 0; i < tiers.length; i++) {
      const y = TOP + i * 1.62, w = tiers[i][4];
      card(s, L, y, w, 1.42, { fill: i === 0 ? C.background1 : C.background1 });
      await iconCircle(s, tiers[i][0], L + 0.25, y + 0.36, 0.7, i === 0 ? C.accent1 : C.text2);
      txt(s, tiers[i][1], { x: L + 1.15, y: y + 0.15, w: w - 1.35, h: 0.3, fontSize: 13, bold: true, color: C.accent1 });
      txt(s, tiers[i][2], { x: L + 1.15, y: y + 0.45, w: w - 1.35, h: 0.35, fontSize: 17, bold: true, color: C.text2 });
      txt(s, tiers[i][3], { x: L + 1.15, y: y + 0.82, w: w - 1.35, h: 0.55, fontSize: 14 });
    }
    const rx = 8.25, rw = W - L - rx;
    txt(s, "Dünyadan dersler", { x: rx, y: TOP, w: rw, h: 0.35, fontSize: 17, bold: true, color: C.text2 });
    const lessons = [
      ["Sejong, Kore · 2024", "Tek acil merkezi gece yetişkin hizmetini kesti.", "Acil ve 112 baştan planlanmalı."],
      ["Lake Nona, ABD · 2012", "Nemours çocuk hastanesi yerleşimin kurum çıpası oldu.", "Sağlık kurumu, yerleşime güven verir."],
    ];
    lessons.forEach(([h, t, d], i) => {
      const y = TOP + 0.5 + i * 1.75;
      card(s, rx, y, rw, 1.55);
      txt(s, [{ text: h, options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } },
        { text: t, options: { fontSize: 14, breakLine: true } }, { text: d, options: { fontSize: 14, bold: true, color: C.text2 } }],
        { x: rx + 0.2, y: y + 0.15, w: rw - 0.4, h: 1.3, paraSpaceAfter: 4 });
    });
    txt(s, [{ text: "Kim: ", options: { bold: true, color: C.text2 } }, { text: "Sağlık Bakanlığı, Ankara İl Sağlık Müdürlüğü." }],
      { x: rx, y: TOP + 4.1, w: rw, h: 0.6, fontSize: 14 });
    source(s, "Proje ekibinin \"yeni şehir hastanesi\" dediği tesis, kaynaklarda Kahramankazan Devlet Hastanesi olarak geçiyor; adı ve kapasitesi teyit edilecek.");
    s.addNotes("Sağlıkta üç basamak. Yerleşim içinde ilk günden aile sağlığı merkezi, 112 istasyonu ve poliklinik. İlçede, 2022'de açılan Kahramankazan Devlet Hastanesi; kaynaklarda yatak sayısı 150 ile 190 arasında değişiyor. Proje ekibi bu hastaneyi yeni şehir hastanesi olarak anmıştı; kaynaklarda devlet hastanesi olarak geçiyor. Bu yüzden arazide hastaneye yer ayırmıyoruz. Sejong'un dersi: acil hizmet baştan planlanmazsa aileler gitmiyor.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · SOSYAL YAŞAM VE YAPAY GÖL", "Göl: sosyal yaşamın merkezi");
    const src = [
      ["FaCloudRain", "Yağmur suyu hasadı", "~80–120 bin m³/yıl; kurak yıllarda düşer", false],
      ["FaRecycle", "İleri arıtılmış atıksu", "Tatlar / Kahramankazan AAT; sürekli takviye", false],
      ["FaFaucetDrip", "Şebeke suyu", "Yalnızca acil durumda", true],
    ];
    for (let i = 0; i < src.length; i++) {
      const y = TOP + i * 1.32;
      card(s, L, y, 3.35, 1.12, src[i][3] ? { fill: C.background2, line: HEX.slate, dash: "dash", noShadow: true } : {});
      await iconCircle(s, src[i][0], L + 0.18, y + 0.24, 0.62, src[i][3] ? C.accent5 : C.accent2);
      txt(s, src[i][1], { x: L + 0.95, y: y + 0.14, w: 2.3, h: 0.32, fontSize: 15, bold: true, color: C.text2 });
      txt(s, src[i][2], { x: L + 0.95, y: y + 0.48, w: 2.3, h: 0.58, fontSize: 13 });
      arrow(s, L + 3.4, y + 0.56, 0.75, (TOP + 1.85 - (y + 0.56)) * 0.55, i === 2 ? C.accent5 : C.accent2, i === 2 ? "dash" : "solid");
    }
    s.addShape(pres.shapes.OVAL, { x: 4.75, y: TOP + 0.55, w: 3.1, h: 2.4, fill: { color: C.accent2 }, line: { color: C.accent3, width: 10 }, objectName: "Yapay göl" });
    txt(s, [{ text: "Yapay göl", options: { bold: true, fontSize: 20, breakLine: true } }, { text: "2,5 ha su yüzeyi", options: { fontSize: 15, breakLine: true } }, { text: "+ 3,5 ha göl parkı", options: { fontSize: 15 } }],
      { x: 4.85, y: TOP + 1.2, w: 2.9, h: 1.2, color: C.background1, align: "center" });
    s.addText("Çökeltim havuzu · sirkülasyon · biyolojik arıtma", { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06, x: 4.4, y: TOP + 3.2, w: 3.8, h: 0.42,
      fill: { color: C.background1 }, line: { color: C.accent2, width: 1 }, color: C.text2, fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Arıtma etiketi" });
    arrow(s, 7.9, TOP + 1.75, 0.55, 0, C.accent2);
    const uses = [
      ["FaPersonWalking", "Göl çevresi", "Yürüyüş ve koşu parkuru, kafe, amfi, çocuk oyun alanları"],
      ["FaSailboat", "Su üstü", "Kano ve pedal tekne; kışın uygunsa buz pateni"],
      ["FaBookOpen", "Kıyıda", "Kültür merkezi, kütüphane, meydan ve haftalık pazar"],
    ];
    for (let i = 0; i < uses.length; i++) {
      const y = TOP + i * 1.32, x = 8.55;
      card(s, x, y, W - L - x, 1.12);
      await iconCircle(s, uses[i][0], x + 0.18, y + 0.24, 0.62, C.accent3);
      txt(s, uses[i][1], { x: x + 0.95, y: y + 0.14, w: 3.0, h: 0.32, fontSize: 15, bold: true, color: C.text2 });
      txt(s, uses[i][2], { x: x + 0.95, y: y + 0.48, w: 3.15, h: 0.6, fontSize: 13 });
    }
    card(s, L, TOP + 4.05, CW, 0.72, { fill: HEX.bad, noShadow: true });
    await iconCircle(s, "FaTriangleExclamation", L + 0.18, TOP + 4.14, 0.52, C.accent6);
    txt(s, "Ankara barajlarında aktif doluluk 8 Ocak 2026'da %1'e indi. Göl şebeke suyuyla doldurulmaz; ilk dolum ~50 bin m³ (30–75 bin) yağmur suyu ve arıtılmış atıksuyla yapılır.",
      { x: L + 0.85, y: TOP + 4.12, w: CW - 1.05, h: 0.6, fontSize: 14, valign: "middle" });
    source(s, "Kaynak: ASKİ verisi (BirGün, 10 Ocak 2026); yağış 350–450 mm/yıl, akış katsayısı 0,4–0,6 ile hasat tahmini. Buharlaşma kaybı hesaplanacak.");
    s.addNotes("Proje ekibinin planladığı yapay göl arazinin içinde, 2,5 hektar; çevresinde 3,5 hektar park. Doğal su kaynağı yok ve Ankara kuraklık yaşıyor: Ocak 2026'da barajlarda aktif doluluk yüzde 1'e indi. Bu yüzden önerimiz: göl yağmur suyu hasadı ve ileri arıtılmış atıksuyla beslenir, şebeke yalnızca acil durumda. Yarıntılardan gelen sediment için çökeltim havuzu, suyun durgunlaşmaması için sirkülasyon ve biyolojik arıtma ilk günden tasarlanır. Göl aynı zamanda taşkın dengeleme havzası ve sosyal yaşamın merkezi.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · DÜNYADAN ÖRNEKLER", "Bunlar yapılıyor: mahalle merkezinde göl");
    const ex = [
      ["FaWater", "Reston, ABD · 1963–67", "Lake Anne köy merkezi", "17 ha'lık köy merkezi gölün kıyısında; 2017'de tescilli miras.", "Göl ile meydan birlikte tasarlanınca merkez olur."],
      ["FaPeopleGroup", "Columbia, ABD · 1966–74", "Wilde Lake ve Kittamaqundi", "9–15 ha'lık mahalle gölleri; bakım sakin aidatıyla.", "İşletme modeli baştan kurulur."],
      ["FaLeaf", "Bishan-AMK, Singapur · 2012", "Beton kanaldan nehir parkına", "2,7 km kanal 3 km doğal nehre dönüştü; 76 milyon SGD.", "Su altyapısı aynı zamanda park olabilir."],
      ["FaLocationDot", "Göksu Parkı, Ankara · 2003", "Eryaman'ın göl parkı", "50,8 ha park, 12–14 ha gölet; 2021–22'de su kalitesi sorunu.", "Sirkülasyon, arıtma ve işletmeci ilk günden."],
    ];
    const cw = (CW - 3 * 0.3) / 4;
    for (let i = 0; i < ex.length; i++) {
      const x = L + i * (cw + 0.3), y = TOP;
      card(s, x, y, cw, 4.75, i === 3 ? { fill: C.background1, line: HEX.ochre } : {});
      await iconCircle(s, ex[i][0], x + 0.25, y + 0.25, 0.62, i === 3 ? C.accent1 : C.accent2);
      txt(s, ex[i][1], { x: x + 0.25, y: y + 1.05, w: cw - 0.5, h: 0.3, fontSize: 13, bold: true, color: C.accent1 });
      txt(s, ex[i][2], { x: x + 0.25, y: y + 1.4, w: cw - 0.5, h: 0.75, fontSize: 17, bold: true, color: C.text2 });
      txt(s, ex[i][3], { x: x + 0.25, y: y + 2.2, w: cw - 0.5, h: 1.2, fontSize: 15 });
      txt(s, [{ text: "Uydukent için ders", options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } }, { text: ex[i][4], options: { fontSize: 15 } }],
        { x: x + 0.25, y: y + 3.45, w: cw - 0.5, h: 1.2 });
    }
    source(s, "Kaynak: araştırma notları 04 ve 07. Columbia gölleri 22–37 acre. Bishan ziyaretçi sayısı (yılda 6 milyonu aşkın) kurum beyanıdır.");
    s.addNotes("Planlı kentlerde göl mahallenin merkezi olarak kullanılıyor. Reston'da Lake Anne köy merkezi bugün tescilli miras. Columbia'da göllerin bakımı sakin aidatıyla yapılıyor; yani işletme modeli baştan kuruluyor. Singapur Bishan'da beton bir kanal doğal bir nehir parkına dönüştürüldü. Ankara'daki yerel ders Göksu Parkı: 2021–22'de su kalitesi sorunları yaşandı. Bu yüzden Uydukent'te sirkülasyon, arıtma ve bir işletmeci ilk günden planlanıyor.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · ULAŞIM VE TRAFİK", "Ulaşım: sanayi bölgelerine 35 dakikanın altında");
    const st = [["Uydukent", 0.95, "Sarıayak"], ["Kınık sanayi alanı", 4.25, ""], ["HAB / Kışla", 7.45, ""]];
    const ly = TOP + 0.8;
    s.addShape(pres.shapes.LINE, { x: st[0][1], y: ly, w: st[2][1] - st[0][1], h: 0, line: { color: C.text2, width: 6 }, objectName: "Ekspres hat" });
    st.forEach(([n, x], i) => {
      const end = i !== 1;
      s.addShape(pres.shapes.OVAL, { x: x - 0.2, y: ly - 0.2, w: 0.4, h: 0.4, fill: { color: end ? C.accent1 : C.background1 }, line: { color: C.text2, width: 3 }, objectName: "Durak " + n });
      txt(s, n, { x: x - 1.0, y: ly + 0.3, w: 2.0, h: 0.35, fontSize: 14, bold: end, align: "center", color: end ? C.text2 : C.text1 });
    });
    txt(s, "11 km", { x: 2.1, y: ly - 0.5, w: 1.0, h: 0.3, fontSize: 13, bold: true, align: "center", color: C.accent1 });
    txt(s, "8 km", { x: 5.35, y: ly - 0.5, w: 1.0, h: 0.3, fontSize: 13, bold: true, align: "center", color: C.accent1 });
    txt(s, "Uydukent Ekspres · ~19 km · hedef kapıdan kapıya 35 dk'nın altı", { x: L, y: TOP, w: 7.4, h: 0.35, fontSize: 15, bold: true, color: C.text2 });
    const ph = [
      ["İlk gün", "Mesaiye bağlı elektrikli ekspres otobüs; garantili koltuk, sabit sefer süresi"],
      ["3–6 yıl", "Otobüs öncelikli koridor (BRT); koridor raylı sistem standardında ayrılır"],
      ["6–12 yıl", "Talep yeterse ekosistemde planlanan hafif raylı sisteme bağlantı"],
    ];
    const pw = 2.3;
    ph.forEach(([h, t], i) => {
      const x = L + i * (pw + 0.25), y = TOP + 2.0;
      card(s, x, y, pw, 2.0);
      txt(s, h, { x: x + 0.2, y: y + 0.18, w: pw - 0.4, h: 0.35, fontSize: 17, bold: true, color: C.accent1 });
      txt(s, t, { x: x + 0.2, y: y + 0.6, w: pw - 0.4, h: 1.35, fontSize: 14 });
    });
    txt(s, [{ text: "Ayrıca: ", options: { bold: true, color: C.text2 } }, { text: "Kahramankazan merkezine ring hat (8 km), Yenikent aktarması (Başkentray), mahalle içi çağrılı servis, kademeli mesai." }],
      { x: L, y: TOP + 4.2, w: 7.4, h: 0.6, fontSize: 14 });
    const tiles = [["13", "elektrikli otobüs, %15 yedekli"], ["~875", "sabah pikinde ekspres yolcusu"], ["~560", "otomobil, pikte koridordan çekilir"], ["374 t", "CO₂ yılda önlenir"]];
    tiles.forEach(([v, l], i) => stat(s, 8.35 + (i % 2) * 2.29, TOP + Math.floor(i / 2) * 2.45, 2.09, 2.25, v, l, { vsize: 32, lsize: 14 }));
    source(s, "Varsayımlar: hane başına 1,4 çalışan; en az yarısı savunma ve havacılık kümesinde (1.750 kişi); ekspres payı %50; otobüs başına ~85 yolcu.");
    s.addNotes("Ulaşımda hedef, HAB ve Kınık sanayi alanlarına kapıdan kapıya 35 dakikanın altında ve her gün aynı sürede varmak. Güzergâh Uydukent'ten Kınık'a 11, oradan HAB ve Kışla bölgesine 8 kilometre. İlk günden mesaiye bağlı elektrikli ekspres otobüsler çalışır: 13 otobüs, sabah pikinde yaklaşık 875 yolcu. Bu, Batıkent–Susuz–Eryaman koridorundan pikte yaklaşık 560 otomobil çeker. Tek başına koridoru çözmez, ama aynı model başka firmalara yayılınca etki büyür. Koridor baştan raylı sistem standardında ayrılır; ekosistemde planlanan hafif raylı sisteme bağlantı talebe bağlı bir karar kapısı.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · AKILLI ŞEHİR", "Akıllı şehir ve veri güvenliği");
    const items = [
      ["FaMobileScreen", "Ulaşım uygulaması", "Mesaiye bağlı; servis, EGO ve Başkentray tek uygulamada"],
      ["FaTrafficLight", "Akıllı koridor", "Otobüse öncelikli sinyalizasyon ve durak ekranları"],
      ["FaSolarPanel", "Enerji ve altyapı", "Her binaya fiber, akıllı sayaç, çatı güneş enerjisi"],
      ["FaDroplet", "Su yönetimi", "Gölde su kalitesi ve seviye sensörleri, akıllı sulama"],
      ["FaFlask", "Eğitim", "Deneyap ve makerspace; mühendis mentorluk platformu"],
      ["FaPeopleGroup", "Topluluk platformu", "Etkinlik takvimi, tesis rezervasyonu, yeni gelen aile programı"],
    ];
    const gw = 3.85, gh = 1.45;
    for (let i = 0; i < items.length; i++) {
      const x = L + (i % 2) * (gw + 0.25), y = TOP + Math.floor(i / 2) * (gh + 0.2);
      card(s, x, y, gw, gh);
      await iconCircle(s, items[i][0], x + 0.2, y + 0.22, 0.6);
      txt(s, items[i][1], { x: x + 0.95, y: y + 0.18, w: gw - 1.1, h: 0.35, fontSize: 15, bold: true, color: C.text2 });
      txt(s, items[i][2], { x: x + 0.95, y: y + 0.55, w: gw - 1.1, h: 0.85, fontSize: 13 });
    }
    const px = L + 2 * gw + 0.5, pw = W - L - px;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: TOP, w: pw, h: 3 * gh + 0.4, rectRadius: 0.08, fill: { color: C.text2 }, line: { type: "none" }, objectName: "Veri güvenliği paneli" });
    await iconCircle(s, "FaShieldHalved", px + 0.3, TOP + 0.3, 0.7, C.accent4, HEX.navy);
    txt(s, "Veri güvenliği bir tasarım şartı", { x: px + 1.15, y: TOP + 0.3, w: pw - 1.4, h: 0.75, fontSize: 18, bold: true, color: C.background1 });
    txt(s, bullets([
      "Sakinlerin çoğu savunma sanayi çalışanı; konum, ulaşım ve kamera verisi hassas.",
      "Veri yurt içinde, yerli altyapıda tutulur.",
      "Yalnızca gereken veri toplanır; ulaşım planlaması anonim veriyle yapılır.",
      "KVKK'ya ek bağımsız güvenlik denetimi.",
    ]), { x: px + 0.3, y: TOP + 1.25, w: pw - 0.6, h: 3.4, fontSize: 15, color: C.background1 });
    source(s, "Akıllı şehir sistemleri için yatırım tahmini 150 milyon TL (100–225); konut başına 40–90 bin TL varsayımı.");
    s.addNotes("Akıllı şehir burada bir vitrin değil, ulaşım, eğitim ve sosyal yaşam sorunlarına hizmet eden araçlar. Songdo'nun dersi, teknolojinin tek başına topluluk kurmadığı; bu yüzden fiziksel buluşma yerleri ile birlikte planlanıyor. En önemli konu veri güvenliği: sakinlerin büyük kısmı savunma çalışanı olacak. Veri yurt içinde ve yerli altyapıda tutulur, yalnızca gereken veri toplanır, bağımsız güvenlik denetimi yapılır.");
  }
  {
    const s = slideOf("ICERIK", "Yaşam alanı");
    head(s, "YAŞAM ALANI · SEKTÖRE FAYDA", "Savunma sanayi için: çekmek ve tutmak");
    const items = [
      ["FaClock", "Zaman", "Sabit ve kısa yolculuk: ekspres hat, kademeli mesai"],
      ["FaChildren", "Aile", "Okul, kreş ve sağlık yürüme mesafesinde"],
      ["FaBriefcase", "Eşler", "Kariyer masası ve mahalle merkezinde ortak çalışma alanı"],
      ["FaPeopleGroup", "Topluluk", "Göl, kültür merkezi, kulüpler; yeni gelen aile programı"],
      ["FaHouse", "Konut", "Satılık ve herkese açık; savunma çalışanlarına öncelik"],
      ["FaLock", "Güven", "Çalışan verisi yerli altyapıda korunur"],
    ];
    const cw = 3.95, rh = 1.5;
    for (let i = 0; i < items.length; i++) {
      const x = L + (i % 2) * (cw + 0.3), y = TOP + Math.floor(i / 2) * (rh + 0.15);
      await iconCircle(s, items[i][0], x, y + 0.1, 0.72, i % 2 ? C.accent1 : C.text2);
      txt(s, items[i][1], { x: x + 0.9, y: y + 0.08, w: cw - 0.9, h: 0.38, fontSize: 18, bold: true, color: C.text2 });
      txt(s, items[i][2], { x: x + 0.9, y: y + 0.5, w: cw - 0.95, h: 0.9, fontSize: 15 });
    }
    const qx = 9.1, qw = W - L - qx;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: qx, y: TOP, w: qw, h: 4.75, rectRadius: 0.08, fill: { color: C.text2 }, line: { type: "none" }, objectName: "Alıntı paneli" });
    txt(s, "“", { x: qx + 0.3, y: TOP + 0.1, w: 1, h: 0.9, fontSize: 60, bold: true, fontFace: "Cambria", color: C.accent4 });
    txt(s, "Yetenek kaybı resmi bir tehdit. Ailesiyle yaşanabilir bir yaşam alanı, istihdam hedefinin altyapısıdır.",
      { x: qx + 0.3, y: TOP + 1.0, w: qw - 0.6, h: 2.6, fontSize: 22, italic: true, fontFace: "Cambria", color: C.background1 });
    txt(s, "Dayanak: SSB Stratejik Planı 2024–2028, s. 46; 12. Kalkınma Planı, Tablo 22.", { x: qx + 0.3, y: TOP + 3.7, w: qw - 0.6, h: 0.8, fontSize: 12, color: C.background2 });
    source(s, "Uygulama modeli (kimin yapıp satacağı) bu çalışmanın kapsamı dışındadır.");
    s.addNotes("Sektör açısından iki hedef var: yeni mühendisleri bölgeye çekmek ve deneyimlileri tutmak. Bunu altı başlıkta karşılıyoruz: zaman, aile, eşler, topluluk, konut ve güven. Konutlar satılık ve herkese açık; savunma çalışanlarına öncelik tanınıyor. Kimin yapıp satacağı, yani uygulama modeli bu çalışmanın konusu değil.");
  }

  // ===== Yatırım ve fayda =====
  pres.addSection({ title: "Yatırım ve fayda" });
  {
    const s = slideOf("ICERIK", "Yatırım ve fayda");
    head(s, "YATIRIM VE FAYDA · YATIRIM TUTARI", "Yatırım: toplam ~12,5 milyar TL");
    const cats = ["Konutlar", "Kentsel altyapı", "Proje, etüt, beklenmeyen (%10)", "Ekspres hat ve aktarma", "Mahalle merkezi ve ticaret", "Göl, parklar, yamaç parkurları", "Kültür, spor, sağlık", "Devlet okul kampüsü", "Özel okul kampüsü", "Akıllı şehir sistemleri"];
    const vals = [7.94, 1.59, 1.14, 0.48, 0.32, 0.30, 0.28, 0.20, 0.16, 0.15];
    const kind = ["o", "k", "g", "k", "o", "k", "k", "k", "o", "k"];
    const col = { k: HEX.ochre, o: HEX.navy, g: HEX.slate };
    s.addChart(pres.charts.BAR, [{ name: "Baz senaryo (milyar TL)", labels: cats, values: vals }], Object.assign(chartBase("Baz senaryo, milyar TL"), {
      x: L, y: TOP, w: 7.6, h: 4.35, barDir: "bar", chartColors: kind.map((k) => col[k]),
      catAxisOrientation: "maxMin", barGapWidthPct: 40, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00",
      valAxisHidden: true, valGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 9.2,
      catAxisLabelFontSize: 12, dataLabelFontSize: 12,
    }));
    [[C.accent1, "Kamu ve ortak kullanım"], [C.text2, "Satış ve işletme geliriyle karşılanan"], [C.accent5, "Ortak gider"]].forEach(([c, t], i) => {
      const x = L + 0.3 + [0, 2.45, 5.75][i];
      s.addShape(pres.shapes.RECTANGLE, { x, y: TOP + 4.47, w: 0.22, h: 0.22, fill: { color: c }, line: { type: "none" }, objectName: "Gösterim" });
      txt(s, t, { x: x + 0.3, y: TOP + 4.42, w: 3.2, h: 0.32, fontSize: 12, valign: "middle" });
    });
    const rx = 8.55, rw = W - L - rx;
    stat(s, rx, TOP, rw, 1.45, "12,54 mlr TL", "toplam yatırım · aralık 9,93–15,94", { vsize: 30 });
    stat(s, rx, TOP + 1.65, rw, 1.45, "3,29 mlr TL", "kamu ve ortak kullanım payı · %26 · aralık 2,54–4,11", { vsize: 30, vcolor: C.accent1 });
    stat(s, rx, TOP + 3.3, rw, 1.45, "~5 mn TL", "konut başına toplam yatırım", { vsize: 30 });
    source(s, "2026 TL, KDV ve arazi hariç; arazi Hazine'nin. Başlıca belirsizlikler: yapı sınıfı, altyapı oranı, zemin ve yıllık %25–30 maliyet artışı.");
    s.addNotes("Toplam yatırım baz senaryoda 12,54 milyar TL, aralık 9,9 ile 15,9 milyar. Bunun büyük kısmı konut; konutlar, özel okul ve ticaret satış ve işletme gelirleriyle karşılanan kalemler. Kamu ve ortak kullanım payı, yani altyapı, devlet okulları, sağlık, kültür ve spor, göl ve parklar, akıllı şehir ve ekspres hat, yaklaşık 3,3 milyar TL, toplamın yüzde 26'sı. Tutarlar KDV ve arazi hariç; arazi Hazine'nin ve satın alınmıyor.");
  }
  {
    const s = slideOf("ICERIK", "Yatırım ve fayda");
    head(s, "YATIRIM VE FAYDA · KAMU FAYDASI", "Kamu faydası: ölçülen kısım alt sınır");
    s.addChart(pres.charts.BAR, [
      { name: "Ulaşım faydası, 30 yıllık bugünkü değer", labels: ["Düşük", "Baz", "Yüksek"], values: [0.62, 0.92, 1.95] },
      { name: "Kamu ve ortak kullanım payı", labels: ["Düşük", "Baz", "Yüksek"], values: [2.54, 3.29, 4.11] },
    ], Object.assign(chartBase("Milyar TL (reel %5 indirim)"), {
      x: L, y: TOP, w: 6.2, h: 4.8, barDir: "col", barGrouping: "clustered", chartColors: [HEX.sage, HEX.ochre], barGapWidthPct: 60,
      dataLabelPosition: "outEnd", dataLabelFormatCode: "0.00", valAxisHidden: true, valGridLine: { style: "none" },
      showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.ink, valAxisMaxVal: 4.8,
    }));
    const rx = 7.2, rw = W - L - rx;
    const rows = [
      ["Yıllık fayda (milyon TL)", "Düşük", "Baz", "Yüksek"],
      ["Kazanılan zaman", "26", "45", "112"],
      ["Yakıt tasarrufu", "13", "13", "13"],
      ["Önlenen CO₂", "1,7", "1,7", "1,7"],
      ["Toplam", "40", "60", "127"],
    ];
    const data = rows.map((r, i) => r.map((t, j) => ({ text: t, options: { bold: i === 0 || i === 4 || j === 0, align: j === 0 ? "left" : "right",
      color: i === 0 ? HEX.white : HEX.ink, fill: { color: i === 0 ? HEX.navy : (i === 4 ? HEX.tint : HEX.white) } } })));
    s.addTable(data, { x: rx, y: TOP, w: rw, colW: [2.33, 1.0, 1.0, 1.0], rowH: 0.42, fontSize: 14, valign: "middle", margin: [0.04, 0.1, 0.04, 0.1], border: { type: "solid", pt: 0.75, color: HEX.line } });
    card(s, rx, TOP + 2.35, rw, 2.45, { fill: C.background1 });
    txt(s, [
      { text: "Asıl gerekçe stratejik", options: { bold: true, color: C.text2, fontSize: 16, breakLine: true } },
      { text: "Ölçülen ulaşım faydası kamu payının %19–59'u kadar. Ölçülmeyenler: koridordaki diğer sürücülerin zamanı, kaza ve bakım, sağlık ve eğitime erişim, belediye gelirleri ve bir mühendisin ayrılmasının işverene maliyeti.", options: { fontSize: 14, breakLine: true } },
      { text: "İnşaat döneminde yılda ~617 kişilik şantiye istihdamı (varsayım).", options: { fontSize: 14, bold: true } },
    ], { x: rx + 0.25, y: TOP + 2.5, w: rw - 0.5, h: 2.2, paraSpaceAfter: 6 });
    source(s, "Varsayımlar: 220 iş günü; günde 20–50 dk kazanç; zaman değeri 200 TL/saat (yüksekte 350); otomobil payı %40'tan %25'e; araç başına 1,25 kişi.");
    s.addNotes("Ölçülebilen kamu faydasını dürüstçe hesapladık: kazanılan zaman, yakıt ve önlenen emisyon yılda 40 ile 127 milyon TL. Otuz yıllık bugünkü değeri kamu payının yüzde 19 ile 59'u arasında; yani tek başına kamu payını geri ödemiyor. Bu bir alt sınır, çünkü pek çok fayda ölçülmedi. Asıl gerekçe stratejik: Kalkınma Planı'nın istihdam hedefine ve SSB'nin tanımladığı yetenek kaybı tehdidine karşı bir yaşam alanı altyapısı.");
  }

  // ===== Uygulama =====
  pres.addSection({ title: "Uygulama" });
  {
    const s = slideOf("ICERIK", "Uygulama");
    head(s, "UYGULAMA · ETAPLAMA VE KARAR KAPILARI", "Etaplama: hizmetler konutla aynı gün");
    const cols = [
      ["Karar kapısı 1", "Arazinin bu amaçla değerlendirilmesi", "Hazırlık", "süre teyit edilecek", ["Parsel, yamaç statüsü, zemin ve imar teyitleri", "Sanayi çalışanlarına ön talep anketi", "Master plan ve projeler"]],
      ["Karar kapısı 2", "Plan onayı ve talep sonucu", "Aşama 0", "ilk konut teslimiyle aynı gün", ["Ekspres, ring hat, ulaşım uygulaması", "ASM ve 112; modüler kreş ve sınıflar", "Meydan, pazar, gölün ilk etabı; fiber"]],
      ["Karar kapısı 3", "Yolcu talebi ve okul kaydı", "Aşama 1", "3–6 yıl", ["Otobüs öncelikli koridor (BRT)", "Okul kampüsleri tamamlanır", "Kültür merkezi, göl çevresi, spor"]],
      ["Karar kapısı 4", "Saatte 4–5 bin yolcu", "Aşama 2", "6–12 yıl", ["Hafif raylı sisteme bağlantı", "MYO ile ortak programlar", "Kalan konut etapları"]],
    ];
    const cw = (CW - 3 * 0.25) / 4;
    for (let i = 0; i < cols.length; i++) {
      const x = L + i * (cw + 0.25);
      const [g, gt, ph, t, items] = cols[i];
      s.addShape(pres.shapes.DIAMOND, { x: x, y: TOP + 0.05, w: 0.5, h: 0.5, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Karar kapısı" });
      txt(s, [{ text: g, options: { bold: true, color: C.accent1, fontSize: 13, breakLine: true } }, { text: gt, options: { fontSize: 14 } }],
        { x: x + 0.62, y: TOP, w: cw - 0.62, h: 0.8 });
      card(s, x, TOP + 1.0, cw, 3.05, { fill: i === 1 ? C.text2 : C.background1 });
      const dark = i === 1;
      txt(s, ph, { x: x + 0.22, y: TOP + 1.18, w: cw - 0.44, h: 0.42, fontSize: 20, bold: true, fontFace: "Cambria", color: dark ? C.background1 : C.text2 });
      txt(s, t, { x: x + 0.22, y: TOP + 1.62, w: cw - 0.44, h: 0.35, fontSize: 13, bold: true, color: dark ? C.accent4 : C.accent1 });
      txt(s, bullets(items), { x: x + 0.22, y: TOP + 2.1, w: cw - 0.44, h: 1.9, fontSize: 14, color: dark ? C.background1 : C.text1 });
    }
    card(s, L, TOP + 4.25, CW, 0.6, { fill: C.background1, noShadow: true, line: HEX.line });
    txt(s, [{ text: "Etap ilkesi: ", options: { bold: true, color: C.accent1 } }, { text: "her konut etabı kendi okul, sağlık ve ulaşım hizmetiyle açılır; etap büyüklüğünü ön talep anketi belirler." }],
      { x: L + 0.25, y: TOP + 4.25, w: CW - 0.5, h: 0.6, fontSize: 14, valign: "middle" });
    source(s, "Süreler arazinin tahsisinden ve ilk konut tesliminden sayılır; hedef yıl belirlenince takvim yıllara çevrilecek.");
    s.addNotes("Planlı kentlerden çıkan ana ders: hizmetler geç gelirse aileler taşınmıyor. Bu yüzden Aşama 0'da ulaşım, sağlık, kreş ve sosyal yaşamın ilk parçaları ilk konut teslimiyle aynı gün açılıyor; modüler yapılar bunu mümkün kılıyor. Her aşamanın önünde bir karar kapısı var: ilki bugün talep ettiğimiz karar, son kapı ise ekosistemin hafif raylı sistemine ancak talep yeterse bağlanılması.");
  }
  {
    const s = slideOf("ICERIK", "Uygulama");
    head(s, "UYGULAMA · REFERANSLAR", "Referanslarımız: bölgede yaptıklarımız");
    const lw = 6.5;
    card(s, L, TOP, lw, 3.75);
    s.addImage({ path: A("ref_tai_ankara.jpg"), x: L, y: TOP, w: lw, h: lw / 2.512, objectName: "TAI Ankara Lodgings vaziyet perspektifi" });
    const ty = TOP + lw / 2.512 + 0.15;
    txt(s, [{ text: "TAI Ankara Lodgings  ", options: { bold: true, color: C.text2, fontSize: 18 } },
      { text: "Kahramankazan · 2022 · 400.000 m² · 1.500 konut", options: { bold: true, color: C.accent1, fontSize: 13 } }],
      { x: L + 0.25, y: ty, w: lw - 0.5, h: 0.38, valign: "middle" });
    txt(s, "Savunma sanayi çalışanları için yeni konut mahallesi: yeşil omurga; okul, sağlık ocağı, kütüphane ve spor yürüme mesafesinde.",
      { x: L + 0.25, y: ty + 0.42, w: lw - 0.5, h: 0.62, fontSize: 14 });
    card(s, L, TOP + 3.95, lw, 0.85);
    await iconCircle(s, "FaIndustry", L + 0.2, TOP + 4.08, 0.6, C.accent1);
    txt(s, [{ text: "TAI Kahramanmaraş Lodgings and Factory", options: { bold: true, color: C.text2, fontSize: 15, breakLine: true } },
      { text: "Lojmanlar ve fabrika: çalışan konutu ile üretim tesisini birlikte ele aldık.", options: { fontSize: 13 } }],
      { x: L + 0.95, y: TOP + 4.03, w: lw - 1.15, h: 0.72, valign: "middle" });
    const rx = L + lw + 0.35, rw = W - L - rx, iw = (rw - 0.2) / 2, ih = iw / 1.926;
    s.addImage({ path: A("ref_kentsel_donusum.jpg"), x: rx, y: TOP, w: iw, h: ih, objectName: "Kahramankazan Kentsel Dönüşüm" });
    s.addImage({ path: A("ref_kent_merkezi.jpg"), x: rx + iw + 0.2, y: TOP, w: iw, h: ih, objectName: "Kahramankazan Kent Merkezi" });
    txt(s, "Kentsel Dönüşüm", { x: rx, y: TOP + ih + 0.05, w: iw, h: 0.28, fontSize: 11, color: C.accent5 });
    txt(s, "Kent Merkezi", { x: rx + iw + 0.2, y: TOP + ih + 0.05, w: iw, h: 0.28, fontSize: 11, color: C.accent5 });
    const rows = [
      ["Proje", "Yıl", "Alan (m²)", "Rol"],
      ["Kahramankazan Kentsel Dönüşüm", "2020", "523.000", "Tasarım"],
      ["Kahramankazan Kent Merkezi", "2020", "412.175", "Tasarım"],
      ["Serapınar Termal Yaşam Merkezi", "2025", "3.000.000", "Tasarım ve yapım"],
      ["GIA Büyük Sanayi Alanı, Niğde", "2024", "29.000.000", "Tasarım ve yapım"],
    ];
    const data = rows.map((r, i) => r.map((t, j) => ({ text: t, options: { bold: i === 0, align: j === 1 || j === 2 ? "right" : "left",
      color: i === 0 ? HEX.white : HEX.ink, fill: { color: i === 0 ? HEX.navy : HEX.white } } })));
    const tyy = TOP + ih + 0.45;
    s.addTable(data, { x: rx, y: tyy, w: rw, colW: [2.45, 0.55, 1.08, rw - 4.08], rowH: [0.42, 0.5, 0.5, 0.5, 0.5], fontSize: 13, valign: "middle", margin: [0.03, 0.07, 0.03, 0.07], border: { type: "solid", pt: 0.75, color: HEX.line } });
    txt(s, [{ text: "Savunma sanayinde ayrıca: ", options: { bold: true, color: C.text2 } }, { text: "MKE Teknopark ve Genel Müdürlük Binası (2020), TR Motor ofis ve fabrika binaları (2023)." }],
      { x: rx, y: TOP + 4.28, w: rw, h: 0.55, fontSize: 13 });
    source(s, "Kaynak ve görseller: Belen & Partners kurumsal portföyü (Ağustos 2025). Roller portföydeki gibidir.");
    s.addNotes("Savunma sanayi için iki şehirde yerleşke ölçeğinde iş yaptık. Kahramankazan'da TAI Ankara Lodgings: 2022, 400 bin metrekare, 1.500 konut; okul, sağlık ocağı ve spor yürüme mesafesinde. Kahramanmaraş'ta lojmanlar ve fabrika; alan ve yıl bilgisi eklenecek. Ayrıca Kahramankazan'ın kentsel dönüşümü, kent merkezi ve Serapınar aynı ilçede. Uydukent bu planlama zincirinin yeni halkası.");
  }
  {
    const s = slideOf("ICERIK", "Uygulama");
    head(s, "UYGULAMA · RİSKLER", "Riskler ve azaltma önlemleri");
    const rows = [
      ["Risk", "Etkisi", "Önlem"],
      ["Yamaçların orman ya da ağaçlandırma statüsü", "Yapılaşabilir alan küçülür", "6831 statüsü sunumdan önce teyit; program yamaçları zaten koruyor"],
      ["Zemin: jips, marn, şişen kil", "Temel ve altyapı maliyeti artar", "Jeoteknik etüt; yapılar platolarda"],
      ["Kuraklık ve su", "Göl dolumu ve peyzaj sulaması", "Yağmur suyu ve arıtılmış atıksu; şebeke yalnızca acil"],
      ["Uçuş ve test gürültüsü", "Alıcı algısı, okul ve sağlık konforu", "Parsel koordinatıyla MSB ve SHGM verisi; gerekirse hassas yapılar uzakta"],
      ["Hizmetlerin geç gelmesi", "\"Yatak odası kent\" (Sejong, Songdo)", "Aşama 0: hizmetler konutla aynı gün; modüler yapılar"],
      ["Talep belirsizliği", "Etap büyüklüğü şaşar", "Sanayi çalışanlarına ön talep anketi; etaplı gelişme"],
      ["Plan ve imar statüsü", "Takvim uzar", "İmar durumu yazısı ve üst ölçek plan kararı"],
      ["Maliyet artışı", "Yatırım tutarı yükselir", "Yüksek senaryo 15,9 milyar TL; yıllık güncelleme"],
    ];
    table(s, rows, { table: { colW: [3.75, 3.4, 4.983], rowH: 0.52, fontSize: 14 } });
    source(s, "Ayrıntılı risk tablosu ve teyit listesi raporda yer alır.");
    s.addNotes("En kritik iki risk sahayla ilgili: yamaçların hukuki statüsü ve zemin. İkisi de sunumdan sonraki ilk teyit adımları. Su riski göl için özel bir kaynak planıyla, gürültü riski yerleşim düzeniyle, hizmetlerin geç gelmesi riski Aşama 0 ile karşılanıyor.");
  }
  {
    const s = slideOf("KARAR", "Uygulama");
    head(s, "KARAR", "Karar talebi ve sonraki adımlar");
    s.addImage({ path: A("karar.jpg"), x: W - 4.55, y: 0, w: 4.55, h: 7.5, sizing: undefined, objectName: "Plato tarlaları" });
    const cw = W - 4.55 - L - 0.45;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: L, y: TOP, w: cw, h: 1.75, rectRadius: 0.08, fill: { color: C.background1, transparency: 88 }, line: { color: C.accent4, width: 1.5 }, objectName: "Karar kutusu" });
    txt(s, [{ text: "Talep", options: { bold: true, color: C.accent4, fontSize: 14, breakLine: true } },
      { text: "Sarıayak'taki 511.000 m²'lik Hazine arazisinin savunma ve havacılık sanayi çalışanlarına yönelik bir yaşam alanı, Kahramankazan Uydukent, olarak değerlendirilmesi.", options: { fontSize: 18, fontFace: "Cambria", color: C.background1 } }],
      { x: L + 0.3, y: TOP + 0.18, w: cw - 0.6, h: 1.45, paraSpaceAfter: 4 });
    const steps = [
      "Sarıayak parselinin bilgisi ve sayısal halihazır harita",
      "Yamaçların hukuki statüsü (6831) ve zemin etüdü",
      "İmar durumu; ASKİ, Başkent EDAŞ, Başkentgaz görüşleri",
      "Savunma sanayi çalışanlarına ön talep anketi",
      "SSB, sanayi kuruluşları, ABB, Kahramankazan Belediyesi, MEB ve Sağlık Bakanlığı ile çalışma grubu",
    ];
    steps.forEach((t, i) => {
      const y = TOP + 2.0 + i * 0.63;
      s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: L, y, w: 0.45, h: 0.45, fill: { color: C.accent4 }, color: C.text2, fontSize: 15, bold: true, align: "center", valign: "middle", margin: 0, objectName: "Adım numarası" });
      txt(s, t, { x: L + 0.65, y: y - 0.02, w: cw - 0.65, h: 0.5, fontSize: 16, color: C.background1, valign: "middle" });
    });
    s.addNotes("Talebimiz tek cümle: Sarıayak'taki Hazine arazisinin savunma ve havacılık sanayi çalışanlarına yönelik bir yaşam alanı olarak değerlendirilmesi. Bu karar verilirse ilk işler şunlar: parsel bilgisi ve halihazır harita, yamaçların statüsü ve zemin etüdü, imar ve altyapı kapasite görüşleri, savunma sanayi çalışanlarına ön talep anketi ve kurumlar arası bir çalışma grubu. Teşekkür ederiz.");
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("yazıldı:", OUT);
}

build().catch((e) => { console.error(e); process.exit(1); });
