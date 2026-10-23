import math
R = 6371.0
def xy(p, ref):
    # local equirectangular km (east, north) relative to ref
    return ((p[1]-ref[1])*math.cos(math.radians(ref[0]))*math.pi/180*R, (p[0]-ref[0])*math.pi/180*R)
t03 = (40.0662, 32.5550); t21 = (40.0916, 32.5763)
ex, ny = xy(t21, t03)
brg = math.degrees(math.atan2(ex, ny)) % 360
ux, uy = ex/math.hypot(ex, ny), ny/math.hypot(ex, ny)
print(f"pist gercek yonu: {brg:.1f} deg, uzunluk {math.hypot(ex,ny):.2f} km")
pts = {"Orencik merkez": (40.2597899, 32.6583397), "Orencik guney-bati kose": (40.2280035, 32.6372021),
       "Orencik guney-dogu kose": (40.2280035, 32.6963704), "Orencik guney orta": (40.2280035, 32.6667),
       "Orencik kuzey orta": (40.2760360, 32.6667), "Kahramankazan merkez": (40.2054445, 32.6813148)}
for k, p in pts.items():
    px, py = xy(p, t21)
    along = px*ux + py*uy
    lat = px*uy - py*ux
    alt = along*1000*math.tan(math.radians(3))
    print(f"{k}: pist 21 esiginden eksen boyunca {along:.1f} km, eksenden yanal {lat:+.1f} km, 3 derece suzulus irtifasi ~{alt:.0f} m")
# Batikent / Eryaman / Susuz to TUSAS polygon
def h(a, b):
    la1, lo1 = map(math.radians, a); la2, lo2 = map(math.radians, b)
    d = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(d))
T = (40.0729723, 32.5826682)
for k, p in {"Batikent metro": (39.9681734, 32.7267398), "Eryaman": (39.9722971, 32.6212797), "Susuz": (40.0204091, 32.6551222), "Kahramankazan merkez": (40.2054445, 32.6813148), "Saray": (40.0555340, 32.6307070), "Yenikent": (40.0039468, 32.5244886)}.items():
    print(f"TUSAS -> {k}: {h(T,p):.1f} km")
