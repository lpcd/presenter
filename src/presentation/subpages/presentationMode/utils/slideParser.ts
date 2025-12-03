import type { ParsedContent } from "../types";

export const parseMarkdownWithSplits = (
  markdown: string
): ParsedContent & { splits?: number[] } => {
  const lines = markdown.split("\n");
  const sections: ParsedContent["sections"] = [];
  const splits: number[] = []; // Index des sections qui sont des splits

  let title = "";
  let currentSection: {
    heading: string;
    content: string;
    level: number;
  } | null = null;
  let inCodeBlock = false;
  let consecutiveSeparators = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/\r$/, "");
    const trimmedLine = cleanLine.trim();

    if (trimmedLine.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (currentSection !== null) {
        currentSection.content += cleanLine + "\n";
      }
      consecutiveSeparators = 0;
      continue;
    }

    if (!inCodeBlock && trimmedLine === "---") {
      consecutiveSeparators++;
      continue;
    }

    if (consecutiveSeparators > 0) {
      if (consecutiveSeparators >= 2) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.trim(),
          });
          splits.push(sections.length - 1);
          currentSection = null;
        }
      }
      consecutiveSeparators = 0;

      if (trimmedLine === "") {
        continue;
      }
    }

    const headingMatch = !inCodeBlock
      ? cleanLine.match(/^(#{1,6})\s+(.+)$/)
      : null;

    if (headingMatch) {
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentSection.content.trim(),
        });
      }

      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      if (level === 1 && !title) {
        title = heading;
        currentSection = null;
      } else {
        currentSection = {
          heading,
          content: "",
          level,
        };
      }
    } else if (currentSection !== null) {
      currentSection.content += cleanLine + "\n";
    }
  }

  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentSection.content.trim(),
    });
  }

  return { title, sections, splits };
};
