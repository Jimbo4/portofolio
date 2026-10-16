"""
Render every page of a PDF (e.g. a slide deck) into one contact-sheet PNG, to review its visual style quickly.
Not part of the site build.

Needs PyMuPDF, ideally in a throwaway venv outside the repo:
    python -m venv <scratch>/venv && <scratch>/venv/Scripts/python -m pip install pymupdf
Usage:
    <scratch>/venv/Scripts/python -I scripts/pdf-contact-sheet.py deck.pdf sheet.png [columns] [thumb_width]
Text can be extracted with `pdftotext -layout deck.pdf out.txt` (ships with Git for Windows).
"""
import sys

import pymupdf

src, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
thumb_width = int(sys.argv[4]) if len(sys.argv) > 4 else 320

doc = pymupdf.open(src)
page_w, page_h = doc[0].rect.width, doc[0].rect.height
thumb_height = int(thumb_width * page_h / page_w)
rows = (len(doc) + cols - 1) // cols

sheet = pymupdf.Pixmap(pymupdf.csRGB, pymupdf.IRect(0, 0, cols * thumb_width, rows * thumb_height), False)
sheet.clear_with(255)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=pymupdf.Matrix(thumb_width / page_w, thumb_width / page_w))
    pix.set_origin((i % cols) * thumb_width, (i // cols) * thumb_height)
    sheet.copy(pix, pix.irect)
sheet.save(out)
print(f"{len(doc)} pages, {page_w:.0f}x{page_h:.0f} pt -> {out}")
