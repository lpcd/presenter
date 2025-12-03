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
});
