"""Area program for the 51.1 ha Örencik living area (scenarios by unit count)."""
import json
import sys
from pathlib import Path

OUT = Path(__file__).parent / "area"
OUT.mkdir(exist_ok=True)

GROSS_HA = 51.1
HOUSEHOLD = 3.0          # kişi/hane (assumption, Ankara ~3)
GFA_PER_UNIT = 120.0     # m² brüt inşaat alanı / konut (ortak alan dahil, assumption)
ROAD_SHARE = 0.20        # yol, otopark, aktarma istasyonu (brüt alanın payı)
SLOPE_HA = 10.0          # korunan yamaç ve yarıntılar (drone; topo ile kesinleşecek)
LAKE_HA = 2.5            # yapay göl su yüzeyi (proje ekibi: 2–3 ha)
LAKE_PARK_HA = 3.5       # göl çevresi park
SPORT_HA = 1.0           # spor kompleksi (açık-yeşil içinde semt spor alanı)
POCKET_PARK_M2_PP = 2.0  # mahalle parkları, çocuk bahçeleri (m²/kişi)
RETAIL_HA = 1.2          # mahalle merkezi, ticaret (göl kıyısı)

# MPYY Ek-2, 75.001–150.000 kademesi (ihtiyatlı; kademe ilçe projeksiyonuyla teyit edilecek)
EK2 = {
    "Eğitim (anaokulu, ilkokul, ortaokul, lise)": 6.5,
    "Sağlık (ASM, 112, poliklinik)": 1.5,
    "Sosyal ve kültürel tesisler": 1.0,
    "İbadet": 0.5,
    "Teknik altyapı (trafo, su deposu, atık, operasyon merkezi)": 1.25,
}
EK2_GREEN = 10.0

# Öğrenci oranları (1.000 kişi başına; genç aile varsayımı)
STUDENTS_PER_1000 = {"Kreş ve anaokulu (3–5)": 45, "İlkokul (6–9)": 60,
                     "Ortaokul (10–13)": 55, "Lise (14–17)": 45}


def program(units: int) -> dict:
    pop = units * HOUSEHOLD
    rows = []
    rows.append(("Korunan yamaç ve yarıntılar (ağaçlandırma, yürüyüş)", SLOPE_HA, "yeşil"))
    rows.append(("Yapay göl (su yüzeyi)", LAKE_HA, "yeşil"))
    rows.append(("Göl çevresi park", LAKE_PARK_HA, "yeşil"))
    rows.append(("Spor kompleksi", SPORT_HA, "yeşil"))
    rows.append(("Mahalle parkları ve çocuk bahçeleri", pop * POCKET_PARK_M2_PP / 1e4, "yeşil"))
    for name, m2pp in EK2.items():
        rows.append((name, pop * m2pp / 1e4, "donatı"))
    rows.append(("Mahalle merkezi ve ticaret", RETAIL_HA, "ticaret"))
    rows.append(("Yollar, otopark, servis ve aktarma istasyonu", GROSS_HA * ROAD_SHARE, "ulaşım"))
    used = sum(r[1] for r in rows)
    net_res = GROSS_HA - used
    rows.append(("Konut adaları (net)", net_res, "konut"))
    gfa = units * GFA_PER_UNIT
    green = sum(r[1] for r in rows if r[2] == "yeşil")
    return {
        "units": units, "pop": pop, "rows": rows, "net_res_ha": net_res,
        "gfa_m2": gfa, "far_net": gfa / (net_res * 1e4),
        "units_per_net_ha": units / net_res, "units_per_gross_ha": units / GROSS_HA,
        "green_ha": green, "green_m2_pp": green * 1e4 / pop,
        "ek2_green_ok": green * 1e4 / pop >= EK2_GREEN,
        "students": {k: round(v * pop / 1000) for k, v in STUDENTS_PER_1000.items()},
    }


def tr(x: float, d: int = 1) -> str:
    s = f"{x:,.{d}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def md_detail(p: dict) -> str:
    lines = ["| Kullanım | Alan (ha) | Pay (%) |", "|---|---:|---:|"]
    for name, ha, _ in p["rows"]:
        lines.append(f"| {name} | {tr(ha, 2)} | {tr(ha / GROSS_HA * 100, 1)} |")
    lines.append(f"| **Toplam** | **{tr(GROSS_HA, 2)}** | **100,0** |")
    return "\n".join(lines)


def md_scenarios(ps: list) -> str:
    head = "| Gösterge | " + " | ".join(f"{tr(p['units'], 0)} konut" for p in ps) + " |"
    sep = "|---|" + "---:|" * len(ps)
    def row(label, key, fmt):
        return f"| {label} | " + " | ".join(fmt(p[key]) for p in ps) + " |"
    rows = [head, sep,
            row("Nüfus (kişi)", "pop", lambda v: tr(v, 0)),
            row("Net konut alanı (ha)", "net_res_ha", lambda v: tr(v, 1)),
            row("Konut inşaat alanı (m²)", "gfa_m2", lambda v: tr(v, 0)),
            row("Net konut adasında emsal", "far_net", lambda v: tr(v, 2)),
            row("Net yoğunluk (konut/ha)", "units_per_net_ha", lambda v: tr(v, 0)),
            row("Brüt yoğunluk (konut/ha)", "units_per_gross_ha", lambda v: tr(v, 0)),
            row("Kişi başı yeşil alan (m²)", "green_m2_pp", lambda v: tr(v, 1))]
    return "\n".join(rows)


if __name__ == "__main__":
    scen = [program(u) for u in (2000, 2500, 3000)]
    rec = scen[1]
    (OUT / "program.json").write_text(json.dumps(scen, ensure_ascii=False, indent=1), encoding="utf-8")
    md = ["## Senaryolar", md_scenarios(scen), "", "## Önerilen senaryo: 2.500 konut", md_detail(rec), "",
          "## Öğrenci tahmini (önerilen senaryo)",
          "| Kademe | Öğrenci |", "|---|---:|"]
    md += [f"| {k} | {tr(v, 0)} |" for k, v in rec["students"].items()]
    (OUT / "program.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    print("\n".join(md))
