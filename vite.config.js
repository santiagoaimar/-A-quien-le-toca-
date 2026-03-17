import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Tauri usa base '/' (sirve desde localhost), Electron necesitaba './'
  base: '/',
});
