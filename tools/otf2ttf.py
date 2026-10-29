# Convert CFF-flavoured OTF to TrueType outlines so Chromium embeds it as a real font in PDFs.
import sys
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
src, dst = sys.argv[1], sys.argv[2]
f = TTFont(src)
gs = f.getGlyphSet()
glyf = newTable('glyf'); glyf.glyphOrder = f.getGlyphOrder(); glyf.glyphs = {}
for name in f.getGlyphOrder():
    pen = TTGlyphPen(gs)
    gs[name].draw(Cu2QuPen(pen, 1.0, reverse_direction=True))
    glyf[name] = pen.glyph()
f['glyf'] = glyf
f['loca'] = newTable('loca')
maxp = f['maxp']; maxp.tableVersion = 0x00010000
for a in ('maxZones','maxTwilightPoints','maxStorage','maxFunctionDefs','maxInstructionDefs','maxStackElements','maxSizeOfInstructions','maxComponentElements'):
    setattr(maxp, a, 0)
maxp.maxZones = 1
for t in ('CFF ', 'VORG'):
    if t in f: del f[t]
f['head'].glyphDataFormat = 0
post = f['post']; post.formatType = 2.0; post.extraNames = []; post.mapping = {}; post.glyphOrder = f.getGlyphOrder()
f.sfntVersion = '\x00\x01\x00\x00'
f.save(dst)
