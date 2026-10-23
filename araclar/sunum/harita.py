"""Örencik konum ve koridor diyagramı (ölçekli, altlıksız). Koordinatlar araclar/dist.py'den (OSM)."""
import math
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Polygon

OUT = Path(sys.argv[1])
plt.rcParams["font.family"] = "Carlito"

NAVY, OCHRE, LAKE, SAGE, RED, INK, MUTED, BG = "#0B2E4F", "#9A5418", "#3E7CB1", "#6B8F5E", "#B5453A", "#1B2430", "#6B7480", "#F6F4EE"
REF = (40.2054445, 32.6813148)  # Kahramankazan merkez


def xy(p):
    lat, lon = p
    return ((lon - REF[1]) * math.cos(math.radians(REF[0])) * math.pi / 180 * 6371,
            (lat - REF[0]) * math.pi / 180 * 6371)


P = {
    "orencik": (40.2597899, 32.6583397),
    "kazan": (40.2054445, 32.6813148),
    "tusas": (40.0729723, 32.5826682),
    "hab": (40.0823503, 32.5856604),
    "myo": (40.1523356, 32.6536039),
    "saray": (40.0555340, 32.6307070),
    "susuz": (40.0204091, 32.6551222),
    "batikent": (39.9681734, 32.7267398),
    "eryaman": (39.9722971, 32.6212797),
    "yenikent": (40.0039468, 32.5244886),
}
X = {k: xy(v) for k, v in P.items()}

fig, ax = plt.subplots(figsize=(6.2, 7.6), dpi=300)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.set_aspect("equal")
ax.set_xlim(-19, 15)
ax.set_ylim(-29.5, 11.5)
ax.axis("off")

# Örencik Mahallesi sınırı (OSM bbox, yumuşatılmış)
x0, y0 = xy((40.2280035, 32.6372021))
x1, y1 = xy((40.2760360, 32.6963704))
ax.add_patch(FancyBboxPatch((x0, y0), x1 - x0, y1 - y0, boxstyle="round,pad=0,rounding_size=1.4",
                            fc="#E9C46A", ec=OCHRE, lw=1.6, alpha=0.55, zorder=2))


def path(keys, color, lw, ls="-", z=3, alpha=1.0):
    xs = [X[k][0] for k in keys]
    ys = [X[k][1] for k in keys]
    ax.plot(xs, ys, color=color, lw=lw, ls=ls, solid_capstyle="round", zorder=z, alpha=alpha)


# Bugünkü kentsel pik koridoru
path(["batikent", "susuz", "saray", "tusas"], RED, 5.5, z=3, alpha=0.85)
path(["eryaman", "susuz"], RED, 5.5, z=3, alpha=0.85)
# Yenikent aktarması
path(["yenikent", "tusas"], LAKE, 3.2, ls=(0, (2, 1.6)), z=4)
# Örencik–TUSAŞ Ekspres (şematik güzergâh)
path(["orencik", "kazan", "myo", "saray", "tusas"], NAVY, 3.6, z=5)


def dot(k, label, dx=0.8, dy=0.0, ha="left", size=11.5, color=INK, r=0.55, fc="white", ec=INK, bold=False, z=6):
    x, y = X[k]
    ax.add_patch(plt.Circle((x, y), r, fc=fc, ec=ec, lw=1.6, zorder=z))
    ax.text(x + dx, y + dy, label, ha=ha, va="center", fontsize=size, color=color,
            fontweight="bold" if bold else "normal", zorder=z + 1)


dot("orencik", "Örencik", dx=-3.4, dy=1.0, ha="right", size=15, color=NAVY, r=0.9, fc=OCHRE, ec="white", bold=True)
ax.text(X["orencik"][0] - 3.4, X["orencik"][1] - 0.9, "Mahalle sınırı;\n51,1 ha'lık parsel içinde", ha="right", va="top",
        fontsize=10, color=MUTED, zorder=7)
dot("kazan", "Kahramankazan\nmerkezi", dx=1.0, size=11.5)
dot("myo", "Gazi Üniv. TUSAŞ\nKazan MYO", dx=1.0, size=10.5, color=MUTED, r=0.4)
dot("saray", "Saray", dx=1.0, dy=0.2, size=11.5)
dot("susuz", "Susuz", dx=1.0, size=11.5)
dot("batikent", "Batıkent", dx=1.0, size=11.5)
dot("eryaman", "Eryaman", dx=0, dy=-1.6, ha="center", size=11.5)
dot("yenikent", "Yenikent\n(Başkentray ucu)", dx=0, dy=-2.1, ha="center", size=11, color=LAKE)

# TUSAŞ ve HAB OSB kümesi
tx, ty = X["tusas"]
hx, hy = X["hab"]
ax.add_patch(FancyBboxPatch((min(tx, hx) - 1.1, ty - 1.0), 2.4, 2.9, boxstyle="round,pad=0,rounding_size=0.5",
                            fc=NAVY, ec="white", lw=1.6, zorder=6))
ax.text(min(tx, hx) - 1.7, ty + 0.5, "TUSAŞ ve\nHAB OSB", ha="right", va="center", fontsize=14, color=NAVY,
        fontweight="bold", zorder=7)

# Ankara merkezi yönü
ax.annotate("", xy=(14.5, -29), xytext=(11.0, -26.0),
            arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1.4), zorder=4)
ax.text(10.6, -25.6, "Ankara merkezi\n(Kızılay) yönü", ha="right", va="bottom", fontsize=10, color=MUTED)

# Ölçek ve kuzey
ax.plot([-18, -13], [-28.6, -28.6], color=INK, lw=3, solid_capstyle="butt")
ax.text(-15.5, -27.9, "5 km", ha="center", va="bottom", fontsize=10, color=INK)
ax.annotate("K", xy=(-17.0, 10.8), xytext=(-17.0, 7.8), ha="center", va="center", fontsize=12, fontweight="bold",
            color=INK, arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.6))

# Gösterim
lx, ly = 3.2, 9.8
items = [(NAVY, "-", 3.6, "Örencik–TUSAŞ Ekspres (öneri, şematik)"),
         (RED, "-", 5.5, "Bugünkü pik koridoru (Batıkent–Susuz)"),
         (LAKE, (0, (2, 1.6)), 3.2, "Yenikent aktarması (öneri)")]
for i, (c, ls, lw, lab) in enumerate(items):
    yy = ly - i * 1.5
    ax.plot([lx, lx + 1.8], [yy, yy], color=c, ls=ls, lw=lw, solid_capstyle="round")
    ax.text(lx + 2.3, yy, lab, va="center", fontsize=10, color=INK)

fig.savefig(OUT, dpi=300, bbox_inches="tight", pad_inches=0.08, facecolor=BG)
print("ok", OUT)
