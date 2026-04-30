import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

// Plugin pour copier les ressources des présentations vers public
function copyPresentationResources() {
  return {
    name: "copy-presentation-resources",
    buildStart() {
      const presentationsDir = join(__dirname, "src", "presentations");
      const publicDir = join(__dirname, "public", "presentations");

      if (!existsSync(presentationsDir)) return;

      const presentations = readdirSync(presentationsDir);

      presentations.forEach((presentation) => {
        const resourcesPath = join(
          presentationsDir,
          presentation,
          "ressources"
        );
        if (existsSync(resourcesPath)) {
          const targetPath = join(publicDir, presentation, "ressources");
          mkdirSync(targetPath, { recursive: true });

          const files = readdirSync(resourcesPath);
          files.forEach((file) => {
            const sourcePath = join(resourcesPath, file);
            const destPath = join(targetPath, file);
            try {
              copyFileSync(sourcePath, destPath);
            } catch (err) {
              console.warn(`Could not copy ${file}:`, err);
            }
          });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyPresentationResources()],
  assetsInclude: ["**/*.md", "**/*.pdf"],
  publicDir: "public",
  build: {
    // Lazy chunks for CodeMirror and Milkdown are intentionally large;
    // raise the limit to avoid noise (they are only loaded on demand).
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group all @codemirror/* and @uiw/react-codemirror into one chunk
          if (id.includes("node_modules/@codemirror") || id.includes("node_modules/@uiw")) {
            return "vendor-codemirror";
          }
          // Group all @milkdown/* and @prosemirror/* into one chunk
          if (id.includes("node_modules/@milkdown") || id.includes("node_modules/@prosemirror")) {
            return "vendor-milkdown";
          }
          // KaTeX (pulled in transitively by Milkdown)
          if (id.includes("node_modules/katex")) {
            return "vendor-katex";
          }
          // Highlight.js (used in presentation mode)
          if (id.includes("node_modules/highlight.js")) {
            return "vendor-highlight";
          }
          // Group remaining large vendor libs
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
        },
      },
    },
  },
});
