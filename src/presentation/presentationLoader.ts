const moduleFiles = import.meta.glob("../presentations/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const metadataFiles = import.meta.glob("../presentations/**/metadata.json", {
  import: "default",
  eager: true,
}) as Record<string, PresentationMetadata>;

export interface PresentationModule {
  id: number;
  title: string;
  description: string;
  filename: string;
  duration: string;
  topics: string[];
}

export interface PresentationData {
  id: string;
  name: string;
  description: string;
  folderPath: string;
  duration: string;
  level: string;
  type: string;
  tags: string[];
  prerequisites: string[];
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
  modules: PresentationModule[];
}

interface PresentationMetadata {
  displayName: string;
  description: string;
  type: string;
  tags: string[];
  prerequisites: string[];
  estimatedDuration: string;
  level: string;
}

function parseModuleFile(markdown: string): {
  title: string;
  description: string;
  topics: string[];
} {
  const lines = markdown.split("\n");
  let title = "";
  let description = "";
  const topics: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const cleanLine = lines[i].trim();

    if (!title && cleanLine.match(/^#\s+(.+)$/)) {
      title = cleanLine.replace(/^#\s+/, "");
      continue;
    }

    if (
      title &&
      !description &&
      cleanLine &&
      !cleanLine.startsWith("#") &&
      !cleanLine.startsWith("-")
    ) {
      description = cleanLine;
    }

    const headingMatch = cleanLine.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1];
      topics.push(heading);
    }
  }

  return { title, description, topics };
}

function estimateDuration(markdown: string): string {
  // Rechercher une durée explicite : "durée : 2h", "durée : 45min", "durée : 1h30"
  const durationMatch = markdown.match(/durée\s*:\s*(\d+h?\d*(?:min)?)/i);
  if (durationMatch) {
    return durationMatch[1];
  }

  const wordCount = markdown.split(/\s+/).length;
  const hours = Math.max(0.5, Math.round((wordCount / 500) * 2) / 2);
  return hours >= 1 ? `${hours}h` : "30min";
}

export function discoverPresentations(): PresentationData[] {
  const presentationsMap = new Map<string, PresentationData>();

  for (const [path, content] of Object.entries(moduleFiles)) {
    const match = path.match(/presentations\/([^/]+)\/(.+)\.md$/);
    if (!match) continue;

    const [, presentationId, filename] = match;

    if (!presentationsMap.has(presentationId)) {
      let metadata: PresentationMetadata | null = null;

      for (const [metaPath, metaContent] of Object.entries(metadataFiles)) {
        if (metaPath.includes(`${presentationId}/metadata.json`)) {
          metadata = metaContent;
          break;
        }
      }

      const defaultName = presentationId
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      presentationsMap.set(presentationId, {
        id: presentationId,
        name: metadata?.displayName || defaultName,
        description: metadata?.description || `Présentation sur ${defaultName}`,
        folderPath: presentationId,
        duration: metadata?.estimatedDuration || "0h",
        level: metadata?.level || "Tous niveaux",
        type: metadata?.type || "Présentation",
        tags: metadata?.tags || [],
        prerequisites: metadata?.prerequisites || [],
        hero: {
          title: metadata?.displayName || defaultName,
          subtitle: metadata?.description || `Présentation sur ${defaultName}`,
          buttonText: "Commencer",
          buttonLink: `/presentations/${presentationId}`,
        },
        modules: [],
      });
    }

    const presentation = presentationsMap.get(presentationId)!;

    const moduleInfo = parseModuleFile(content);
    const moduleIndex = parseInt(filename.match(/^(\d+)_/)?.[1] || "999");

    presentation.modules.push({
      id: moduleIndex,
      title: moduleInfo.title || filename.replace(/_/g, " "),
      description: moduleInfo.description || "Module de la présentation",
      filename: filename,
      duration: estimateDuration(content),
      topics: moduleInfo.topics.slice(0, 5),
    });
  }

  for (const presentation of presentationsMap.values()) {
    presentation.modules.sort((a, b) => a.id - b.id);

    if (presentation.duration === "0h") {
      const totalMinutes = presentation.modules.reduce((acc, module) => {
        const match = module.duration.match(/(\d+)h?(\d*)/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          return acc + hours * 60 + minutes;
        }
        return acc + 30;
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      presentation.duration = minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
    }

    if (presentation.tags.length === 0) {
      presentation.tags = [presentation.name];
    }
  }

  return Array.from(presentationsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getPresentation(
  presentationId: string
): PresentationData | null {
  const presentations = discoverPresentations();
  return presentations.find((p) => p.id === presentationId) || null;
}

export function getAllPresentations(): PresentationData[] {
  return discoverPresentations();
}
