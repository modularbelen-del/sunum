import sys, glob, os
sys.path.insert(0, sys.argv[1] + "/pylib")
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1] + "/drone/f_*.jpg"))
w, h, cols = 640, 360, 2
for sheet in range(0, len(files), 8):
    chunk = files[sheet:sheet+8]
    rows = (len(chunk) + cols - 1) // cols
    S = Image.new("RGB", (w*cols, h*rows), "white")
    for i, f in enumerate(chunk):
        im = Image.open(f).resize((w, h))
        d = ImageDraw.Draw(im); d.rectangle([0,0,90,28], fill="black"); d.text((6,6), os.path.basename(f), fill="yellow")
        S.paste(im, ((i % cols)*w, (i//cols)*h))
    S.save(sys.argv[1] + f"/drone/sheet_{sheet//8+1}.jpg", quality=80)
print("ok")
