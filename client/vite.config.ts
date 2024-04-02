import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
<<<<<<< HEAD
=======
      "/ws": {
        target: `ws://127.0.0.1:8000`,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
>>>>>>> 306c92251fbdff642281d568c99b7fc1724d3680
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
