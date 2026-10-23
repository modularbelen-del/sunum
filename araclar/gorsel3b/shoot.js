// Kavram görsellerini başsız Chromium'da çizer. Kullanım: node shoot.js <çıktı klasörü> [sahne...] [--w=1600 --h=900 --dpr=2 --ao=1]
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || '/opt/node22/lib/node_modules/playwright');

const ROOT = __dirname;
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [outDir, ...shots] = args.filter((a) => !a.startsWith('--'));
const list = shots.length ? shots : ['genel', 'gol', 'okul', 'konut', 'istasyon'];
const W = +(opt.w || 1600), H = +(opt.h || 900), DPR = +(opt.dpr || 2);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(data);
  });
}).listen(0, async () => {
  const port = server.address().port;
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const shot of list) {
    const t0 = Date.now();
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') console.log('[' + shot + ']', m.text()); });
    page.on('pageerror', (e) => console.log('[' + shot + '] pageerror', e.message));
    await page.goto(`http://localhost:${port}/index.html?shot=${shot}&ao=${opt.ao ?? 1}`);
    await page.waitForFunction(() => window.__done === true, null, { timeout: 900000, polling: 1000 });
    await page.screenshot({ path: path.join(outDir, shot + '.png') });
    console.log(shot, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
    await ctx.close();
  }
  await browser.close();
  server.close();
});
