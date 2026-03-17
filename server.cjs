// Servidor local minimo para servir la app desde dist/
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3737;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.glb':  'model/gltf-binary',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);

  // Si la ruta no tiene extension, servir index.html (SPA fallback)
  if (!path.extname(filePath)) filePath = path.join(DIST, 'index.html');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log(`App corriendo en ${url}`);
  // Abrir en el browser predeterminado de Windows
  const { exec } = require('child_process');
  exec(`start ${url}`);
});
