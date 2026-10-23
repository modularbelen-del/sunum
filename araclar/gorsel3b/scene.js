// Kahramankazan Uydukent: kavramsal 3B görseller (beyaz maket estetiği).
// Plan geometrisi plan.json'dan (araclar/schema.py ile aynı bölgeler; 1 birim = 1 m; x doğu, z = şema y).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const plan = await (await fetch('plan.json')).json();
const Q = new URLSearchParams(location.search);
const SHOT = Q.get('shot') || 'genel';

// ---------- yardımcılar ----------
let seed = 7;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const R = (a, b) => a + (b - a) * rnd();
function inPoly(x, z, pts) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i], [xj, zj] = pts[j];
    if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) c = !c;
  }
  return c;
}
const Z = Object.fromEntries(plan.zones.map((z) => [z.label, z.pts]));
const bbox = (pts) => { const xs = pts.map((p) => p[0]), zs = pts.map((p) => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)]; };
const LAKE = { x: plan.lake.c[0], z: plan.lake.c[1], rx: plan.lake.rx, rz: plan.lake.ry };
const inEll = (x, z, rx, rz, cx = LAKE.x, cz = LAKE.z) => ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 < 1;

const scene = new THREE.Scene();
const M = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.88, metalness: 0 }, o));
const MAT = {
  wall: M(0xf3efe7), wall2: M(0xe9e2d4), roof: M(0xe2ddd2), glass: M(0x4d6473, { roughness: 0.18, metalness: 0.25 }),
  wood: M(0xb68152, { roughness: 0.75 }), stone: M(0xd9cdb5), pave: M(0xe6dfcf), pave2: M(0xd5cdbb), asphalt: M(0x9d9c97),
  grass: M(0x93b96b), grass2: M(0xa5c27e), belt: M(0xa9ad7b), field: M(0x6da657), track: M(0xb5593f), line: M(0xffffff),
  water: M(0x3d8cc2, { roughness: 0.06, metalness: 0.3 }), tree: M(0x5f7d4f), tree2: M(0x748f58), pine: M(0x46634a), trunk: M(0x7a5c43),
  solar: M(0x2e4a66, { roughness: 0.3, metalness: 0.4 }), bus: M(0xf6f6f4, { roughness: 0.5 }), busband: M(0x0b2e4f), red: M(0xc0453b),
  play: M(0xd9a441), play2: M(0x3e7cb1), people: M(0x2f3a45), people2: M(0x9a5418), people3: M(0x6b8f5e), boat: M(0xfafafa),
};
const meshes = [];
function facadeTex(kind) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = kind === 'wood' ? '#b98756' : '#f2eee6'; g.fillRect(0, 0, 256, 256);
  if (kind === 'ribbon') { g.fillStyle = '#566f80'; g.fillRect(0, 70, 256, 120); g.fillStyle = '#e9e4da'; for (let x = 0; x < 256; x += 64) g.fillRect(x, 70, 6, 120); }
  else if (kind === 'wood') { g.fillStyle = '#9c6c41'; for (let x = 0; x < 256; x += 16) g.fillRect(x, 0, 3, 256); g.fillStyle = '#4f6676'; g.fillRect(40, 60, 176, 150); }
  else { g.fillStyle = '#5b7383'; g.fillRect(52, 62, 152, 140); g.fillStyle = '#d9d2c4'; g.fillRect(40, 196, 176, 14); g.fillStyle = '#e8e2d6'; g.fillRect(126, 62, 5, 140); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const FAC = { punch: M(0xffffff, { map: facadeTex('punch') }), ribbon: M(0xffffff, { map: facadeTex('ribbon'), roughness: 0.6 }), wood: M(0xffffff, { map: facadeTex('wood') }) };
function fbox(w, h, d, style, x, y0, z, ry = 0, mod = 3.4, fh = 3.2) {
  const g = new THREE.BoxGeometry(w, h, d); const uv = g.attributes.uv;
  // yüz sırası: +x, -x, +y, -y, +z, -z (her biri 4 köşe)
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * Math.max(1, Math.round(dims[f][0] / mod)), uv.getY(i) * Math.max(1, Math.round(dims[f][1] / fh))); }
  const mat = FAC[style];
  return add(g, [mat, mat, MAT.roof, MAT.roof, mat, mat], x, y0 + h / 2, z, ry);
}
function add(geo, mat, x = 0, y = 0, z = 0, ry = 0) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.y = ry;
  m.castShadow = true; m.receiveShadow = true; scene.add(m); meshes.push(m); return m;
}
function box(w, h, d, mat, x, y0, z, ry = 0) { return add(new THREE.BoxGeometry(w, h, d), mat, x, y0 + h / 2, z, ry); }
function flat(pts, mat, y) {
  const s = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
  const g = new THREE.ShapeGeometry(s); g.rotateX(-Math.PI / 2);
  const m = add(g, mat, 0, y, 0); m.castShadow = false; return m;
}
function ellipsePts(cx, cz, rx, rz, n = 96) { return Array.from({ length: n }, (_, i) => [cx + rx * Math.cos(2 * Math.PI * i / n), cz + rz * Math.sin(2 * Math.PI * i / n)]); }
function ring(cx, cz, rx, rz, w, mat, y) {
  const outer = new THREE.Shape(ellipsePts(cx, cz, rx + w / 2, rz + w / 2).map(([x, z]) => new THREE.Vector2(x, -z)));
  const hole = new THREE.Path(ellipsePts(cx, cz, rx - w / 2, rz - w / 2).reverse().map(([x, z]) => new THREE.Vector2(x, -z)));
  outer.holes.push(hole);
  const g = new THREE.ShapeGeometry(outer); g.rotateX(-Math.PI / 2);
  const m = add(g, mat, 0, y, 0); m.castShadow = false; return m;
}
function strip(a, b, w, mat, y) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
  const g = new THREE.PlaneGeometry(L, w); g.rotateX(-Math.PI / 2);
  const m = add(g, mat, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, -Math.atan2(dz, dx)); m.castShadow = false; return m;
}

