import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/notifications": "http://127.0.0.1:8000",
      "/api": "http://127.0.0.1:8000",
      "/hints": "http://127.0.0.1:8000",
      "/hint": "http://127.0.0.1:8000",
      "/ws": {
        target: `ws://127.0.0.1:8000`,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      "/admin": "http://127.0.0.1:8000",
      "/static": "http://127.0.0.1:8000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
