"""Build print-ready HTML from the report and research notes; Chrome turns them into PDF."""
import re
import sys
from pathlib import Path

SP = Path(__file__).resolve().parent
sys.path.insert(0, str(SP / "pylib"))
import markdown  # noqa: E402

ROOT = SP.parent  # depo kökü
REPORT = ROOT / "reports" / "Kahramankazan TUSAŞ çalışan yerleşimi.md"
NOTES = ROOT / "research_notes" / "Kahramankazan TUSAŞ çalışan yerleşimi"
DATE = "23 Ekim 2026"

LIST_RE = re.compile(r"^(\s*)([-*+]|\d+\.)\s")


def normalize(md: str) -> str:
    """Adapt CommonMark-style input to Python-Markdown: 4-space nesting, blank line before lists/tables."""
    out = []
    for line in md.splitlines():
        m = LIST_RE.match(line)
        if m and 0 < len(m.group(1)) < 4:
            line = "    " + line.lstrip()
            m = LIST_RE.match(line)
        prev = out[-1] if out else ""
        starts_block = (m and not m.group(1)) or line.startswith("|")
        prev_is_same = LIST_RE.match(prev) or prev.startswith("|") or prev.startswith("    ")
        if starts_block and prev.strip() and not prev_is_same:
            out.append("")
        out.append(line)
    return "\n".join(out) + "\n"


def to_html(md: str) -> str:
    return markdown.markdown(normalize(md), extensions=["tables", "sane_lists", "toc"])


CSS = """
@page { size: A4; margin: 18mm 16mm 18mm 16mm;
  @bottom-right { content: counter(page) " / " counter(pages); font: 8pt Calibri, Arial, sans-serif; color: #666; }
  @bottom-left { content: "Kahramankazan Örencik akıllı şehri · Taslak · %(date)s"; font: 8pt Calibri, Arial, sans-serif; color: #666; } }
@page :first { @bottom-right { content: none; } @bottom-left { content: none; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Calibri, Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1a1a1a; }
h1 { font-size: 20pt; color: #0b2e4f; margin: 0 0 8pt; }
h2 { font-size: 14pt; color: #0b2e4f; border-bottom: 1.5pt solid #0b2e4f; padding-bottom: 3pt; margin: 20pt 0 8pt; break-after: avoid; }
h3 { font-size: 12pt; color: #0b2e4f; margin: 14pt 0 6pt; break-after: avoid; }
p { margin: 0 0 7pt; text-align: justify; }
ul, ol { margin: 0 0 7pt 0; padding-left: 18pt; }
li { margin-bottom: 3pt; }
a { color: #1a5c99; text-decoration: none; }
strong { color: #0b2e4f; }
th strong { color: #fff; }
blockquote { margin: 10pt 0; padding: 8pt 12pt; background: #eef4fa; border-left: 3pt solid #1a5c99; }
blockquote p { margin: 0; }
table { width: 100%%; border-collapse: collapse; margin: 6pt 0 10pt; font-size: 8.6pt; line-height: 1.3; }
th { background: #0b2e4f; color: #fff; text-align: left; padding: 4pt 5pt; }
td { border-bottom: 0.5pt solid #c9d3dd; padding: 4pt 5pt; vertical-align: top; }
tr:nth-child(even) td { background: #f5f8fb; }
tr { break-inside: avoid; }
code { font-family: Consolas, monospace; font-size: 9pt; }
.cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
.cover .kicker { font-size: 11pt; letter-spacing: 1.5pt; text-transform: uppercase; color: #1a5c99; margin-bottom: 10pt; }
.cover h1 { font-size: 28pt; line-height: 1.15; }
.cover .sub { font-size: 13pt; color: #333; margin-top: 6pt; }
.cover .meta { margin-top: 36pt; font-size: 10pt; color: #444; border-top: 1pt solid #0b2e4f; padding-top: 10pt; }
.cover .warn { margin-top: 14pt; font-size: 9pt; color: #7a4b00; background: #fff6e5; padding: 6pt 9pt; border-left: 3pt solid #d48a00; }
.toc { break-after: page; }
.toc h2 { margin-top: 0; }
.toc ol { font-size: 11pt; line-height: 1.8; }
.note { break-before: page; }
.note:first-of-type { break-before: auto; }
""" % {"date": DATE}


def page(title: str, body: str) -> str:
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>{title}</title>
<style>{CSS}</style></head><body>{body}</body></html>"""


def cover(kicker: str, title: str, sub: str, extra: str = "") -> str:
    return f"""<section class="cover"><div class="kicker">{kicker}</div><h1>{title}</h1>
<div class="sub">{sub}</div><div class="meta">Tarih: {DATE}<br>Kapsam: açık kaynak araştırması ve çözüm önerileri (beyin fırtınası)<br>
Durum: taslak, iç değerlendirme için</div>{extra}</section>"""


def build_report() -> str:
    md = REPORT.read_text(encoding="utf-8")
    first, _, rest = md.partition("\n")
    title = first.lstrip("# ").strip()
    body = to_html(rest)
    heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
    toc = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in heads)
    warn = ('<div class="warn">Bu rapordaki bazı rakamlar arama özetlerine veya varsayımlara dayanır ve metinde '
            'işaretlidir. Sunumdan önce ilgili kurumlardan teyit edilmelidir.</div>')
    html = cover("Araştırma ve çözüm raporu", title,
                 "Ulaşım, eğitim ve sosyal yaşam için araştırmaya dayalı öneriler", warn)
    html += f'<section class="toc"><h2>İçindekiler</h2><ol>{toc}</ol></section>' + body
    return page(title, html)


def build_notes() -> str:
    parts = [cover("Ek: araştırma notları", "Kahramankazan Örencik akıllı şehri",
                   "Raporun dayandığı 11 araştırma notu (iki tur)")]
    files = sorted(NOTES.glob("*.md"))
    toc = "".join(f"<li>{f.stem}</li>" for f in files)
    parts.append(f'<section class="toc"><h2>Notlar</h2><ol>{toc}</ol></section>')
    for f in files:
        parts.append(f'<section class="note"><h2>{f.stem}</h2>{to_html(f.read_text(encoding="utf-8"))}</section>')
    return page("Araştırma notları", "".join(parts))


if __name__ == "__main__":
    (SP / "report.html").write_text(build_report(), encoding="utf-8")
    (SP / "notes.html").write_text(build_notes(), encoding="utf-8")
    print("ok")
