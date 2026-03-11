import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["recharts"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
