import type { ParsedContent } from "../types";

/**
 * Parse un contenu markdown en structure JSON
 * Extrait le titre principal (premier h1) et les sections (autres headings)
 */
export const parseMarkdown = (markdown: string): ParsedContent => {
  const lines = markdown.split("\n");
  const sections: ParsedContent["sections"] = [];
  let title = "";
  let currentSection: {
    heading: string;
    content: string;
    level: number;
  } | null = null;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Nettoyer les retours chariot Windows (\r)
    const cleanLine = line.replace(/\r$/, "");

    // Détecter le début ou la fin d'un bloc de code
    if (cleanLine.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (currentSection !== null) {
        currentSection.content += cleanLine + "\n";
      }
      continue;
    }

    // Ne pas traiter les lignes à l'intérieur d'un bloc de code comme des headings
    const headingMatch = !inCodeBlock
      ? cleanLine.match(/^(#{1,6})\s+(.+)$/)
      : null;

    if (headingMatch) {
      // Sauvegarder la section précédente si elle existe
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentSection.content.trim(),
        });
      }

      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      // Le premier titre de niveau 1 devient le titre principal
      if (level === 1 && !title) {
        title = heading;
        currentSection = null;
      } else {
        // Créer une nouvelle section pour tous les autres headings
        currentSection = {
          heading,
          content: "",
          level,
        };
      }
    } else if (currentSection !== null) {
      // Ajouter toutes les lignes à la section courante
      currentSection.content += cleanLine + "\n";
    }
  }

  // Ajouter la dernière section si elle existe
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentSection.content.trim(),
    });
  }

  return { title, sections };
};
