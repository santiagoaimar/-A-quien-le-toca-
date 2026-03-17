// Script de empaquetado con @electron/packager
// Genera una carpeta en /release con el .exe listo para correr

const { packager } = require('@electron/packager');
const path = require('path');

async function build() {
  console.log('Empaquetando app Electron...\n');

  const appPaths = await packager({
    dir: '.',
    name: 'A-quien-le-toca',
    platform: 'win32',
    arch: 'x64',
    out: 'release',
    overwrite: true,
    appVersion: '1.0.0',
    // Ignorar archivos que no hacen falta en el paquete final
    ignore: [
      /^\/node_modules/,
      /^\/src/,
      /^\/public/,
      /^\/release/,
      /^\/\.git/,
      /^\/build-electron\.cjs/,
      /^\/vite\.config\.js/,
      /^\/index\.html/,
      /^\/package-lock\.json/,
    ],
    // Extraer asDar a la carpeta correcta
    extraResource: [],
  });

  console.log('App empaquetada en:', appPaths);
  console.log('\nListo! Ejecuta el .exe desde la carpeta release/');
}

build().catch((err) => {
  console.error('Error al empaquetar:', err);
  process.exit(1);
});
