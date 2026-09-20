import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: "dist",
        lib: {
            entry: resolve(__dirname, "src/charts.ts"),
            formats: ["es"],
            fileName: () => "ui-charts.js",
            cssFileName: "ui-charts"
        }
    }
});
