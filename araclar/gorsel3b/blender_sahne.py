"""Kahramankazan Uydukent kavram görselleri: Blender (bpy) + Cycles ile fiziksel ışıklı render.

Bölgeler araclar/gorsel3b/plan.json'dan gelir (araclar/schema.py ile aynı; 1 birim = 1 m).
Plan eksenleri: x doğu, z güney (şema y). Blender'da X = x, Y = -z (kuzey +Y), Z yukarı.

Kullanım (bpy modülü kurulu Python 3.11 ile):
    python blender_sahne.py --shot genel --out genel.png --res 1920x1080 --samples 128
Sahneler: genel, gol, okul, konut, istasyon
"""
import argparse
import json
import math
import random
import sys
import time
from pathlib import Path

import bpy  # noqa: I001  (bmesh, bpy'den sonra yüklenmeli)
import bmesh
from mathutils import Vector

HERE = Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument("--shot", default="genel")
ap.add_argument("--out", default=str(HERE / "cikti" / "genel.png"))
ap.add_argument("--res", default="1920x1080")
ap.add_argument("--samples", type=int, default=128)
ap.add_argument("--blend", default="")
A = ap.parse_args(sys.argv[1:])
RX, RY = map(int, A.res.split("x"))
plan = json.loads((HERE / "plan.json").read_text(encoding="utf-8"))
rnd = random.Random(11)
R = rnd.uniform

bpy.ops.wm.read_factory_settings(use_empty=True)
SC = bpy.context.scene
COL = SC.collection


def P(x, z):  # plan -> Blender XY
    return (x, -z)


def in_poly(x, z, pts):
    c = False
    j = len(pts) - 1
    for i in range(len(pts)):
        xi, zi = pts[i]
        xj, zj = pts[j]
        if (zi > z) != (zj > z) and x < (xj - xi) * (z - zi) / (zj - zi) + xi:
            c = not c
        j = i
    return c


Z = {z["label"]: z["pts"] for z in plan["zones"]}
LK = dict(x=plan["lake"]["c"][0], z=plan["lake"]["c"][1], rx=plan["lake"]["rx"], rz=plan["lake"]["ry"])


def in_ell(x, z, rx, rz, cx=None, cz=None):
    cx = LK["x"] if cx is None else cx
    cz = LK["z"] if cz is None else cz
    return ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1


def bbox(pts):
    xs = [p[0] for p in pts]
    zs = [p[1] for p in pts]
    return min(xs), max(xs), min(zs), max(zs)


def ell_pts(cx, cz, rx, rz, n=128):
    return [(cx + rx * math.cos(2 * math.pi * i / n), cz + rz * math.sin(2 * math.pi * i / n)) for i in range(n)]


