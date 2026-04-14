import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/frontend/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API calls to Rails server
      "/users": "http://localhost:3000",
      "/items": "http://localhost:3000",
      "/communities": "http://localhost:3000",
      "/search": "http://localhost:3000",
      "/notifications": "http://localhost:3000",
      "/payments": "http://localhost:3000",
      "/admin": "http://localhost:3000",
      // Proxy WebSocket connections to Rails server
      "/cable": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    outDir: "../public/frontend",
    emptyOutDir: true,
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
}));
