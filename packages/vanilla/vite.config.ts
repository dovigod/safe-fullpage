import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "safe-fullpage",
      fileName: "index",
      formats: ["es"],
    },
  },
});
