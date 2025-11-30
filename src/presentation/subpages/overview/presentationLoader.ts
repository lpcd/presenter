// Charger tous les fichiers markdown dynamiquement depuis tous les dossiers de présentations
const moduleFiles = import.meta.glob(
  "../../../assets/myPresentations/**/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

// Charger tous les fichiers metadata.json
const metadataFiles = import.meta.glob(
  "../../../assets/myPresentations/**/metadata.json",
  {
    import: "default",
    eager: true,
  }
) as Record<string, PresentationMetadata>;

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

// Parser un fichier module pour extraire les informations
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

    // Premier titre (H1)
    if (!title && cleanLine.match(/^#\s+(.+)$/)) {
      title = cleanLine.replace(/^#\s+/, "");
      continue;
    }

    // Description (premier paragraphe après le titre)
    if (
      title &&
      !description &&
      cleanLine &&
      !cleanLine.startsWith("#") &&
      !cleanLine.startsWith("-")
    ) {
      description = cleanLine;
    }

    // Extraire les titres H2 et H3 comme topics (sections du module)
    const headingMatch = cleanLine.match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1];
      topics.push(heading);
    }
  }

  return { title, description, topics };
}

// Extraire la durée d'un module depuis son contenu
function estimateDuration(markdown: string): string {
  // Chercher une durée explicite dans le contenu
  const durationMatch = markdown.match(/durée\s*:\s*(\d+h?\d*)/i);
  if (durationMatch) {
    return durationMatch[1];
  }

  // Estimation basée sur la longueur du contenu
  const wordCount = markdown.split(/\s+/).length;
  const hours = Math.max(0.5, Math.round((wordCount / 500) * 2) / 2); // 500 mots ≈ 30 min
  return hours >= 1 ? `${hours}h` : "30min";
}

// Découvrir toutes les présentations disponibles
export function discoverPresentations(): PresentationData[] {
  const presentationsMap = new Map<string, PresentationData>();

  // Grouper les fichiers par présentation (dossier)
  for (const [path, content] of Object.entries(moduleFiles)) {
    const match = path.match(/myPresentations\/([^/]+)\/(.+)\.md$/);
    if (!match) continue;

    const [, presentationId, filename] = match;

    // Initialiser la présentation si elle n'existe pas
    if (!presentationsMap.has(presentationId)) {
      // Chercher le fichier metadata.json correspondant
      let metadata: PresentationMetadata | null = null;

      for (const [metaPath, metaContent] of Object.entries(metadataFiles)) {
        if (metaPath.includes(`${presentationId}/metadata.json`)) {
          metadata = metaContent;
          break;
        }
      }

      // Valeurs par défaut si pas de metadata.json
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

    // Ajouter le module
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

  // Trier les modules par ID et calculer la durée totale si pas définie
  for (const presentation of presentationsMap.values()) {
    presentation.modules.sort((a, b) => a.id - b.id);

    // Calculer la durée totale seulement si pas définie dans metadata
    if (presentation.duration === "0h") {
      const totalMinutes = presentation.modules.reduce((acc, module) => {
        const match = module.duration.match(/(\d+)h?(\d*)/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          return acc + hours * 60 + minutes;
        }
        return acc + 30; // défaut 30min
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      presentation.duration = minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
    }

    // Si pas de tags définis, utiliser le nom de la présentation
    if (presentation.tags.length === 0) {
      presentation.tags = [presentation.name];
    }
  }

  return Array.from(presentationsMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

// Récupérer une présentation spécifique
export function getPresentation(
  presentationId: string
): PresentationData | null {
  const presentations = discoverPresentations();
  return presentations.find((p) => p.id === presentationId) || null;
}

// Récupérer toutes les présentations
export function getAllPresentations(): PresentationData[] {
  return discoverPresentations();
}
