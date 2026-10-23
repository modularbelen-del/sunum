import math


def h(a, b):
    R = 6371.0
    la1, lo1 = map(math.radians, a)
    la2, lo2 = map(math.radians, b)
    d = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(d))


ORIGINS = {
    "Örencik merkez (OSM)": (40.2597899, 32.6583397),
    "Örencik güney sınırı (bbox)": (40.2280035, 32.6667),
}
P = {
    "TUSAŞ tesis poligonu (OSM)": (40.0729723, 32.5826682),
    "Mürted ARP": (40.0789, 32.5656),
    "TUSAŞ Akademi / HAB OSB": (40.0823503, 32.5856604),
    "Gazi Üni. TUSAŞ Kazan MYO": (40.1523356, 32.6536039),
    "Kahramankazan merkez": (40.2054445, 32.6813148),
    "Saray": (40.0555340, 32.6307070),
    "Susuz Mah.": (40.0204091, 32.6551222),
    "Batıkent metro": (39.9681734, 32.7267398),
    "Eryaman Mah.": (39.9722971, 32.6212797),
    "Yenikent (Sincan)": (40.0039468, 32.5244886),
}
for on, o in ORIGINS.items():
    print("==", on)
    for k, v in P.items():
        print(f"  {k}: {h(o, v):.1f} km")
# Örencik bbox size
print("bbox NS km:", round(h((40.2280035, 32.66), (40.2760360, 32.66)), 1),
      "EW km:", round(h((40.25, 32.6372021), (40.25, 32.6963704)), 1))
