"""Abstract zoning diagram (SVG) for the 51.1 ha Kahramankazan Uydukent living area (Sarıayak); 1 SVG unit = 1 m."""
import math
import sys
from pathlib import Path

OUT = Path(__file__).parent / "area"
OUT.mkdir(exist_ok=True)
TARGET_M2 = 511_000

C = {
    "yamac": "#7fa77a", "park": "#a8d08d", "gol": "#6fb3d9", "spor": "#c9e4a6",
    "konut": "#efc27a", "egitim": "#5b8fc9", "saglik": "#e06666", "sosyal": "#a98bc9",
    "ticaret": "#f29a4a", "ibadet": "#c9a27e", "teknik": "#a0a0a0", "yol": "#ffffff",
    "ink": "#2b2b2b", "edge": "#3d5a3d",
}


def area(pts):
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]))) / 2


def ellipse_pts(cx, cy, rx, ry, n=48):
    return [(cx + rx * math.cos(2 * math.pi * i / n), cy + ry * math.sin(2 * math.pi * i / n)) for i in range(n)]


raw_site = [(80, 140), (420, 70), (790, 100), (1010, 210), (1050, 440), (960, 650),
            (700, 750), (380, 740), (140, 650), (60, 400)]
k = math.sqrt(TARGET_M2 / area(raw_site))
cx0 = sum(p[0] for p in raw_site) / len(raw_site)
cy0 = sum(p[1] for p in raw_site) / len(raw_site)


def S(pts):
    """Scale design coordinates about the site centroid so the site is 51.1 ha."""
    return [(cx0 + (x - cx0) * k, cy0 + (y - cy0) * k) for x, y in pts]


site = S(raw_site)
zones = [  # (key, label, design-coordinate polygon)
    ("konut", "Kuzey mahallesi", [(345, 100), (560, 88), (760, 108), (800, 205), (490, 222), (340, 170)]),
    ("konut", "Batı mahallesi", [(80, 340), (270, 330), (270, 560), (170, 610), (90, 480)]),
    ("konut", "Doğu mahallesi", [(820, 140), (990, 215), (1030, 420), (900, 460), (895, 310), (810, 300)]),
    ("konut", "Güney mahallesi", [(690, 560), (870, 600), (825, 700), (700, 722), (690, 630)]),
    ("egitim", "Özel okul kampüsü", [(150, 175), (330, 175), (330, 320), (150, 320)]),
    ("egitim", "Devlet okul kampüsü", [(280, 335), (410, 335), (410, 520), (280, 520)]),
    ("park", "Göl parkı", ellipse_pts(600, 410, 175, 120)),
    ("gol", "Yapay göl", ellipse_pts(600, 410, 120, 70)),
    ("ticaret", "Mahalle merkezi", [(490, 225), (710, 225), (710, 288), (490, 288)]),
    ("sosyal", "Kültür merkezi", [(712, 215), (802, 215), (802, 300), (712, 300)]),
    ("ibadet", "Cami", [(425, 230), (488, 230), (488, 288), (425, 288)]),
    ("saglik", "ASM ve 112", [(795, 320), (893, 320), (893, 440), (795, 440)]),
    ("spor", "Spor kompleksi", [(520, 548), (680, 548), (680, 622), (520, 622)]),
    ("teknik", "Teknik altyapı", [(870, 470), (975, 470), (975, 575), (870, 575)]),
]


def poly(pts, fill, stroke="none", sw=0, extra=""):
    d = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return f'<polygon points="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def text(x, y, s, size=17, weight="600", fill=None, anchor="middle"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill or C["ink"]}" text-anchor="{anchor}" font-family="Calibri, Segoe UI, Arial">{s}</text>')


def centroid(pts):
    return sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)