# ------------------------------------------------------------------ malzemeler
def H(hx):
    """sRGB onaltılık renk -> Blender'ın doğrusal renk uzayı."""
    hx = hx.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(hx[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return tuple(out)


def node_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def principled(nt, color=(0.8, 0.8, 0.8), rough=0.6, spec=0.5, metal=0.0):
    b = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Specular IOR Level"].default_value = spec
    b.inputs["Metallic"].default_value = metal
    return b


def simple(name, color, rough=0.6, spec=0.5, metal=0.0, noise=0.0, nscale=2.0, bump=0.0):
    m, nt, out = node_mat(name)
    b = principled(nt, color, rough, spec, metal)
    if noise:
        tc = nt.nodes.new("ShaderNodeTexCoord")
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = nscale
        nz.inputs["Detail"].default_value = 6
        nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
        mix = nt.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.inputs[6].default_value = (*[c * (1 - noise) for c in color], 1)
        mix.inputs[7].default_value = (*[min(1, c * (1 + noise)) for c in color], 1)
        nt.links.new(nz.outputs["Fac"], mix.inputs[0])
        nt.links.new(mix.outputs[2], b.inputs["Base Color"])
        if bump:
            bp = nt.nodes.new("ShaderNodeBump")
            bp.inputs["Strength"].default_value = bump
            nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
            nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs[0])
    return m


def ramp_from_random(nt, colors, src):
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.interpolation = "CONSTANT"
    els = cr.color_ramp.elements
    while len(els) < len(colors):
        els.new(0.5)
    for i, c in enumerate(colors):
        els[i].position = i / len(colors)
        els[i].color = (*c, 1)
    nt.links.new(src, cr.inputs[0])
    return cr


def facade_mat(name, walls, kind="punch"):
    """Cephe: nesne koordinatından pencere ızgarası; üst yüzeyler çatı; renk nesne başına rastgele."""
    m, nt, out = node_mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    add = nt.nodes.new("ShaderNodeMath")
    add.operation = "ADD"
    nt.links.new(sep.outputs[0], add.inputs[0])
    nt.links.new(sep.outputs[1], add.inputs[1])
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    nt.links.new(add.outputs[0], comb.inputs[0])
    nt.links.new(sep.outputs[2], comb.inputs[1])
    oi = nt.nodes.new("ShaderNodeObjectInfo")
    wall_col = ramp_from_random(nt, walls, oi.outputs["Random"])
    wall = principled(nt, walls[0], 0.85, 0.35)
    nt.links.new(wall_col.outputs[0], wall.inputs["Base Color"])
    glass = principled(nt, H("1A222A"), 0.06, 0.9)
    if kind == "punch":
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.offset = 0.0
        br.inputs["Scale"].default_value = 1.0
        br.inputs["Brick Width"].default_value = 3.4
        br.inputs["Row Height"].default_value = 3.2
        br.inputs["Mortar Size"].default_value = 0.85
        br.inputs["Mortar Smooth"].default_value = 0.0
        br.inputs["Color1"].default_value = (*H("1C2630"), 1)
        br.inputs["Color2"].default_value = (*H("8A8070"), 1)
        br.inputs["Bias"].default_value = -0.4
        nt.links.new(comb.outputs[0], br.inputs["Vector"])
        nt.links.new(br.outputs["Color"], glass.inputs["Base Color"])
        win = nt.nodes.new("ShaderNodeMath")
        win.operation = "SUBTRACT"
        win.inputs[0].default_value = 1.0
        nt.links.new(br.outputs["Fac"], win.inputs[1])
        mask = win.outputs[0]
    else:  # şerit pencere (okul, sağlık, merkez)
        dv = nt.nodes.new("ShaderNodeMath")
        dv.operation = "DIVIDE"
        dv.inputs[1].default_value = 3.8
        nt.links.new(sep.outputs[2], dv.inputs[0])
        fr = nt.nodes.new("ShaderNodeMath")
        fr.operation = "FRACT"
        nt.links.new(dv.outputs[0], fr.inputs[0])
        lo = nt.nodes.new("ShaderNodeMath")
        lo.operation = "GREATER_THAN"
        lo.inputs[1].default_value = 0.28
        nt.links.new(fr.outputs[0], lo.inputs[0])
        hi = nt.nodes.new("ShaderNodeMath")
        hi.operation = "LESS_THAN"
        hi.inputs[1].default_value = 0.86
        nt.links.new(fr.outputs[0], hi.inputs[0])
        mu = nt.nodes.new("ShaderNodeMath")
        mu.operation = "MULTIPLY"
        nt.links.new(lo.outputs[0], mu.inputs[0])
        nt.links.new(hi.outputs[0], mu.inputs[1])
        # dikey kayıtlar
        dv2 = nt.nodes.new("ShaderNodeMath")
        dv2.operation = "DIVIDE"
        dv2.inputs[1].default_value = 2.2
        nt.links.new(add.outputs[0], dv2.inputs[0])
        fr2 = nt.nodes.new("ShaderNodeMath")
        fr2.operation = "PINGPONG"
        fr2.inputs[1].default_value = 0.5
        nt.links.new(dv2.outputs[0], fr2.inputs[0])
        gt2 = nt.nodes.new("ShaderNodeMath")
        gt2.operation = "GREATER_THAN"
        gt2.inputs[1].default_value = 0.04
        nt.links.new(fr2.outputs[0], gt2.inputs[0])
        mu2 = nt.nodes.new("ShaderNodeMath")
        mu2.operation = "MULTIPLY"
        nt.links.new(mu.outputs[0], mu2.inputs[0])
        nt.links.new(gt2.outputs[0], mu2.inputs[1])
        mask = mu2.outputs[0]
        glass.inputs["Base Color"].default_value = (*H("23303A"), 1)
    mixw = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(mask, mixw.inputs[0])
    nt.links.new(wall.outputs[0], mixw.inputs[1])
    nt.links.new(glass.outputs[0], mixw.inputs[2])
    # çatı
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sepn = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(geo.outputs["Normal"], sepn.inputs[0])
    isroof = nt.nodes.new("ShaderNodeMath")
    isroof.operation = "GREATER_THAN"
    isroof.inputs[1].default_value = 0.6
    nt.links.new(sepn.outputs[2], isroof.inputs[0])
    roof = principled(nt, H("8F8C86"), 0.9, 0.2)
    mixr = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(isroof.outputs[0], mixr.inputs[0])
    nt.links.new(mixw.outputs[0], mixr.inputs[1])
    nt.links.new(roof.outputs[0], mixr.inputs[2])
    nt.links.new(mixr.outputs[0], out.inputs[0])
    return m


def ground_mat(name, colors, scale=0.03, bump=0.15, rough=0.95):
    m, nt, out = node_mat(name)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = scale
    nz.inputs["Detail"].default_value = 8
    nz.inputs["Roughness"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    els = cr.color_ramp.elements
    while len(els) < len(colors):
        els.new(0.5)
    for i, c in enumerate(colors):
        els[i].position = 0.3 + 0.4 * i / max(1, len(colors) - 1)
        els[i].color = (*c, 1)
    nt.links.new(nz.outputs["Fac"], cr.inputs[0])
    b = principled(nt, colors[0], rough, 0.25)
    nt.links.new(cr.outputs[0], b.inputs["Base Color"])
    fine = nt.nodes.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = 3.0
    nt.links.new(tc.outputs["Object"], fine.inputs["Vector"])
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = bump
    nt.links.new(fine.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs[0])
    return m


def fields_mat():
    m, nt, out = node_mat("tarla")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sx = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sx.inputs[0])
    flat2 = nt.nodes.new("ShaderNodeCombineXYZ")
    nt.links.new(sx.outputs[0], flat2.inputs[0])
    nt.links.new(sx.outputs[1], flat2.inputs[1])
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (0, 0, 0.35)
    mp.inputs["Scale"].default_value = (1 / 120, 1 / 80, 1)
    nt.links.new(flat2.outputs[0], mp.inputs[0])
    vo = nt.nodes.new("ShaderNodeTexVoronoi")
    vo.inputs["Scale"].default_value = 1.0
    vo.inputs["Randomness"].default_value = 0.35
    nt.links.new(mp.outputs[0], vo.inputs[0])
    cr = ramp_from_random(nt, [H("D2BD8C"), H("C2AA78"), H("B39B6C"), H("9C8A66"), H("CDB98E"), H("8C7A5C"), H("A8A274")], vo.outputs["Color"])
    # Voronoi rengi 3 kanallı; tek değere indir
    cr.color_ramp.interpolation = "CONSTANT"
    sepc = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(vo.outputs["Color"], sepc.inputs[0])
    nt.links.new(sepc.outputs[0], cr.inputs[0])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 0.08
    nt.links.new(flat2.outputs[0], nz.inputs["Vector"])
    mixn = nt.nodes.new("ShaderNodeMix")
    mixn.data_type = "RGBA"
    mixn.blend_type = "MULTIPLY"
    mixn.inputs[0].default_value = 0.18
    nt.links.new(cr.outputs[0], mixn.inputs[6])
    nt.links.new(nz.outputs["Color"], mixn.inputs[7])
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.inputs["Scale"].default_value = 0.6
    wv.inputs["Distortion"].default_value = 0.5
    nt.links.new(mp.outputs[0], wv.inputs[0])
    b = principled(nt, (0.55, 0.47, 0.3), 0.95, 0.2)
    nt.links.new(mixn.outputs[2], b.inputs["Base Color"])
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = 0.1
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs[0])
    return m


def water_mat():
    m, nt, out = node_mat("su")
    b = principled(nt, H("1F4A57"), 0.03, 1.0)
    b.inputs["IOR"].default_value = 1.33
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 0.6
    nz.inputs["Detail"].default_value = 4
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = 0.08
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs[0])
    return m


