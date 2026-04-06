import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/frontend/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../public/frontend",
    emptyOutDir: true,
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