// ---------- ağaçlar ve insanlar (instanced) ----------
const trees = { round: [], pine: [] };
function tree(x, z, kind = rnd() < 0.55 ? 'round' : 'pine', s = R(0.8, 1.25), y = 0) { trees[kind].push([x, y, z, s]); }
const people = [];
function person(x, z, y = 0) { people.push([x, y, z]); }
function flushInstances() {
  const mk = (geo, mat, list, f) => {
    if (!list.length) return;
    const im = new THREE.InstancedMesh(geo, mat, list.length); const o = new THREE.Object3D();
    list.forEach((p, i) => { f(o, p); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
    im.castShadow = true; im.receiveShadow = true; scene.add(im);
  };
  const crown = new THREE.IcosahedronGeometry(3.4, 1), cone = new THREE.ConeGeometry(2.6, 9, 8), trunk = new THREE.CylinderGeometry(0.28, 0.36, 3, 6);
  mk(crown, MAT.tree, trees.round.filter((_, i) => i % 2 === 0), (o, [x, y, z, s]) => { o.position.set(x, y + 5.6 * s, z); o.scale.set(s, s * 1.08, s); o.rotation.set(0, x, 0); });
  mk(crown, MAT.tree2, trees.round.filter((_, i) => i % 2 === 1), (o, [x, y, z, s]) => { o.position.set(x, y + 5.6 * s, z); o.scale.set(s, s * 1.08, s); o.rotation.set(0, z, 0); });
  mk(cone, MAT.pine, trees.pine, (o, [x, y, z, s]) => { o.position.set(x, y + 6.8 * s, z); o.scale.set(s, s, s); o.rotation.set(0, 0, 0); });
  mk(trunk, MAT.trunk, [...trees.round, ...trees.pine], (o, [x, y, z, s]) => { o.position.set(x, y + 1.5 * s, z); o.scale.set(s, s, s); o.rotation.set(0, 0, 0); });
  const body = new THREE.CapsuleGeometry(0.28, 1.1, 2, 6);
  [MAT.people, MAT.people2, MAT.people3].forEach((mat, k) => mk(body, mat, people.filter((_, i) => i % 3 === k), (o, [x, y, z]) => { o.position.set(x, y + 0.85, z); o.scale.set(1, 1, 1); o.rotation.set(0, 0, 0); }));
}

// ---------- zemin: arazi ve tarlalar ----------
function noise(x, z) { return Math.sin(x * 0.004 + 1.3) * Math.cos(z * 0.005 - 0.7) + 0.5 * Math.sin(x * 0.011 - z * 0.008) + 0.25 * Math.cos(x * 0.023 + z * 0.019); }
{
  const S = 6000, N = 240;
  const g = new THREE.PlaneGeometry(S, S, N, N); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const r = Math.sqrt((x / 560) ** 2 + (z / 400) ** 2);
    let h = 0;
    if (r > 1.02) h = Math.min((r - 1.02) * 70, 55) * (0.7 + 0.3 * noise(x, z));
    h += r > 1.1 ? noise(x * 1.7, z * 1.7) * 14 * Math.min(1, (r - 1.1) * 2) : 0;
    pos.setY(i, h - 1.2);
  }
  g.computeVertexNormals();
  const cv = document.createElement('canvas'); cv.width = cv.height = 4096; const cx2 = cv.getContext('2d');
  cx2.fillStyle = '#cdb98b'; cx2.fillRect(0, 0, 4096, 4096);
  const tones = ['#d6c59b', '#cfbc8c', '#c8b585', '#c2b183', '#d1c092', '#bdb184', '#cab68a'];
  cx2.save(); cx2.translate(2048, 2048); cx2.rotate(0.35);
  for (let u = -40; u < 40; u++) for (let v = -40; v < 40; v++) {
    const t = Math.abs(Math.sin(u * 12.9898 + v * 78.233) * 43758.5453) % 1;
    const fw = 96, fh = 64; const x = u * fw, y = v * fh;
    cx2.fillStyle = tones[Math.floor(t * tones.length)]; cx2.fillRect(x + 1.5, y + 1.5, fw - 3, fh - 3);
    cx2.strokeStyle = 'rgba(120,100,60,0.08)'; cx2.lineWidth = 1;
    for (let k = 4; k < (t > 0.5 ? fw : fh); k += 4) { cx2.beginPath(); if (t > 0.5) { cx2.moveTo(x + k, y + 2); cx2.lineTo(x + k, y + fh - 2); } else { cx2.moveTo(x + 2, y + k); cx2.lineTo(x + fw - 2, y + k); } cx2.stroke(); }
  }
  cx2.restore();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95 })); m.receiveShadow = true; scene.add(m);
  // tepelerde dağınık çam kümeleri
  for (let k = 0; k < 1600; k++) {
    const a = R(0, Math.PI * 2), rr = R(1.15, 3.2);
    const x = Math.cos(a) * 560 * rr, z = Math.sin(a) * 400 * rr;
    if (noise(x * 2.3, z * 2.3) < 0.35) continue;
    const r = Math.sqrt((x / 560) ** 2 + (z / 400) ** 2);
    const h = Math.min((r - 1.02) * 70, 55) * (0.7 + 0.3 * noise(x, z)) + (r > 1.1 ? noise(x * 1.7, z * 1.7) * 14 * Math.min(1, (r - 1.1) * 2) : 0) - 1.2;
    tree(x, z, 'pine', R(0.9, 1.4), h);
  }
}

