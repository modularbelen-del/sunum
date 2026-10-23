"""Build print-ready HTML for the reframed Örencik feasibility report and its notes annex."""
import re
import sys
from pathlib import Path

SP = Path(__file__).resolve().parent
sys.path.insert(0, str(SP))
from build_pdf import CSS as BASE_CSS, to_html  # noqa: E402

ROOT = SP.parent  # depo kökü
REPORT = ROOT / "reports" / "Kahramankazan Uydukent fizibilitesi.md"
NOTES = ROOT / "research_notes" / "Örencik yaşam alanı fizibilitesi"
IMG = (ROOT / "reports" / "gorseller").as_uri()
FOOT = "Belen & Partners · Kahramankazan Uydukent fizibilitesi · Ekim 2026"

KPIS = [("51,1 ha", "Hazine arazisi"), ("2.500", "konut (önerilen)"), ("≈7.500", "kişi"),
        ("≈12,5 milyar TL", "toplam yatırım, arazi hariç"), ("&lt;35 dk", "sanayi bölgelerine ekspresle")]

CSS = BASE_CSS.replace(
    '"Kahramankazan Örencik akıllı şehri · Taslak · 23 Ekim 2026"', f'"{FOOT}"') + """
figure { margin: 8pt 0 12pt; break-inside: avoid; }
figure img { width: 100%; border-radius: 2pt; display: block; }
figcaption { font-size: 8.5pt; color: #555; margin-top: 3pt; }
.kpis { display: flex; gap: 6pt; margin: 6pt 0 12pt; break-inside: avoid; }
.kpi { flex: 1; background: #0b2e4f; color: #fff; padding: 8pt 8pt 7pt; border-radius: 3pt; }
.kpi b { display: block; font-size: 14pt; line-height: 1.1; color: #fff; }
.kpi span { font-size: 8pt; color: #cfe0f0; }
.cover .hero { width: 100%; height: 95mm; object-fit: cover; border-radius: 3pt; margin-bottom: 18pt; }
.cover { justify-content: flex-start; padding-top: 6mm; height: 240mm; }
"""
assert FOOT in CSS


def page(title: str, body: str) -> str:
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>{title}</title>
<style>{CSS}</style></head><body>{body}</body></html>"""


def figures(html: str) -> str:
    """Turn <p><img src="gorseller/.." alt=".."></p> into figures with captions and absolute file URLs."""
    def repl(m):
        alt, src = m.group(1), m.group(2)
        if src.startswith("gorseller/"):
            src = IMG + "/" + src.split("/", 1)[1]
        # alt yazı Markdown'daki italik satırdan gelir; alt metin yalnızca erişilebilirlik içindir
        return f'<figure><img src="{src}" alt="{alt}"></figure>'
    return re.sub(r'<p><img alt="([^"]*)" src="([^"]+)"\s*/?></p>', repl, html)


def build_report() -> str:
    md = REPORT.read_text(encoding="utf-8")
    first, _, rest = md.partition("\n")
    title = first.lstrip("# ").strip()
    body = figures(to_html(rest))
    kpi = '<div class="kpis">' + "".join(f"<div class=\"kpi\"><b>{v}</b><span>{l}</span></div>" for v, l in KPIS) + "</div>"
    body, n = re.subn(r'(<h2 id="[^"]*">[^<]*Yönetici özeti[^<]*</h2>)', r"\1" + kpi, body, count=1)
    assert n == 1, "Yönetici özeti heading not found"
    heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
    toc = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in heads)
    cover = f"""<section class="cover"><img class="hero" src="{IMG}/drone_05_ova_manzarasi.jpg" alt="">
<div class="kicker">Fizibilite raporu</div><h1>{title}</h1>
<div class="sub">Savunma ve havacılık sanayi çalışanları için akıllı yaşam alanı · Sarıayak, Kahramankazan, Ankara</div>
<div class="meta">Hazırlayan: Belen &amp; Partners<br>Tarih: Ekim 2026</div>
<div class="warn">Bazı rakamlar varsayımlara veya ikincil kaynaklara dayanmakta olup metinde işaretlenmiştir; ilgili kurumlardan teyit edilmesi öngörülmektedir.</div></section>"""
    toc_html = f'<section class="toc"><h2>İçindekiler</h2><ol>{toc}</ol></section>'
    return page(title, cover + toc_html + body)


def build_notes() -> str:
    files = sorted(NOTES.glob("*.md"))
    parts = [f"""<section class="cover"><div class="kicker">Ek: araştırma notları</div><h1>Kahramankazan Uydukent fizibilitesi</h1>
<div class="sub">Raporun dayandığı {len(files)} araştırma ve hesap notu</div><div class="meta">Hazırlayan: Belen &amp; Partners<br>Tarih: Ekim 2026<br>Durum: iç kullanım</div></section>"""]
    parts.append('<section class="toc"><h2>Notlar</h2><ol>' + "".join(f"<li>{f.stem}</li>" for f in files) + "</ol></section>")
    for f in files:
        md = f.read_text(encoding="utf-8")
        # Proje Sarıayak'a taşındı: not başlıklarında eski mahalle adı kullanılmaz (gövde metni olduğu gibi kalır)
        md = "\n".join(ln.replace("Örencik", "Sarıayak") if ln.lstrip().startswith("#") else ln for ln in md.split("\n"))
        html = figures(to_html(md))
        parts.append(f'<section class="note"><h2>{f.stem}</h2>{html}</section>')
    return page("Araştırma notları", "".join(parts))


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "both"
    if which in ("report", "both"):
        (SP / "report_v2.html").write_text(build_report(), encoding="utf-8")
    if which in ("notes", "both"):
        (SP / "notes_v2.html").write_text(build_notes(), encoding="utf-8")
    print("ok")
