export type SpecialSlideType =
  | "exercice"
  | "pause"
  | "dejeuner"
  | "vrai"
  | "faux"
  | "questions"
  | "attention"
  | "objectifs"
  | "demonstration"
  | "recapitulatif"
  | null;

export interface SpecialSlideData {
  type: SpecialSlideType;
  duration?: string;
  repos?: string;
  description?: string;
  retour?: string;
  titre?: string;
  items?: string[];
}

export const detectSpecialSlide = (
  heading: string,
  content: string,
  level: number
): SpecialSlideData => {
  if (level === 1) {
    return { type: null };
  }

  const normalizedHeading = heading.toLowerCase().trim();

  if (normalizedHeading === "exercice") {
    return {
      type: "exercice",
      ...parseExerciceContent(content),
    };
  }

  if (normalizedHeading === "pause") {
    return {
      type: "pause",
      ...parsePauseContent(content),
    };
  }

  if (normalizedHeading === "dejeuner" || normalizedHeading === "déjeuner") {
    return {
      type: "dejeuner",
      ...parseDejeunerContent(content),
    };
  }

  if (normalizedHeading === "vrai") {
    return {
      type: "vrai",
      ...parseVraiFauxContent(content),
    };
  }

  if (normalizedHeading === "faux") {
    return {
      type: "faux",
      ...parseVraiFauxContent(content),
    };
  }

  if (normalizedHeading === "questions" || normalizedHeading === "question") {
    return {
      type: "questions",
    };
  }

  if (
    normalizedHeading === "attention" ||
    normalizedHeading === "avertissement"
  ) {
    return {
      type: "attention",
      ...parseDescriptionContent(content),
    };
  }

  if (normalizedHeading === "objectifs" || normalizedHeading === "objectif") {
    return {
      type: "objectifs",
      ...parseObjectifsContent(content),
    };
  }

  if (
    normalizedHeading === "demonstration" ||
    normalizedHeading === "démonstration" ||
    normalizedHeading === "demo" ||
    normalizedHeading === "démo" ||
    normalizedHeading === "live coding"
  ) {
    return {
      type: "demonstration",
      ...parseDemonstrationContent(content),
    };
  }

  if (
    normalizedHeading === "recapitulatif" ||
    normalizedHeading === "récapitulatif" ||
    normalizedHeading === "recap" ||
    normalizedHeading === "résumé" ||
    normalizedHeading === "resume" ||
    normalizedHeading === "summary"
  ) {
    return {
      type: "recapitulatif",
      ...parseRecapitulatifContent(content),
    };
  }

  return { type: null };
};

const parseExerciceContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const durationMatch = content.match(/durée\s*:?\s*([^\n]+)/i);
  if (durationMatch) {
    result.duration = durationMatch[1].trim();
  }

  const reposMatch = content.match(/repos\s*:?\s*([^\n]+)/i);
  if (reposMatch) {
    result.repos = reposMatch[1].trim();
  }

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

const parsePauseContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const durationMatch = content.match(/durée\s*:?\s*([^\n]+)/i);
  if (durationMatch) {
    result.duration = durationMatch[1].trim();
  }

  return result;
};

const parseDejeunerContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const retourMatch = content.match(/retour\s*:?\s*([^\n]+)/i);
  if (retourMatch) {
    result.retour = retourMatch[1].trim();
  }

  return result;
};

const parseVraiFauxContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

const parseDescriptionContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

const parseObjectifsContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  const itemMatches = content.match(/^[\s]*[-*]\s*(.+)$/gm);
  if (itemMatches && itemMatches.length > 0) {
    result.items = itemMatches.map((item) =>
      item.replace(/^[\s]*[-*]\s*/, "").trim()
    );
  }

  return result;
};

const parseDemonstrationContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const titreMatch = content.match(/titre\s*:?\s*([^\n]+)/i);
  if (titreMatch) {
    result.titre = titreMatch[1].trim();
  }

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

const parseRecapitulatifContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  const itemMatches = content.match(/^[\s]*[-*]\s*(.+)$/gm);
  if (itemMatches && itemMatches.length > 0) {
    result.items = itemMatches.map((item) =>
      item.replace(/^[\s]*[-*]\s*/, "").trim()
    );
  }

  return result;
};
