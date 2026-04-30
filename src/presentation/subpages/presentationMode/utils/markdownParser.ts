import type { ParsedContent } from "../types";

export const parseMarkdown = (
  markdown: string,
  enableSplits: boolean = true,
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

  const enrichedSections = sections.map((section) => ({ ...section }));

  let runStartIndex = 0;

  while (runStartIndex < sections.length) {
    const current = sections[runStartIndex];
    let runEndIndex = runStartIndex;

    while (runEndIndex + 1 < sections.length) {
      const next = sections[runEndIndex + 1];
      const isSameConsecutiveHeading =
        next.heading === current.heading && next.level === current.level;

      if (!isSameConsecutiveHeading) {
        break;
      }

      runEndIndex++;
    }

    const runLength = runEndIndex - runStartIndex + 1;
    if (runLength > 1) {
      for (let offset = 0; offset < runLength; offset++) {
        const index = runStartIndex + offset;
        enrichedSections[index].duplicateInfo = {
          current: offset + 1,
          total: runLength,
          isFirst: offset === 0,
        };
      }
    }

    runStartIndex = runEndIndex + 1;
  }

  return { title, sections: enrichedSections };
};
