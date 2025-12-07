import type { ParsedContent } from "../types";

export const parseMarkdown = (
  markdown: string,
  enableSplits: boolean = true
): ParsedContent => {
  const lines = markdown.split("\n");
  const sections: ParsedContent["sections"] = [];
  let title = "";
  let currentSection: {
    heading: string;
    content: string;
    level: number;
  } | null = null;
  let inCodeBlock = false;
  let consecutiveSeparators = 0;
  let splitCounter = 1;

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
      if (consecutiveSeparators >= 2 && enableSplits) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.trim(),
          });
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

  const headingCounts = new Map<string, number>();
  const headingOccurrences = new Map<string, number>();
  const headingContents = new Map<string, string[]>();

  sections.forEach((section) => {
    const count = headingCounts.get(section.heading) || 0;
    headingCounts.set(section.heading, count + 1);

    const contents = headingContents.get(section.heading) || [];
    contents.push(section.content);
    headingContents.set(section.heading, contents);
  });

  const enrichedSections = sections.map((section) => {
    const totalOccurrences = headingCounts.get(section.heading) || 1;

    if (totalOccurrences > 1) {
      const currentOccurrence =
        (headingOccurrences.get(section.heading) || 0) + 1;
      headingOccurrences.set(section.heading, currentOccurrence);

      const mergedContent = (headingContents.get(section.heading) || []).join(
        "\n\n"
      );

      return {
        ...section,
        mergedContent,
        duplicateInfo: {
          current: currentOccurrence,
          total: totalOccurrences,
          isFirst: currentOccurrence === 1,
        },
      };
    }

    return section;
  });

  return { title, sections: enrichedSections };
};
