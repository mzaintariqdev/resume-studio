import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      // Forward /api calls to backend so no CORS issues in dev
      "/api": "http://localhost:4000",
    },
  },
});