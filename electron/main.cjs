const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Evita segfault por problemas de GPU/sandbox en algunos entornos Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

const DEV = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: '¿A quién le toca?',
    icon: path.join(__dirname, '../dist/icon.png'),
    backgroundColor: '#dadada',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Sin frame nativo en Windows para look más limpio (opcional)
    // frame: false,
    show: false, // evitar flash blanco al arrancar
  });

  // Mostrar cuando esté lista para evitar el flash blanco
  win.once('ready-to-show', () => win.show());

  if (DEV) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Abrir links externos en el browser del sistema, no en Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