def leaf_mat(name, greens):
    m, nt, out = node_mat(name)
    oi = nt.nodes.new("ShaderNodeObjectInfo")
    cr = ramp_from_random(nt, greens, oi.outputs["Random"])
    cr.color_ramp.interpolation = "LINEAR"
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 1.5
    nz.inputs["Detail"].default_value = 6
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    mx = nt.nodes.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.blend_type = "MULTIPLY"
    mx.inputs[0].default_value = 0.45
    nt.links.new(cr.outputs[0], mx.inputs[6])
    nt.links.new(nz.outputs["Color"], mx.inputs[7])
    b = principled(nt, greens[0], 0.75, 0.3)
    b.inputs["Subsurface Weight"].default_value = 0.15
    nt.links.new(mx.outputs[2], b.inputs["Base Color"])
    bp = nt.nodes.new("ShaderNodeBump")
    bp.inputs["Strength"].default_value = 0.6
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"])
    nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(b.outputs[0], out.inputs[0])
    return m


WALLS = [H("EDE8DF"), H("E3D9C6"), H("EAE6DE"), H("C98F6E"), H("D8D5CE")]
MAT = {
    "facade": facade_mat("cephe", WALLS, "punch"),
    "ribbon": facade_mat("serit", [H("EEEDEA"), H("E2E0DB")], "ribbon"),
    "wood": facade_mat("ahsap", [H("9B6A43"), H("A8774C")], "ribbon"),
    "white": simple("beyaz", H("ECEAE4"), 0.7),
    "stone": simple("tas", H("BFB29A"), 0.85, noise=0.12, nscale=0.6, bump=0.1),
    "pave": ground_mat("kaldirim", [H("B3ADA1"), H("C4BEB2")], 0.2, 0.08, 0.8),
    "asphalt": ground_mat("asfalt", [H("3A3A39"), H("474745")], 0.5, 0.05, 0.85),
    "mark": simple("serit_cizgi", H("E8E8E0"), 0.6),
    "grass": ground_mat("cim", [H("557F33"), H("66903D"), H("789F49")], 0.05, 0.2),
    "lawn": ground_mat("avlu_cimi", [H("62913E"), H("76A34C")], 0.08, 0.2),
    "belt": ground_mat("yamac", [H("8C8A55"), H("9E9662"), H("787A47")], 0.02, 0.3),
    "fields": fields_mat(),
    "water": water_mat(),
    "glass": simple("cam", H("1A222A"), 0.05, 1.0),
    "solar": simple("gunes_paneli", H("1C2A3D"), 0.12, 0.9, 0.3),
    "pitch": ground_mat("saha", [H("3F7A35"), H("4A8A3E")], 0.3, 0.05),
    "track": simple("pist", H("A9452E"), 0.8),
    "woodfloor": simple("ahsap_zemin", H("8A6040"), 0.6, noise=0.2, nscale=5),
    "metal": simple("metal", H("A9ABAE"), 0.35, 0.5, 0.8),
    "dome": simple("kubbe", H("A9B2B8"), 0.35, 0.6, 0.5),
    "red": simple("kirmizi", H("B3332A"), 0.5),
    "play": simple("oyun", H("C98432"), 0.6),
    "play2": simple("oyun2", H("3E7CB1"), 0.6),
    "trunk": simple("govde", H("4A3A2C"), 0.9),
    "leaf": leaf_mat("yaprak", [H("3F5F2A"), H("4E6E30"), H("5D7A36"), H("47612E")]),
    "pine": leaf_mat("igne", [H("26402A"), H("2E4A30"), H("344F33")]),
    "boat": simple("tekne", H("F5F5F2"), 0.3),
    "bus": simple("otobus", H("F2F3F3"), 0.25, 0.7),
    "busband": simple("otobus_serit", H("0B2E4F"), 0.2, 0.8),
}


# ------------------------------------------------------------------ geometri yardımcıları
class MB:
    """Kutuları tek meshte toplar."""

    def __init__(self):
        self.v, self.f = [], []

    def box(self, cx, cy, z0, w, d, h, rot=0.0):
        c, s = math.cos(rot), math.sin(rot)
        base = len(self.v)
        for dz in (0, h):
            for dx, dy in ((-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)):
                self.v.append((cx + dx * c - dy * s, cy + dx * s + dy * c, z0 + dz))
        b = base
        self.f += [(b, b + 3, b + 2, b + 1), (b + 4, b + 5, b + 6, b + 7), (b, b + 1, b + 5, b + 4),
                   (b + 1, b + 2, b + 6, b + 5), (b + 2, b + 3, b + 7, b + 6), (b + 3, b, b + 4, b + 7)]

    def obj(self, name, mat, origin=None):
        if not self.v:
            return None
        me = bpy.data.meshes.new(name)
        me.from_pydata(self.v, [], self.f)
        me.materials.append(mat)
        ob = bpy.data.objects.new(name, me)
        COL.objects.link(ob)
        return ob


def box_obj(name, mat, cx, cy, z0, w, d, h, rot=0.0):
    """Tek kutu, kökeni merkezde (cephe dokusu nesne koordinatına göre ölçeklenir)."""
    mb = MB()
    mb.box(0, 0, 0, w, d, h)
    ob = mb.obj(name, mat)
    ob.location = (cx, cy, z0)
    ob.rotation_euler = (0, 0, rot)
    return ob


def poly_obj(name, pts_plan, mat, z=0.0, holes=None):
    bm = bmesh.new()
    vs = [bm.verts.new((x, -zz, z)) for x, zz in pts_plan]
    bm.faces.new(vs)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    COL.objects.link(ob)
    return ob


def ring_obj(name, cx, cz, rx, rz, w, mat, z, n=160):
    bm = bmesh.new()
    outer = [bm.verts.new((cx + (rx + w / 2) * math.cos(2 * math.pi * i / n), -(cz + (rz + w / 2) * math.sin(2 * math.pi * i / n)), z)) for i in range(n)]
    inner = [bm.verts.new((cx + (rx - w / 2) * math.cos(2 * math.pi * i / n), -(cz + (rz - w / 2) * math.sin(2 * math.pi * i / n)), z)) for i in range(n)]
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((outer[i], outer[j], inner[j], inner[i]))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    COL.objects.link(ob)
    return ob


def strip_obj(name, a, b, w, mat, z):
    ax, ay = P(*a)
    bx, by = P(*b)
    L = math.hypot(bx - ax, by - ay)
    ob = box_obj(name, mat, (ax + bx) / 2, (ay + by) / 2, z, L, w, 0.05, math.atan2(by - ay, bx - ax))
    return ob


# ------------------------------------------------------------------ arazi
def noise2(x, y):
    return math.sin(x * 0.004 + 1.3) * math.cos(y * 0.005 - 0.7) + 0.5 * math.sin(x * 0.011 - y * 0.008) + 0.25 * math.cos(x * 0.023 + y * 0.019)


SITE = plan["site"]


