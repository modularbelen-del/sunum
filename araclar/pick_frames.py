import sys
sys.path.insert(0, sys.argv[1] + "/pylib")
from PIL import Image
pick = {"f_01": "drone_01_yarinti_ve_teras_agaclandirma", "f_09": "drone_02_yamac_teraslari_ve_yollar",
        "f_13": "drone_03_orencik_koyu_ve_plato", "f_17": "drone_04_plato_tarlalari",
        "f_19": "drone_05_ova_manzarasi", "f_21": "drone_06_yamac_ve_kazan_ovasi"}
out = sys.argv[2]
for src, name in pick.items():
    im = Image.open(f"{sys.argv[1]}/drone/{src}.jpg").convert("RGB")
    im.thumbnail((1600, 900))
    im.save(f"{out}/{name}.jpg", quality=82, optimize=True)
print("ok")
