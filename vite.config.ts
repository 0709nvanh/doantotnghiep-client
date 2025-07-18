import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  base: "/doantotnghiep-client",
  plugins: [react()],
  server: {
    cors: true,
    port: 3000,
  },
  preview: {
    port: 3000,
    cors: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  build: {
    outDir: "build",
    assetsDir: "static",
  },
});