def dist_site(x, z):
    if in_poly(x, z, SITE):
        return 0.0
    best = 1e9
    n = len(SITE)
    for i in range(n):
        (ax, az), (bx, bz) = SITE[i], SITE[(i + 1) % n]
        dx, dz = bx - ax, bz - az
        t = max(0.0, min(1.0, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
        best = min(best, math.hypot(x - ax - t * dx, z - az - t * dz))
    return best


def terrain_h(x, y):
    d = dist_site(x, -y)
    h = 0.0
    if d > 15:
        h = min((d - 15) * 0.22, 45) * (0.7 + 0.3 * noise2(x, y))
    if d > 120:
        h += noise2(x * 1.7, y * 1.7) * 16 * min(1, (d - 120) / 200)
    return h - 0.6


def build_terrain():
    N, S = 300, 6000.0
    bm = bmesh.new()
    grid = []
    for j in range(N + 1):
        row = []
        for i in range(N + 1):
            x = -S / 2 + S * i / N
            y = -S / 2 + S * j / N
            row.append(bm.verts.new((x, y, terrain_h(x, y))))
        grid.append(row)
    for j in range(N):
        for i in range(N):
            bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
    me = bpy.data.meshes.new("arazi")
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(MAT["fields"])
    ob = bpy.data.objects.new("arazi", me)
    COL.objects.link(ob)


# ------------------------------------------------------------------ dağıtım (geometry nodes ile örnekleme)
def proto_collection(name):
    c = bpy.data.collections.new(name)
    return c


def scatter(name, pts, coll, smin=0.85, smax=1.2, rot=True, seed=0):
    if not pts:
        return
    me = bpy.data.meshes.new(name)
    me.from_pydata(pts, [], [])
    ob = bpy.data.objects.new(name, me)
    COL.objects.link(ob)
    ng = bpy.data.node_groups.new(name + "_gn", "GeometryNodeTree")
    ng.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
    ng.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
    gi = ng.nodes.new("NodeGroupInput")
    go = ng.nodes.new("NodeGroupOutput")
    iop = ng.nodes.new("GeometryNodeInstanceOnPoints")
    ci = ng.nodes.new("GeometryNodeCollectionInfo")
    ci.inputs["Collection"].default_value = coll
    ci.inputs["Separate Children"].default_value = True
    ci.inputs["Reset Children"].default_value = True
    iop.inputs["Pick Instance"].default_value = True
    def rnd_node(dtype, lo, hi, sd):
        n = ng.nodes.new("FunctionNodeRandomValue")
        n.data_type = dtype
        want = {"INT": "INT", "FLOAT": "VALUE"}[dtype]
        for inp in n.inputs:
            if inp.type == want and inp.name == "Min":
                inp.default_value = lo
            if inp.type == want and inp.name == "Max":
                inp.default_value = hi
            if inp.name == "Seed":
                inp.default_value = sd
        out = [o for o in n.outputs if o.type == want][0]
        return out

    ri = rnd_node("INT", 0, len(coll.objects) - 1, seed)
    rr = rnd_node("FLOAT", 0.0, 6.283 if rot else 0.0, seed + 1)
    rs = rnd_node("FLOAT", smin, smax, seed + 2)
    cz = ng.nodes.new("ShaderNodeCombineXYZ")
    L = ng.links.new
    L(gi.outputs[0], iop.inputs["Points"])
    L(ci.outputs[0], iop.inputs["Instance"])
    L(ri, iop.inputs["Instance Index"])
    L(rr, cz.inputs[2])
    L(cz.outputs[0], iop.inputs["Rotation"])
    L(rs, iop.inputs["Scale"])
    L(iop.outputs[0], go.inputs[0])
    mod = ob.modifiers.new("dagit", "NODES")
    mod.node_group = ng


def make_tree_protos():
    from mathutils import Matrix, noise
    leaf, pine, trunk = MAT["leaf"], MAT["pine"], MAT["trunk"]
    cd = proto_collection("yaprakli")
    cp = proto_collection("cam")
    for k in range(5):
        bm = bmesh.new()
        h = R(2.8, 4.0)
        bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.3, radius2=0.16, depth=h, matrix=Matrix.Translation((0, 0, h / 2)))
        nt0 = len(bm.faces)
        for _ in range(rnd.randint(6, 9)):
            r = R(1.2, 2.2)
            c = Vector((R(-1.4, 1.4), R(-1.4, 1.4), h + R(0.4, 2.8)))
            res = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=r, matrix=Matrix.Translation(c))
            for v in res["verts"]:
                n = (v.co - c).normalized()
                v.co += n * (0.55 * noise.noise(v.co * 0.9 + Vector((k * 7.0, 0, 0))) + 0.25 * noise.noise(v.co * 2.3))
        me = bpy.data.meshes.new(f"agac{k}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(trunk)
        me.materials.append(leaf)
        for i, poly in enumerate(me.polygons):
            poly.material_index = 0 if i < nt0 else 1
            poly.use_smooth = i >= nt0
        cd.objects.link(bpy.data.objects.new(f"agac{k}", me))
    for k in range(4):
        h = R(8, 12)
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=0.25, radius2=0.12, depth=h * 0.4, matrix=Matrix.Translation((0, 0, h * 0.2)))
        nt0 = len(bm.faces)
        for t in range(5):
            z0 = h * (0.22 + 0.14 * t)
            rr = 2.5 * (1 - 0.17 * t) * R(0.9, 1.1)
            res = bmesh.ops.create_cone(bm, cap_ends=True, segments=12, radius1=rr, radius2=rr * 0.12, depth=h * 0.3, matrix=Matrix.Translation((0, 0, z0 + h * 0.15)))
            for v in res["verts"]:
                if v.co.z < z0 + h * 0.05:
                    v.co.x *= 1 + 0.35 * noise.noise(v.co * 1.7)
                    v.co.y *= 1 + 0.35 * noise.noise(v.co * 1.7 + Vector((3, 0, 0)))
                    v.co.z += 0.4 * noise.noise(v.co * 2.1)
        me = bpy.data.meshes.new(f"cam{k}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(trunk)
        me.materials.append(pine)
        for i, poly in enumerate(me.polygons):
            poly.material_index = 0 if i < nt0 else 1
        cp.objects.link(bpy.data.objects.new(f"cam{k}", me))
    return cd, cp


def make_people_cars():
    cpeople = proto_collection("insan")
    cols = [H("2B3340"), H("8C4A2E"), H("4F6B4A"), H("A39C90"), H("3F4A6B")]
    for k, c in enumerate(cols):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, segments=8, radius1=0.22, radius2=0.2, depth=1.35,
                              matrix=__import__("mathutils").Matrix.Translation((0, 0, 0.68)))
        bmesh.ops.create_uvsphere(bm, u_segments=8, v_segments=6, radius=0.13,
                                  matrix=__import__("mathutils").Matrix.Translation((0, 0, 1.55)))
        me = bpy.data.meshes.new(f"insan{k}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(simple(f"giysi{k}", c, 0.8))
        cpeople.objects.link(bpy.data.objects.new(f"insan{k}", me))
    ccars = proto_collection("arac")
    for k, c in enumerate([H("D8D8D6"), H("1E1F21"), H("8E1F1A"), H("2E4A70"), H("8D9094"), H("F0F0EC")]):
        mb = MB()
        mb.box(0, 0, 0.25, 4.4, 1.8, 0.8)
        mb.box(-0.2, 0, 1.05, 2.4, 1.6, 0.6)
        ob = mb.obj(f"arac{k}", simple(f"boya{k}", c, 0.25, 0.8, 0.3))
        COL.objects.unlink(ob)
        bv = ob.modifiers.new("pah", "BEVEL")
        bv.width = 0.15
        bv.segments = 2
        ccars.objects.link(ob)
    return cpeople, ccars


# ------------------------------------------------------------------ sahne
def build():
    t_start = time.time()
    build_terrain()
    poly_obj("alan", plan["site"], MAT["belt"], 0.0)
    zone_mat = {"konut": MAT["pave"], "egitim": MAT["pave"], "ticaret": MAT["pave"], "sosyal": MAT["pave"],
                "ibadet": MAT["stone"], "saglik": MAT["pave"], "spor": MAT["grass"], "teknik": MAT["pave"]}
    for z in plan["zones"]:
        if z["key"] not in ("park", "gol"):
            poly_obj(z["label"], z["pts"], zone_mat[z["key"]], 0.04)
    poly_obj("gol_parki", ell_pts(LK["x"], LK["z"], plan["park"]["rx"], plan["park"]["ry"]), MAT["grass"], 0.03)
    poly_obj("gol", ell_pts(LK["x"], LK["z"], LK["rx"], LK["rz"]), MAT["water"], 0.055)
    ring_obj("kiyi", LK["x"], LK["z"], LK["rx"] + 4.5, LK["rz"] + 4.5, 9, MAT["pave"], 0.08)
    ring_obj("park_yolu", LK["x"], LK["z"], plan["park"]["rx"] * 0.78, plan["park"]["ry"] * 0.8, 3.5, MAT["pave"], 0.06)
    ring_obj("ring", LK["x"], LK["z"], plan["ring"]["rx"], plan["ring"]["ry"], 15, MAT["asphalt"], 0.09)
    strip_obj("giris_yolu", plan["ent"], plan["hub"], 18, MAT["asphalt"], 0.05)
    strip_obj("bag_yolu", plan["hub"], plan["join"], 15, MAT["asphalt"], 0.05)
    poly_obj("kavsak", ell_pts(plan["hub"][0], plan["hub"][1], 12, 12, 32), MAT["asphalt"], 0.11)
    poly_obj("kavsak_giris", ell_pts(plan["ent"][0], plan["ent"][1], 10, 10, 32), MAT["asphalt"], 0.11)
    ex0, ez0 = plan["ent"]
    for k in range(40):
        t0, t1 = k / 40, (k + 1) / 40
        a0 = (ex0 - 600 * t0, ez0 + 480 * t0)
        a1 = (ex0 - 600 * t1, ez0 + 480 * t1)
        mx, my = P((a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2)
        strip_obj("dis_yol", a0, a1, 18, MAT["asphalt"], max(0.05, terrain_h(mx, my) + 0.25))
    # şerit çizgileri (ring yolda kesikli)
    mk = MB()
    n = 260
    for i in range(0, n, 2):
        a = 2 * math.pi * i / n
        x = LK["x"] + plan["ring"]["rx"] * math.cos(a)
        z = LK["z"] + plan["ring"]["ry"] * math.sin(a)
        tx, tz = -plan["ring"]["rx"] * math.sin(a), plan["ring"]["ry"] * math.cos(a)
        x2, y2 = P(x, z)
        mk.box(x2, y2, 0.1, 3.0, 0.18, 0.02, math.atan2(-tz, tx))
    mk.obj("cizgiler", MAT["mark"])

    trees_d, trees_p, people, cars = [], [], [], []

    def tree(x, z, kind=None, y=0.0):
        (trees_p if (kind == "p" or (kind is None and rnd.random() < 0.45)) else trees_d).append((*P(x, z), y))

    # ring yol ağaçları
    for i in range(170):
        a = 2 * math.pi * i / 170
        for off in (-11.5, 11.5):
            x = LK["x"] + (plan["ring"]["rx"] + off) * math.cos(a)
            z = LK["z"] + (plan["ring"]["ry"] + off) * math.sin(a)
            if not in_poly(x, z, Z["Mahalle merkezi"]) and not in_poly(x, z, Z["Kültür merkezi"]):
                tree(x, z, "d")
    # park
    for _ in range(1500):
        a, rr = R(0, 2 * math.pi), math.sqrt(R(0, 1))
        x = LK["x"] + plan["park"]["rx"] * 0.97 * rr * math.cos(a)
        z = LK["z"] + plan["park"]["ry"] * 0.97 * rr * math.sin(a)
        if in_ell(x, z, LK["rx"] + 14, LK["rz"] + 14):
            continue
        e = ((x - LK["x"]) / (plan["park"]["rx"] * 0.78)) ** 2 + ((z - LK["z"]) / (plan["park"]["ry"] * 0.8)) ** 2
        if abs(math.sqrt(e) - 1) < 0.05 or noise2(x * 4, z * 4) < -0.2 or rnd.random() < 0.5:
            continue
        tree(x, z, "d" if rnd.random() < 0.8 else "p")
    for _ in range(420):
        a = R(0, 2 * math.pi)
        x = LK["x"] + (LK["rx"] + 4.5 + R(-3.5, 3.5)) * math.cos(a)
        z = LK["z"] + (LK["rz"] + 4.5 + R(-3.5, 3.5)) * math.sin(a)
        people.append((*P(x, z), 0.08))
    # korunan yamaçlar
    for _ in range(16000):
        x, z = R(-480, 475), R(-335, 325)
        if not in_poly(x, z, plan["site"]) or any(in_poly(x, z, zz["pts"]) for zz in plan["zones"]):
            continue
        if in_ell(x, z, plan["ring"]["rx"] + 16, plan["ring"]["ry"] + 16):
            continue
        if noise2(x * 3, z * 3) < -0.1 and rnd.random() < 0.7 or rnd.random() < 0.4:
            continue
        tree(x, z, "p" if rnd.random() < 0.7 else "d")
    # dış tepeler
    for _ in range(6000):
        a, rr = R(0, 2 * math.pi), R(1.12, 3.4)
        x, y = math.cos(a) * 560 * rr, math.sin(a) * 400 * rr
        if noise2(x * 2.3, y * 2.3) < 0.3:
            continue
        trees_p.append((x, y, terrain_h(x, y)))

    # ---- konut adaları
    def bars_of(cx, cz, w, d):
        dep = 13
        return [(cx, cz - d / 2 + dep / 2, w - 18, dep), (cx, cz + d / 2 - dep / 2, w, dep),
                (cx - w / 2 + dep / 2, cz, dep, d - 2 * dep), (cx + w / 2 - dep / 2, cz - 4, dep, d - 2 * dep - 8)]

    def bar_in(b, Pp):
        x, z, bw, bd = b
        return all(in_poly(a, c, Pp) for a, c in ((x - bw / 2, z - bd / 2), (x + bw / 2, z - bd / 2), (x + bw / 2, z + bd / 2), (x - bw / 2, z + bd / 2)))

    solar, balc, lawn_pts, play = MB(), MB(), [], MB()
    for ni, name in enumerate(["Kuzey mahallesi", "Batı mahallesi", "Doğu mahallesi", "Güney mahallesi"]):
        Pp = Z[name]
        x0, x1, z0, z1 = bbox(Pp)
        W, D, G = 60, 50, 14
        best = None
        for ox in range(0, W + G, 9):
            for oz in range(0, D + G, 8):
                cells = []
                x = x0 + W / 2 + ox - (W + G)
                while x < x1:
                    z = z0 + D / 2 + oz - (D + G)
                    while z < z1:
                        nb = sum(bar_in(b, Pp) for b in bars_of(x, z, W, D))
                        if nb >= 2:
                            cells.append((x, z, nb))
                        z += D + G
                    x += W + G
                sc = sum(c[2] for c in cells)
                if not best or sc > best[0]:
                    best = (sc, cells)
        for (cx, cz, nb) in best[1]:
            bs = bars_of(cx, cz, W, D)
            ok = [bar_in(b, Pp) for b in bs]
            for i, (x, z, bw, bd) in enumerate(bs):
                if not ok[i]:
                    continue
                fl = 5 + (ni % 2) + rnd.randint(0, 2) - (1 if i == 2 else 0)
                h = fl * 3.2
                bx, by = P(x, z)
                retail = i == 1 and rnd.random() < 0.4
                if retail:
                    box_obj("dukkan", MAT["glass"], bx, by, 0, bw - 1.2, bd - 1.2, 4.2)
                    box_obj("konut", MAT["facade"], bx, by, 4.2, bw, bd, h - 4.2)
                else:
                    box_obj("konut", MAT["facade"], bx, by, 0, bw, bd, h)
                balc.box(bx, by, h, bw + 0.5, bd + 0.5, 0.7)  # parapet
                # balkon döşemeleri: uzun cephelerde, avluya bakan tarafta
                if bw > bd:
                    side = 1 if i == 0 else -1
                    for f in range(1, fl):
                        for k in range(int(-bw / 2 + 3), int(bw / 2 - 3), 7):
                            balc.box(bx + k + 1.7, by + side * (bd / 2 + 0.7), f * 3.2 - 0.1, 3.0, 1.4, 0.22)
                if rnd.random() < 0.6:
                    for k in range(int(-max(bw, bd) / 2 + 4), int(max(bw, bd) / 2 - 3), 5):
                        if bw > bd:
                            solar.box(bx + k, by, h + 0.75, 3.6, min(bd - 4, 7), 0.12)
                        else:
                            solar.box(bx, by + k, h + 0.75, min(bw - 4, 7), 3.6, 0.12)
            if sum(ok) >= 3:
                dep = 13
                poly_obj("avlu", [(cx - W / 2 + dep, cz - D / 2 + dep), (cx + W / 2 - dep, cz - D / 2 + dep),
                                  (cx + W / 2 - dep, cz + D / 2 - dep), (cx - W / 2 + dep, cz + D / 2 - dep)], MAT["lawn"], 0.07)
                px, py = P(cx + R(-6, 6), cz + R(-4, 4))
                play.box(px, py, 0.07, 6, 5, 0.12)
                for _ in range(5):
                    tree(cx + R(-W / 2 + dep + 4, W / 2 - dep - 4), cz + R(-D / 2 + dep + 4, D / 2 - dep - 4), "d")
                for _ in range(12):
                    people.append((*P(cx + R(-W / 3, W / 3), cz + R(-D / 4, D / 4)), 0.08))
            for t in range(int(-W / 2), int(W / 2) + 1, 11):
                if in_poly(cx + t, cz - D / 2 - 6, Pp):
                    tree(cx + t, cz - D / 2 - 6, "d")
            # sokakta araçlar
            for _ in range(3):
                cars.append((*P(cx + R(-W / 2, W / 2), cz + D / 2 + 7 + R(-2, 2)), 0.05))
    solar.obj("gunes_panelleri", MAT["solar"])
    balc.obj("balkon_parapet", MAT["white"])
    play.obj("oyun_alanlari", MAT["play"])

    # ---- mahalle merkezi
    x0, x1, z0, z1 = bbox(Z["Mahalle merkezi"])
    nB = 4
    bw = (x1 - x0 - 10 * (nB + 1)) / nB
    cols, canopy = MB(), MB()
    for i in range(nB):
        x = x0 + 10 + bw / 2 + i * (bw + 10)
        z = (z0 + z1) / 2 - 6
        h = 12.8 + (i % 2) * 3.2
        bx, by = P(x, z)
        box_obj("merkez_zemin", MAT["glass"], bx, by, 0, bw - 3, 26, 4.5)
        box_obj("merkez", MAT["ribbon"], bx, by, 4.5, bw, 30, h - 4.5)
        for p in range(int(-bw / 2) + 2, int(bw / 2) - 1, 4):
            cols.box(bx + p, by - 15.3, 0, 0.6, 0.6, 4.5)
        canopy.box(bx, by - 18, 4.5, bw, 6, 0.35)
    cols.obj("kolonlar", MAT["white"])
    canopy.obj("saçak", MAT["woodfloor"])
    for _ in range(220):
        people.append((*P(R(x0 + 5, x1 - 5), R(z1 - 10, z1 + 22)), 0.06))
    # kültür merkezi
    x0, x1, z0, z1 = bbox(Z["Kültür merkezi"])
    cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    bx, by = P(cx, cz)
    box_obj("kultur_cam", MAT["glass"], bx, by - 6, 0, 52, 40, 7, -0.12)
    box_obj("kultur", MAT["wood"], bx - 4, by - 2, 7, 66, 34, 9, -0.12)
    box_obj("kultur_ust", MAT["white"], bx + 10, by + 2, 16.3, 30, 20, 4, -0.12)
    # cami
    x0, x1, z0, z1 = bbox(Z["Cami"])
    cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    bx, by = P(cx, cz)
    box_obj("cami", MAT["white"], bx, by, 0, 30, 30, 9)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=11, location=(bx, by, 9))
    dome = bpy.context.active_object
    bm = bmesh.new()
    bm.from_mesh(dome.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -0.01], context="VERTS")
    bm.to_mesh(dome.data)
    bm.free()
    dome.data.materials.append(MAT["dome"])
    for p in dome.data.polygons:
        p.use_smooth = True
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=1.5, depth=38, location=(bx + 19, by + 12, 19))
    bpy.context.active_object.data.materials.append(MAT["white"])
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=1.8, depth=6, location=(bx + 19, by + 12, 41))
    bpy.context.active_object.data.materials.append(MAT["dome"])

    # ---- okullar
    def pitch(px, pz, w, d):
        bx, by = P(px, pz)
        box_obj("saha", MAT["pitch"], bx, by, 0.05, w, d, 0.06)
        ln = MB()
        for (dx, dy, lw, ld) in ((0, 0, 0.3, d), (0, -d / 2 + 0.2, w, 0.3), (0, d / 2 - 0.2, w, 0.3), (-w / 2 + 0.2, 0, 0.3, d), (w / 2 - 0.2, 0, 0.3, d)):
            ln.box(bx + dx, by + dy, 0.11, lw, ld, 0.02)
        ln.obj("saha_cizgi", MAT["mark"])

    def school(Pp, mat):
        x0, x1, z0, z1 = bbox(Pp)
        w, d = x1 - x0, z1 - z0
        cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
        h = 3 * 3.8
        if w > d:
            box_obj("okul", mat, *P(cx, z0 + 16), 0, w - 30, 16, h)
            box_obj("okul", MAT["ribbon"], *P(x0 + 20, z0 + 8 + d * 0.21 + 8), 0, 16, d * 0.42 - 16, h + 0.4)
            box_obj("okul", MAT["ribbon"], *P(x1 - 20, z0 + 8 + d * 0.21 + 8), 0, 16, d * 0.42 - 16, h - 3.8)
            pitch(cx + 4, z1 - 32, 64, 40)
            box_obj("spor_salonu", MAT["ribbon"], *P(x1 - 22, z1 - 30), 0, 26, 20, 8.5)
        else:
            box_obj("okul", mat, *P(x0 + 22, cz), 0, 18, d - 40, h)
            box_obj("okul", MAT["ribbon"], *P(cx + 15.5, z0 + 18), 0, w - 67, 16, h - 3.8)
            box_obj("okul", MAT["ribbon"], *P(cx + 15.5, cz + 8), 0, w - 67, 16, h + 0.4)
            pitch(cx + 14, z1 - 34, 44, 64)
            box_obj("spor_salonu", MAT["ribbon"], *P(cx + 14, z0 + 52), 0, 30, 22, 9)
        for _ in range(45):
            x, z = R(x0 + 4, x1 - 4), R(z0 + 4, z1 - 4)
            if rnd.random() < 0.5:
                tree(x, z, "d")
        for _ in range(140):
            people.append((*P(R(x0 + 10, x1 - 10), R(z0 + 30, z1 - 10)), 0.06))

    school(Z["Özel okul kampüsü"], MAT["wood"])
    school(Z["Devlet okul kampüsü"], MAT["ribbon"])

    # ---- sağlık, spor, teknik
    x0, x1, z0, z1 = bbox(Z["ASM ve 112"])
    cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    box_obj("asm", MAT["ribbon"], *P(cx, cz - 20), 0, 60, 26, 8)
    box_obj("asm", MAT["ribbon"], *P(cx - 17, cz + 12), 0, 26, 40, 8)
    box_obj("asm_serit", MAT["red"], *P(cx + 29, cz - 20), 6, 2.5, 26.5, 1.2)
    x0, x1, z0, z1 = bbox(Z["Spor kompleksi"])
    cz = (z0 + z1) / 2
    box_obj("spor_salonu", MAT["ribbon"], *P(x0 + 30, cz), 0, 50, 44, 10)
    box_obj("spor_cati", MAT["metal"], *P(x0 + 30, cz), 10, 52, 46, 0.8)
    pitch(x1 - 44, cz, 66, 44)
    x0, x1, z0, z1 = bbox(Z["Teknik altyapı"])
    cx, cz = (x0 + x1) / 2, (z0 + z1) / 2
    box_obj("teknik", MAT["ribbon"], *P(cx - 20, cz - 28), 0, 40, 24, 6)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=9, depth=10, location=(*P(cx + 25, cz - 26), 5))
    bpy.context.active_object.data.materials.append(MAT["white"])
    sp = MB()
    for i in range(6):
        for j in range(4):
            sp.box(*P(cx - 30 + i * 15, cz + 6 + j * 9), 1.2, 14, 5, 0.15)
    sp.obj("gunes_tarlasi", MAT["solar"])

    # ---- göl ayrıntıları
    am = MB()
    for s in range(6):
        r1 = 30 + s * 2.4
        for k in range(24):
            a0 = math.pi * 0.15 + math.pi * 0.7 * k / 24
            x = LK["x"] - 10 + r1 * math.cos(a0 + math.pi)
            z = LK["z"] - LK["rz"] - 2 - r1 * math.sin(a0) * 0.6 + 20
            am.box(*P(x, z), 0, 3.4, 2.4, 0.5 + s * 0.5, -(a0 + math.pi / 2))
    am.obj("amfi", MAT["stone"])
    box_obj("iskele", MAT["woodfloor"], *P(LK["x"] + 20, LK["z"] + LK["rz"] - 12), 0.15, 6, 34, 0.4)
    for _ in range(8):
        a, rr = R(0, 2 * math.pi), R(0.2, 0.75)
        ob = box_obj("tekne", MAT["boat"], *P(LK["x"] + LK["rx"] * rr * math.cos(a), LK["z"] + LK["rz"] * rr * math.sin(a)), 0.05, 4.5, 1.8, 0.7, R(0, 3))
        bv = ob.modifiers.new("pah", "BEVEL")
        bv.width = 0.4
        bv.segments = 3
    for t in (-0.35, 0.25, 0.75):
        a = math.pi / 2 + t
        x = LK["x"] + (LK["rx"] + 22) * math.cos(a)
        z = LK["z"] + (LK["rz"] + 20) * math.sin(a)
        box_obj("kafe", MAT["wood"], *P(x, z), 0, 16, 9, 4.2, a - math.pi / 2)
        box_obj("kafe_cati", MAT["white"], *P(x, z), 4.2, 19, 12, 0.5, a - math.pi / 2)

    # ---- servis ve aktarma istasyonu
    hx, hz = plan["hub"]
    ex, ez = plan["ent"]
    a = math.atan2(-(hz - ez), hx - ex)  # Blender düzleminde yön
    sx, sz = hx - 19.6, hz - 17.1
    SX, SY = P(sx, sz)
    poly_obj("istasyon_meydani", ell_pts(sx, sz, 46, 46, 64), MAT["pave"], 0.07)
    col = MB()
    for i in range(-2, 3):
        px, py = SX + math.cos(a) * i * 13, SY + math.sin(a) * i * 13
        for sgn in (-1, 1):
            col.box(px - math.sin(a) * 6 * sgn, py + math.cos(a) * 6 * sgn, 0, 0.5, 0.5, 5.2)
    col.obj("istasyon_kolon", MAT["metal"])
    box_obj("istasyon_ortu", MAT["woodfloor"], SX, SY, 5.2, 66, 16, 0.6, a)
    box_obj("istasyon_panel", MAT["solar"], SX, SY, 5.85, 62, 14, 0.15, a)
    for i in range(5):
        t = (i - 2) * 13.5
        side = 1 if i % 2 else -1
        bx = SX + math.cos(a) * t - math.sin(a) * 11 * side
        by = SY + math.sin(a) * t + math.cos(a) * 11 * side
        ob = box_obj("otobus", MAT["bus"], bx, by, 0.35, 12, 2.55, 3.0, a)
        ob.modifiers.new("pah", "BEVEL").width = 0.2
        box_obj("otobus_cam", MAT["busband"], bx, by, 1.4, 12.05, 2.6, 1.1, a)
    for _ in range(80):
        people.append((SX + R(-25, 25) * math.cos(a), SY + R(-25, 25) * math.sin(a) + R(-4, 4), 0.08))
    # ring yolda araçlar
    for i in range(70):
        aa = R(0, 2 * math.pi)
        off = rnd.choice((-3.5, 3.5))
        x = LK["x"] + (plan["ring"]["rx"] + off) * math.cos(aa)
        z = LK["z"] + (plan["ring"]["ry"] + off) * math.sin(aa)
        cars.append((*P(x, z), 0.1))

    # ---- kamera ve ağaç temizliği
    S = SHOTS[A.shot]
    cxy = Vector(S["pos"][:2])
    stc = Vector((SX, SY))

    def keep(p):
        v = Vector(p[:2])
        return (v - cxy).length > 50 and (v - stc).length > 58

    trees_d[:] = [p for p in trees_d if keep(p)]
    trees_p[:] = [p for p in trees_p if keep(p)]
    cd, cp = make_tree_protos()
    cpe, cca = make_people_cars()
    scatter("agaclar_yaprakli", trees_d, cd, 0.85, 1.25, seed=3)
    scatter("agaclar_cam", trees_p, cp, 0.8, 1.3, seed=5)
    scatter("insanlar", people, cpe, 0.9, 1.1, seed=7)
    scatter("araclar", cars, cca, 1.0, 1.0, seed=9)
    print(f"sahne kuruldu: {time.time() - t_start:.0f} sn; ağaç {len(trees_d) + len(trees_p)}, insan {len(people)}, araç {len(cars)}")


