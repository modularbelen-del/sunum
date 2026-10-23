"""Bölgeleme şemasının çokgenlerini (araclar/schema.py) 3B sahne için metre cinsinden plan.json'a yazar."""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import schema as sc  # noqa: E402

cx = sum(p[0] for p in sc.site) / len(sc.site)
cy = sum(p[1] for p in sc.site) / len(sc.site)


def T(pts):
    return [[round(x - cx, 2), round(y - cy, 2)] for x, y in pts]


out = {"site": T(sc.site), "zones": [{"key": k, "label": lab, "pts": T(sc.S(p))} for k, lab, p in sc.zones]}
lake = sc.S([(600, 410)])[0]
out["lake"] = {"c": [lake[0] - cx, lake[1] - cy], "rx": 120 * sc.k, "ry": 70 * sc.k}
out["park"] = {"rx": 175 * sc.k, "ry": 120 * sc.k}
out["ring"] = {"rx": 193 * sc.k, "ry": 136 * sc.k}
for name, p in [("ent", (260, 690)), ("hub", (330, 610)), ("join", (463, 506))]:
    q = sc.S([p])[0]
    out[name] = [q[0] - cx, q[1] - cy]
out["k"] = sc.k
(HERE / "plan.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print("plan.json yazıldı")