// ---------- alan: yeşil kuşak ve bölgeler ----------
flat(plan.site, MAT.belt, 0.02);
const zoneMat = { konut: MAT.pave, egitim: MAT.pave2, ticaret: MAT.pave, sosyal: MAT.pave, ibadet: MAT.stone, saglik: MAT.pave2, spor: MAT.grass2, teknik: MAT.pave2 };
plan.zones.forEach((z) => { if (z.key !== 'park' && z.key !== 'gol') flat(z.pts, zoneMat[z.key], 0.06); });
// göl parkı, gölet ve kıyı
flat(ellipsePts(LAKE.x, LAKE.z, plan.park.rx, plan.park.ry), MAT.grass, 0.05);
flat(ellipsePts(LAKE.x, LAKE.z, LAKE.rx, LAKE.rz), MAT.water, 0.1);
ring(LAKE.x, LAKE.z, LAKE.rx + 5, LAKE.rz + 5, 10, MAT.pave, 0.13);
ring(LAKE.x, LAKE.z, plan.park.rx * 0.78, plan.park.ry * 0.8, 3.5, MAT.pave2, 0.09);
ring(LAKE.x, LAKE.z, plan.ring.rx, plan.ring.ry, 15, MAT.asphalt, 0.1);
strip(plan.ent, plan.hub, 18, MAT.asphalt, 0.1); strip(plan.hub, plan.join, 15, MAT.asphalt, 0.1);
strip([plan.ent[0] - 300, plan.ent[1] + 240], plan.ent, 18, MAT.asphalt, 0.0);
// ring yol ağaçları
for (let i = 0; i < 150; i++) {
  const a = i / 150 * Math.PI * 2;
  for (const off of [-11.5, 11.5]) {
    const x = LAKE.x + (plan.ring.rx + off) * Math.cos(a), z = LAKE.z + (plan.ring.ry + off) * Math.sin(a);
    if (!inPoly(x, z, Z['Mahalle merkezi']) && !inPoly(x, z, Z['Kültür merkezi'])) tree(x, z, 'round', R(0.85, 1.05));
  }
}
// park ağaçları ve kafeler
for (let k = 0; k < 900; k++) {
  const a = R(0, Math.PI * 2), rr = Math.sqrt(R(0.0, 1));
  const x = LAKE.x + plan.park.rx * 0.97 * rr * Math.cos(a), z = LAKE.z + plan.park.ry * 0.97 * rr * Math.sin(a);
  if (inEll(x, z, LAKE.rx + 14, LAKE.rz + 14)) continue;
  const e = ((x - LAKE.x) / (plan.park.rx * 0.78)) ** 2 + ((z - LAKE.z) / (plan.park.ry * 0.8)) ** 2;
  if (Math.abs(Math.sqrt(e) - 1) < 0.04) continue;
  if (noise(x * 4, z * 4) < -0.2 || rnd() < 0.45) continue;
  tree(x, z, rnd() < 0.8 ? 'round' : 'pine');
}
for (let i = 0; i < 260; i++) {
  const a = R(0, Math.PI * 2); const x = LAKE.x + (LAKE.rx + 6 + R(-3, 3)) * Math.cos(a), z = LAKE.z + (LAKE.rz + 6 + R(-3, 3)) * Math.sin(a); person(x, z);
}
// kafe pavyonları (güney kıyı), iskele, tekneler, amfi (kuzey kıyı)
[[-0.35, 0], [0.25, 0], [0.75, 0]].forEach(([t]) => {
  const a = Math.PI / 2 + t; const x = LAKE.x + (LAKE.rx + 22) * Math.cos(a), z = LAKE.z + (LAKE.rz + 20) * Math.sin(a);
  box(16, 4.2, 9, MAT.wood, x, 0, z, -a + Math.PI / 2); box(19, 0.5, 12, MAT.roof, x, 4.2, z, -a + Math.PI / 2);
});
box(6, 0.6, 34, MAT.wood, LAKE.x + 20, 0.12, LAKE.z + LAKE.rz - 12);
for (let i = 0; i < 7; i++) {
  const a = R(0, Math.PI * 2), rr = R(0.2, 0.75); box(4.5, 0.9, 1.8, MAT.boat, LAKE.x + LAKE.rx * rr * Math.cos(a), 0.1, LAKE.z + LAKE.rz * rr * Math.sin(a), R(0, 3));
}
for (let s = 0; s < 6; s++) {
  const g = new THREE.CylinderGeometry(30 + s * 2.4, 30 + s * 2.4, 0.5 + s * 0.5, 48, 1, false, Math.PI * 0.15, Math.PI * 0.7);
  add(g, MAT.stone, LAKE.x - 10, (0.5 + s * 0.5) / 2, LAKE.z - LAKE.rz - 2, Math.PI);
}
// kuşak ağaçları (korunan yamaçlar)
for (let k = 0; k < 9000; k++) {
  const x = R(-480, 475), z = R(-335, 325);
  if (!inPoly(x, z, plan.site)) continue;
  if (plan.zones.some((zz) => inPoly(x, z, zz.pts))) continue;
  if (inEll(x, z, plan.ring.rx + 16, plan.ring.ry + 16)) continue;
  if (noise(x * 3, z * 3) < -0.1 && rnd() < 0.7) continue;
  if (rnd() < 0.45) continue;
  tree(x, z, rnd() < 0.7 ? 'pine' : 'round', R(0.8, 1.3));
}

