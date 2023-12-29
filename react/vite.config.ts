import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

if (process.env.NODE_ENV == "production") {
  console.log("~ RUNNING IN DJANGO PROD MODE ~")
}

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
});
