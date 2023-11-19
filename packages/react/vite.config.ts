import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "safe-fullpage",
      fileName: "index",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // lottie-web
      external: ["react"],
    },
  },
});