def svg() -> str:
    W, H = 1500, 980
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
           '<defs><pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">'
           f'<rect width="14" height="14" fill="{C["yamac"]}"/><line x1="0" y1="0" x2="0" y2="14" stroke="#5f8a5a" stroke-width="3"/></pattern></defs>',
           f'<rect width="{W}" height="{H}" fill="#fbfaf6"/>']
    g = '<g transform="translate(40,60)">'
    out.append(g)
    out.append(poly(site, "url(#hatch)", C["edge"], 3))
    areas = {}
    for key, label, pts in zones:
        P = S(pts)
        areas[label] = area(P) / 1e4
        out.append(poly(P, C[key], "#ffffff", 2))
    # roads: spine from the south-west entrance, ring around the lake park
    ent = S([(260, 690)])[0]
    hub = S([(330, 610)])[0]
    ring = S(ellipse_pts(600, 410, 193, 136, 64))
    out.append(f'<path d="M{ent[0]:.0f},{ent[1]:.0f} L{hub[0]:.0f},{hub[1]:.0f}" stroke="#ffffff" stroke-width="16" fill="none"/>')
    join = S([(463, 506)])[0]  # ring point at the south-west
    out.append(f'<path d="M{hub[0]:.0f},{hub[1]:.0f} L{join[0]:.0f},{join[1]:.0f}" stroke="#ffffff" stroke-width="14" fill="none"/>')
    out.append(poly(ring, "none", "#ffffff", 10))
    out.append(f'<circle cx="{hub[0]:.0f}" cy="{hub[1]:.0f}" r="20" fill="{C["ink"]}"/>')
    out.append(text(hub[0], hub[1] + 6, "S", 18, "700", "#fff"))
    out.append(text(hub[0] + 28, hub[1] - 4, "Servis ve aktarma", 16, "700", anchor="start"))
    out.append(text(hub[0] + 28, hub[1] + 15, "istasyonu", 16, "700", anchor="start"))
    out.append(text(ent[0] + 10, ent[1] + 52, "↙ Kahramankazan ve sanayi bölgeleri", 16, "600", anchor="end"))
    # labels: (label, design offset (dx, dy) from centroid, size, color, lines)
    special = {
        "Yapay göl": (0, 0, 18, "#ffffff"), "Göl parkı": (0, 100, 16, None),
        "Doğu mahallesi": (35, -60, 17, None), "Kuzey mahallesi": (0, -10, 17, None),
        "Kültür merkezi": (0, 0, 14, "#ffffff"), "ASM ve 112": (0, 0, 14, "#ffffff"),
        "Cami": (0, 0, 14, None), "Teknik altyapı": (0, 0, 14, None),
        "Devlet okul kampüsü": (0, 0, 15, "#ffffff"), "Özel okul kampüsü": (0, 0, 15, "#ffffff"),
    }
    for key, label, pts in zones:
        x, y = centroid(S(pts))
        dx, dy, size, fill = special.get(label, (0, 0, 17, None))
        words = label.split(" ")
        lines = [label] if size >= 16 or len(words) == 1 else [" ".join(words[:-1]), words[-1]]
        x, y = x + dx * k, y + dy * k
        top = y + 6 - (len(lines) - 1) * size * 0.6
        for i, ln in enumerate(lines):
            out.append(text(x, top + i * size * 1.2, ln, size, "700", fill))
    out.append(text(*S([(1000, 690)])[0], "Korunan yamaç ve yarıntılar", 16, "700", "#24452a"))
    out.append("</g>")
    # scale bar (200 m) and legend
    sx, sy = 70, H - 40
    out.append(f'<rect x="{sx}" y="{sy - 10}" width="100" height="10" fill="{C["ink"]}"/><rect x="{sx + 100}" y="{sy - 10}" width="100" height="10" fill="#fff" stroke="{C["ink"]}"/>')
    out.append(text(sx, sy + 20, "0", 14, "600") + text(sx + 100, sy + 20, "100", 14, "600") + text(sx + 200, sy + 20, "200 m", 14, "600"))
    legend = [("konut", "Konut adaları"), ("egitim", "Eğitim"), ("saglik", "Sağlık"), ("sosyal", "Sosyal ve kültürel"),
              ("ticaret", "Mahalle merkezi ve ticaret"), ("ibadet", "İbadet"), ("gol", "Yapay göl"),
              ("park", "Park"), ("spor", "Spor"), ("teknik", "Teknik altyapı")]
    lx, ly = 1215, 110
    out.append(text(lx, ly - 30, "Gösterim", 20, "700", anchor="start"))
    for i, (key, lab) in enumerate(legend):
        y = ly + i * 34
        out.append(f'<rect x="{lx}" y="{y - 16}" width="26" height="20" fill="{C[key]}" stroke="#666" stroke-width="0.8"/>')
        out.append(text(lx + 36, y, lab, 16, "500", anchor="start"))
    y = ly + len(legend) * 34
    out.append(f'<rect x="{lx}" y="{y - 16}" width="26" height="20" fill="url(#hatch)" stroke="#666" stroke-width="0.8"/>')
    out.append(text(lx + 36, y, "Korunan yamaç, ağaçlandırma", 16, "500", anchor="start"))
    y += 34
    out.append(f'<rect x="{lx}" y="{y - 12}" width="26" height="10" fill="#ffffff" stroke="#666" stroke-width="0.8"/>')
    out.append(text(lx + 36, y, "Ana yol ve servis hattı", 16, "500", anchor="start"))
    note = ["Şematiktir. Ölçeklidir, ancak parsel", "sınırı ve yönü temsilidir; kesin", "sınır ve topoğrafik harita gelince", "yeniden çizilecektir.",
            "", "Önerilen senaryo: 2.500 konut,", "yaklaşık 7.500 kişi, 51,1 ha."]
    for i, s in enumerate(note):
        out.append(text(lx, y + 50 + i * 24, s, 15, "500", "#444", "start"))
    out.append(text(40, 36, "Kahramankazan Uydukent: bölgeleme şeması (önerilen senaryo)", 26, "700", anchor="start"))
    out.append("</svg>")
    return "\n".join(out), areas


if __name__ == "__main__":
    s, areas = svg()
    (OUT / "schema.svg").write_text(s, encoding="utf-8")
    (OUT / "schema.html").write_text(f'<!doctype html><html><head><meta charset="utf-8"><style>body{{margin:0}}</style></head><body>{s}</body></html>', encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    print(f"site {area(site)/1e4:.1f} ha, k={k:.3f}")
    for lab, a in areas.items():
        print(f"{lab}: {a:.2f} ha")
