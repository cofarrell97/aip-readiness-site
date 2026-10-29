/* Builds data-request.pdf from data-request.html (run from the repo root):
     node tools/build-data-request.js data-request.html data-request.pdf
   Needs Playwright with Chromium, and TrueType copies of Inter in tools/fonts/ (not committed):
     python3 tools/otf2ttf.py /usr/share/fonts/opentype/inter/Inter-Regular.otf tools/fonts/InterTT-Regular.ttf
   (same for SemiBold and Bold; needs the fonttools package). */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage();
  await page.goto('file://' + path.resolve(process.argv[2]));
  /* TrueType copies of Inter, so the PDF embeds real fonts (CFF fonts become Type 3 glyphs) */
  const fdir = path.resolve(__dirname, 'fonts');
  await page.addStyleTag({ content: [['Regular', 400], ['SemiBold', 600], ['Bold', 700]].map(([n, w]) =>
    "@font-face{font-family:'InterPDF';font-weight:" + w + ";src:url('file://" + fdir + "/InterTT-" + n + ".ttf')}").join('') +
    ':root{--ifs-font:InterPDF,sans-serif}' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: process.argv[3], format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
