// 拍一张「已经用了几天」的效果图：自动输入几条记录再截图（仅开发时使用）
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

  const items = ['搞懂了 useState', '会写第一个界面了', '知道了 iOS 要用 Mac 打包'];
  for (const text of items) {
    await page.click('input');
    await page.type('input', text, { delay: 10 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('div,button'))
        .filter((el) => el.textContent === '记下来');
      if (btns.length) btns[btns.length - 1].click();
    });
    await new Promise((r) => setTimeout(r, 400));
  }
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: process.argv[2] || 'demo.png' });
  await browser.close();
  console.log('demo screenshot saved');
})();
