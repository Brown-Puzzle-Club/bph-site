import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000", // Adjust the URL to match your Django server
    },
  },
  
  build: {
    outDir: `../puzzles/static/react` /*`../puzzles/react-build`,*/,
    
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  ...(process.env.NODE_ENV === "django" && {
    base: "/static/react/",
  }),
});
