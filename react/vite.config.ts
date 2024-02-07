import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from 'url';
import { defineConfig } from "vite";

if (process.env.NODE_ENV == "production") {
  console.log("~ RUNNING IN DJANGO PROD MODE ~")
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000", // Adjust the URL to match your Django server
    },
  },
  
  build: {
    outDir: `../puzzles/static/react`,
    
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  base: (process.env.NODE_ENV == "production") ? "/static/react/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
