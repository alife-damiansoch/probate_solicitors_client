import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Set the development server to use port 3000
    open: true, // Optional: Auto-opens the browser
  },
});
