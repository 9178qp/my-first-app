// 用本机 Edge 给 Web 预览拍一张 iPhone 尺寸的截图（仅开发时使用）
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-first-run', '--no-default-browser-check'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 900, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://127.0.0.1:8090/', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: process.argv[2] || 'preview.png' });
  await browser.close();
  console.log('screenshot saved');
})();