// ---------- konut adaları ----------
function blockBars(cx, cz, w, d) {
  const dep = 13;
  return [
    [cx, cz - d / 2 + dep / 2, w - 18, dep], [cx, cz + d / 2 - dep / 2, w, dep],
    [cx - w / 2 + dep / 2, cz, dep, d - 2 * dep], [cx + w / 2 - dep / 2, cz - 4, dep, d - 2 * dep - 8],
  ];
}
const barInside = ([x, z, bw, bd], P) => [[x - bw / 2, z - bd / 2], [x + bw / 2, z - bd / 2], [x + bw / 2, z + bd / 2], [x - bw / 2, z + bd / 2]].every(([a, b]) => inPoly(a, b, P));
function housingBlock(cx, cz, w, d, floorsBase, retail, P) {
  const dep = 13;
  const bars = blockBars(cx, cz, w, d);
  const ok = bars.map((b) => barInside(b, P));
  bars.forEach(([x, z, bw, bd], i) => {
    if (!ok[i]) return;
    const fl = floorsBase + Math.floor(R(0, 3)) - (i === 2 ? 1 : 0); const h = fl * 3.2;
    if (retail && i === 1) { box(bw - 1.2, 4.2, bd - 1.2, MAT.glass, x, 0, z); fbox(bw, h - 4.2, bd, 'punch', x, 4.2, z); }
    else fbox(bw, h, bd, 'punch', x, 0, z);
    box(bw + 0.4, 0.6, bd + 0.4, MAT.roof, x, h, z);
    if (rnd() < 0.5) for (let p = -Math.max(bw, bd) / 2 + 4; p < Math.max(bw, bd) / 2 - 3; p += 5) box(bw > bd ? 3.6 : Math.min(bw - 4, 7), 0.25, bw > bd ? Math.min(bd - 4, 7) : 3.6, MAT.solar, x + (bw > bd ? p : 0), h + 0.8, z + (bw > bd ? 0 : p));
  });
  if (ok.filter(Boolean).length >= 3) {
    flat([[cx - w / 2 + dep, cz - d / 2 + dep], [cx + w / 2 - dep, cz - d / 2 + dep], [cx + w / 2 - dep, cz + d / 2 - dep], [cx - w / 2 + dep, cz + d / 2 - dep]], MAT.grass2, 0.12);
    box(6, 0.15, 5, MAT.play, cx + R(-6, 6), 0.12, cz + R(-4, 4)); box(4, 0.15, 4, MAT.play2, cx + R(-8, 8), 0.12, cz + R(-4, 4));
    for (let t = 0; t < 5; t++) tree(cx + R(-w / 2 + dep + 4, w / 2 - dep - 4), cz + R(-d / 2 + dep + 4, d / 2 - dep - 4), 'round', R(0.7, 1.0));
    for (let p = 0; p < 10; p++) person(cx + R(-w / 3, w / 3), cz + R(-d / 4, d / 4), 0.12);
  }
  return ok.filter(Boolean).length;
}
['Kuzey mahallesi', 'Batı mahallesi', 'Doğu mahallesi', 'Güney mahallesi'].forEach((name, ni) => {
  const P = Z[name], [x0, x1, z0, z1] = bbox(P);
  const W = 60, D = 50, G = 14;
  let best = null;
  for (let ox = 0; ox < W + G; ox += 9) for (let oz = 0; oz < D + G; oz += 8) {
    const cells = [];
    for (let x = x0 + W / 2 + ox - (W + G); x < x1; x += W + G) for (let z = z0 + D / 2 + oz - (D + G); z < z1; z += D + G) {
      const n = blockBars(x, z, W, D).filter((b) => barInside(b, P)).length;
      if (n >= 2) cells.push([x, z, n]);
    }
    const score = cells.reduce((a, c) => a + c[2], 0);
    if (!best || score > best.score) best = { score, cells };
  }
  best.cells.forEach(([x, z]) => {
    housingBlock(x, z, W, D, 5 + (ni % 2), rnd() < 0.35, P);
    for (let t = -W / 2; t <= W / 2; t += 11) if (inPoly(x + t, z - D / 2 - 6, P)) tree(x + t, z - D / 2 - 6, 'round', 0.8);
  });
});

