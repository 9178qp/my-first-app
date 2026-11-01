// 把当前目录当 HTTP 服务器跑起来，方便 iPhone 用 Safari 下载 app.ipa
// 用法：双击同目录的 接收ipa.cmd
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8099;
const ROOT = __dirname + path.sep + '..';

const mime = {
  '.ipa': 'application/octet-stream',
  '.zip': 'application/zip',
  '.png': 'image/png',
  '.json': 'application/json',
  '.md': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') {
    const files = fs.readdirSync(ROOT).filter((f) => f.endsWith('.ipa'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      '<meta name="viewport" content="width=device-width"><h2>ipa 下载</h2>' +
        (files.length
          ? files.map((f) => `<p><a href="/${f}">${f}</a></p>`).join('')
          : '<p>还没有 .ipa 文件。把 GitHub 下载的 app.ipa 放到这个文件夹里。</p>')
    );
    return;
  }
  const file = path.join(ROOT, p);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('not found');
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${path.basename(file)}"`,
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const i of list || []) {
      if (i.family === 'IPv4' && !i.internal) ips.push(i.address);
    }
  }
  console.log('');
  console.log('  在 iPhone 的 Safari 里打开下面任意一个地址：');
  ips.forEach((ip) => console.log(`    http://${ip}:${PORT}/`));
  console.log('');
  console.log('  下载完的 ipa 会进「文件」App，点它 → 共享 → TrollStore 就能装。');
  console.log('  这个窗口别关，装完再关。');
});
