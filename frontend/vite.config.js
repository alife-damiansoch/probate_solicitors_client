// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
//
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000, // Default React port
//     open: true, // Open browser on server start
//   },
// });

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    open: true,
    allowedHosts: ['ab96-79-97-102-189.ngrok-free.app'],
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
});