// ---------- mahalle merkezi, kültür merkezi, cami ----------
{
  const [x0, x1, z0, z1] = bbox(Z['Mahalle merkezi']);
  const n = 4, bw = (x1 - x0 - 10 * (n + 1)) / n;
  for (let i = 0; i < n; i++) {
    const x = x0 + 10 + bw / 2 + i * (bw + 10), z = (z0 + z1) / 2 - 6;
    const h = 12.8 + (i % 2) * 3.2;
    box(bw - 3, 4.5, 26, MAT.glass, x, 0, z); fbox(bw, h - 4.5, 30, 'ribbon', x, 4.5, z, 0, 4, 4.1); box(bw + 0.5, 0.6, 30.5, MAT.roof, x, h, z);
    for (let p = -bw / 2 + 2; p <= bw / 2 - 2; p += 4) box(0.6, 4.5, 0.6, MAT.wall2, x + p, 0, z + 15.5);
    box(bw, 0.5, 6, MAT.wood, x, 4.5, z + 18);
  }
  for (let p = 0; p < 160; p++) person(R(x0 + 5, x1 - 5), R(z1 - 12, z1 + 22), 0.06);
}
{
  const [x0, x1, z0, z1] = bbox(Z['Kültür merkezi']); const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  box(52, 7, 40, MAT.glass, cx, 0, cz + 6, 0.12); fbox(66, 9, 34, 'wood', cx - 4, 7, cz + 2, 0.12, 3, 9); box(68, 0.6, 36, MAT.roof, cx - 4, 16, cz + 2, 0.12);
  box(30, 4, 20, MAT.wall, cx + 10, 16.6, cz - 2, 0.12);
}
{
  const [x0, x1, z0, z1] = bbox(Z['Cami']); const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  box(30, 9, 30, MAT.wall, cx, 0, cz); add(new THREE.SphereGeometry(11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.wall2, cx, 9, cz);
  add(new THREE.CylinderGeometry(1.5, 1.7, 36, 16), MAT.wall, cx + 19, 18, cz - 12); add(new THREE.ConeGeometry(1.8, 6, 16), MAT.roof, cx + 19, 39, cz - 12);
  flat([[x0, z0], [x1, z0], [x1, z1], [x0, z1]], MAT.stone, 0.07);
}

// ---------- okullar ----------
function pitch(x, z, w, d, ry = 0) {
  box(w, 0.12, d, MAT.field, x, 0.06, z, ry);
  const L = [[0, 0, 0.35, d], [0, -d / 2 + 0.2, w, 0.35], [0, d / 2 - 0.2, w, 0.35], [-w / 2 + 0.2, 0, 0.35, d], [w / 2 - 0.2, 0, 0.35, d]];
  L.forEach(([dx, dz, lw, ld]) => box(lw, 0.14, ld, MAT.line, x + dx * Math.cos(ry) + dz * Math.sin(ry), 0.06, z - dx * Math.sin(ry) + dz * Math.cos(ry), ry));
}
function school(P, floors, mat) {
  const [x0, x1, z0, z1] = bbox(P); const w = x1 - x0, d = z1 - z0; const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const h = floors * 3.8;
  if (w > d) { // yatay kampüs: kuzeyde U bina, güneyde saha
    fbox(w - 30, h, 16, mat, cx, 0, z0 + 16, 0, 4, 3.8); fbox(16, h, d * 0.42, 'ribbon', x0 + 20, 0, z0 + 16 + d * 0.21 - 8, 0, 4, 3.8); fbox(16, h - 3.8, d * 0.42, 'ribbon', x1 - 20, 0, z0 + 16 + d * 0.21 - 8, 0, 4, 3.8);
    box(w - 30.5, 0.6, 16.4, MAT.roof, cx, h, z0 + 16);
    pitch(cx + 4, z1 - 32, 64, 40); box(26, 8.5, 20, MAT.wall2, x1 - 22, 0, z1 - 30);
  } else { // dikey kampüs
    fbox(18, h, d - 40, mat, x0 + 22, 0, cz, 0, 4, 3.8); fbox(w - 48, h - 3.8, 16, 'ribbon', cx + 6, 0, z0 + 18, 0, 4, 3.8); fbox(w - 48, h, 16, 'ribbon', cx + 6, 0, cz + 8, 0, 4, 3.8);
    box(18.4, 0.6, d - 39.6, MAT.roof, x0 + 22, h, cz);
    pitch(cx + 14, z1 - 34, 44, 64, 0); box(30, 9, 22, MAT.wall2, cx + 14, 0, z0 + 52);
  }
  for (let t = 0; t < 45; t++) { const x = R(x0 + 4, x1 - 4), z = R(z0 + 4, z1 - 4); if (rnd() < 0.5) tree(x, z, 'round', 0.85); }
  for (let p = 0; p < 140; p++) person(R(x0 + 10, x1 - 10), R(z0 + 30, z1 - 10), 0.06);
}
school(Z['Özel okul kampüsü'], 3, 'wood');
school(Z['Devlet okul kampüsü'], 3, 'ribbon');

// ---------- sağlık, spor, teknik ----------
{
  const [x0, x1, z0, z1] = bbox(Z['ASM ve 112']); const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  fbox(60, 8, 26, 'ribbon', cx, 0, cz - 20, 0, 4, 4); fbox(26, 8, 40, 'ribbon', cx - 17, 0, cz + 12, 0, 4, 4); box(60.4, 0.6, 26.4, MAT.roof, cx, 8, cz - 20);
  box(3, 1.2, 26.5, MAT.red, cx + 29, 6, cz - 20); box(18, 0.5, 12, MAT.roof, cx + 18, 4.5, cz + 14);
}
{
  const [x0, x1, z0, z1] = bbox(Z['Spor kompleksi']); const cz = (z0 + z1) / 2;
  const g = new THREE.CylinderGeometry(30, 30, 50, 32, 1, false, -Math.PI / 2, Math.PI); g.rotateZ(Math.PI / 2); g.scale(1, 0.4, 0.9);
  add(g, MAT.wall, x0 + 30, 0, cz); box(50, 3, 54, MAT.glass, x0 + 30, 0, cz);
  pitch(x1 - 44, cz, 66, 44);
}
{
  const [x0, x1, z0, z1] = bbox(Z['Teknik altyapı']); const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  box(40, 6, 24, MAT.wall2, cx - 20, 0, cz - 28); add(new THREE.CylinderGeometry(9, 9, 10, 32), MAT.wall, cx + 25, 5, cz - 26);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const p = add(new THREE.BoxGeometry(14, 0.3, 5), MAT.solar, cx - 30 + i * 15, 1.4, cz + 6 + j * 9); p.rotation.x = -0.35; }
}

