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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    open: true,
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
});

