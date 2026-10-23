"""Render chosen PDF pages side by side into one PNG: sheet.py in.pdf out.png 1,2,5"""
import sys
import pypdfium2 as p
from PIL import Image
doc = p.PdfDocument(sys.argv[1])
pages = [int(x) - 1 for x in sys.argv[3].split(",")]
ims = [doc[i].render(scale=1.1).to_pil() for i in pages]
w, h = ims[0].size
S = Image.new("RGB", (w * len(ims), h), "white")
for k, im in enumerate(ims):
    S.paste(im, (k * w, 0))
S.save(sys.argv[2])
print(len(doc), "pages")