# kameralar (Blender koordinatları; three.js sahnesiyle aynı bakışlar)
SHOTS = {
    "genel": {"pos": (-760, -820, 560), "look": (20, 20, 0), "fov": 30},
    "gol": {"pos": (70, -150, 46), "look": (15, 135, 6), "fov": 40},
    "okul": {"pos": (-560, 340, 150), "look": (-250, 50, 0), "fov": 34},
    "konut": {"pos": (445, -35, 62), "look": (330, 115, 0), "fov": 46},
    "istasyon": {"pos": (-168, -236, 30), "look": (-240, -168, 2), "fov": 44},
}


def setup_render():
    sc = SC
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = A.samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.cycles.max_bounces = 6
    sc.cycles.diffuse_bounces = 3
    sc.cycles.glossy_bounces = 3
    sc.cycles.transmission_bounces = 4
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.resolution_x, sc.render.resolution_y = RX, RY
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = False
    sc.view_settings.view_transform = "AgX"
    try:
        sc.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        pass
    sc.view_settings.exposure = -0.35
    # gökyüzü
    w = bpy.data.worlds.new("gok")
    sc.world = w
    w.use_nodes = True
    nt = w.node_tree
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "NISHITA"
    sky.sun_elevation = math.radians(27)
    sky.sun_rotation = math.radians(215)
    sky.air_density = 1.4
    sky.dust_density = 1.0
    sky.ozone_density = 1.0
    sky.sun_intensity = 0.55
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = 0.22
    nt.links.new(sky.outputs[0], bg.inputs[0])
    # hafif atmosfer pusu (uzak tepelerde derinlik)
    S = SHOTS[A.shot]
    cam = bpy.data.objects.new("kamera", bpy.data.cameras.new("kamera"))
    COL.objects.link(cam)
    sc.camera = cam
    cam.data.sensor_fit = "VERTICAL"
    cam.data.angle_y = math.radians(S["fov"])
    cam.data.clip_end = 12000
    cam.location = S["pos"]
    d = Vector(S["look"]) - Vector(S["pos"])
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = A.out


build()
setup_render()
if A.blend:
    bpy.ops.wm.save_as_mainfile(filepath=A.blend)
t = time.time()
bpy.ops.render.render(write_still=True)
print(f"render: {time.time() - t:.0f} sn -> {A.out}")