// ---------- servis ve aktarma istasyonu, elektrikli otobüsler ----------
{
  const [hx, hz] = plan.hub, [ex, ez] = plan.ent; const a = Math.atan2(hz - ez, hx - ex);
  const ox = Math.sin(a) * 26, oz = -Math.cos(a) * 26;
  const sx = hx + ox, sz = hz + oz;
  flat(ellipsePts(sx, sz, 46, 46, 48).map(([x, z]) => [x, z]), MAT.pave, 0.09);
  for (let i = -2; i <= 2; i++) {
    const px = sx + Math.cos(a) * i * 13, pz = sz + Math.sin(a) * i * 13;
    box(0.6, 5.2, 0.6, MAT.wall2, px - Math.sin(a) * 6, 0, pz + Math.cos(a) * 6); box(0.6, 5.2, 0.6, MAT.wall2, px + Math.sin(a) * 6, 0, pz - Math.cos(a) * 6);
  }
  box(66, 0.7, 16, MAT.wood, sx, 5.2, sz, -a); box(62, 0.3, 14, MAT.solar, sx, 5.95, sz, -a);
  for (let i = 0; i < 5; i++) {
    const t = (i - 2) * 13.5, side = i % 2 ? 1 : -1;
    const bx = sx + Math.cos(a) * t + Math.sin(a) * 11 * side, bz = sz + Math.sin(a) * t - Math.cos(a) * 11 * side;
    box(12, 3.2, 2.55, MAT.bus, bx, 0.35, bz, -a); box(12.05, 0.9, 2.6, MAT.busband, bx, 1.3, bz, -a); box(11.2, 0.25, 2.2, MAT.solar, bx, 3.6, bz, -a);
  }
  for (let p = 0; p < 70; p++) person(sx + R(-25, 25), sz + R(-5, 5), 0.09);
  // yolda elektrikli otobüs
  const mx = (plan.ent[0] * 0.3 + hx * 0.7), mz = (plan.ent[1] * 0.3 + hz * 0.7);
  box(12, 3.2, 2.55, MAT.bus, mx + Math.sin(a) * 4, 0.35, mz - Math.cos(a) * 4, -a); box(12.05, 0.9, 2.6, MAT.busband, mx + Math.sin(a) * 4, 1.3, mz - Math.cos(a) * 4, -a);
}
{
  const camXZ = { genel: [-760, 820], gol: [70, 150], okul: [-560, -340], konut: [445, 35], istasyon: [-168, 236] }[SHOT];
  const [hx, hz] = plan.hub, [ex, ez] = plan.ent;
  const segD = (px, pz, a, b) => { const dx = b[0] - a[0], dz = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz))); return Math.hypot(px - a[0] - t * dx, pz - a[1] - t * dz); };
  const keep = ([x, , z]) => Math.hypot(x - camXZ[0], z - camXZ[1]) > 45 && Math.hypot(x - (hx - 19.6), z - (hz - 17.1)) > 58 && segD(x, z, [ex - 300, ez + 240], [hx, hz]) > 13 && segD(x, z, plan.hub, plan.join) > 11;
  trees.round = trees.round.filter(keep); trees.pine = trees.pine.filter(keep);
}
flushInstances();

