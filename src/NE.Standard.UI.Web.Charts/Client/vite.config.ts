import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: "dist",
        modulePreload: false,
        cssCodeSplit: false,
        rolldownOptions: {
            input: resolve(import.meta.dirname, "src/charts.ts"),
            output: {
                entryFileNames: "ui-charts.js",
                assetFileNames: "ui-charts[extname]"
            }
        }
    }
});