// ---------- ışık, kamera, render ----------
const SHOTS = {
  genel: { pos: [-760, 560, 820], look: [20, 0, -20], fov: 30, sh: 650 },
  gol: { pos: [70, 46, 150], look: [15, 6, -135], fov: 40, sh: 260 },
  okul: { pos: [-560, 150, -340], look: [-250, 0, -50], fov: 34, sh: 260 },
  konut: { pos: [445, 62, 35], look: [330, 0, -115], fov: 46, sh: 200 },
  istasyon: { pos: [-168, 30, 236], look: [-240, 2, 168], fov: 44, sh: 120 },
};
const S = SHOTS[SHOT];
const W = innerWidth, H = innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(devicePixelRatio); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.92;
document.body.appendChild(renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.35;
{
  const c = document.createElement('canvas'); c.width = 2; c.height = 256; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#9fbcd6'); gr.addColorStop(0.55, '#d6e1e8'); gr.addColorStop(1, '#ece9e1');
  g.fillStyle = gr; g.fillRect(0, 0, 2, 256); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
}
scene.fog = new THREE.Fog(0xdde4e8, SHOT === 'genel' ? 1400 : 500, SHOT === 'genel' ? 5200 : 2600);
scene.add(new THREE.HemisphereLight(0xdfeaf5, 0xb59f7a, 1.1));
const sun = new THREE.DirectionalLight(0xfff1dc, 3.1);
const T = new THREE.Vector3(...S.look);
sun.position.copy(T).add(new THREE.Vector3(-420, 520, 330)); sun.target.position.copy(T); scene.add(sun.target);
sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -S.sh, right: S.sh, top: S.sh, bottom: -S.sh, near: 10, far: 2500 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6; scene.add(sun);
const cam = new THREE.PerspectiveCamera(S.fov, W / H, 1, 9000); cam.position.set(...S.pos); cam.lookAt(T);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, cam));
if (Q.get('ao') !== '0') { const ao = new GTAOPass(scene, cam, W, H); ao.output = GTAOPass.OUTPUT.Default; ao.blendIntensity = 0.85; ao.updateGtaoMaterial({ radius: SHOT === 'genel' ? 6 : 2.5, distanceExponent: 1.5, thickness: 2, scale: 1 }); composer.addPass(ao); }
composer.addPass(new OutputPass());
composer.render();
window.__done = true;
