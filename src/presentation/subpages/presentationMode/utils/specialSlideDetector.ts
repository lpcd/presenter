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

/**
 * Détecte si une section est une slide spéciale et extrait ses données
 * Ces slides sont identifiées par leur titre (h2-h6, pas h1)
 */
export const detectSpecialSlide = (
  heading: string,
  content: string,
  level: number
): SpecialSlideData => {
  // Ignorer les h1
  if (level === 1) {
    return { type: null };
  }

  const normalizedHeading = heading.toLowerCase().trim();

  // Exercice
  if (normalizedHeading === "exercice") {
    return {
      type: "exercice",
      ...parseExerciceContent(content),
    };
  }

  // Pause
  if (normalizedHeading === "pause") {
    return {
      type: "pause",
      ...parsePauseContent(content),
    };
  }

  // Déjeuner
  if (normalizedHeading === "dejeuner" || normalizedHeading === "déjeuner") {
    return {
      type: "dejeuner",
      ...parseDejeunerContent(content),
    };
  }

  // Vrai
  if (normalizedHeading === "vrai") {
    return {
      type: "vrai",
      ...parseVraiFauxContent(content),
    };
  }

  // Faux
  if (normalizedHeading === "faux") {
    return {
      type: "faux",
      ...parseVraiFauxContent(content),
    };
  }

  // Questions
  if (normalizedHeading === "questions" || normalizedHeading === "question") {
    return {
      type: "questions",
    };
  }

  // Attention
  if (
    normalizedHeading === "attention" ||
    normalizedHeading === "avertissement"
  ) {
    return {
      type: "attention",
      ...parseDescriptionContent(content),
    };
  }

  // Objectifs
  if (normalizedHeading === "objectifs" || normalizedHeading === "objectif") {
    return {
      type: "objectifs",
      ...parseObjectifsContent(content),
    };
  }

  // Démonstration
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

  // Récapitulatif
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

/**
 * Parse le contenu d'une slide Exercice
 * Recherche : durée, repos, description
 */
const parseExerciceContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la durée
  const durationMatch = content.match(/durée\s*:?\s*([^\n]+)/i);
  if (durationMatch) {
    result.duration = durationMatch[1].trim();
  }

  // Rechercher le repos (URL)
  const reposMatch = content.match(/repos\s*:?\s*([^\n]+)/i);
  if (reposMatch) {
    result.repos = reposMatch[1].trim();
  }

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu d'une slide Pause
 * Recherche : durée
 */
const parsePauseContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la durée
  const durationMatch = content.match(/durée\s*:?\s*([^\n]+)/i);
  if (durationMatch) {
    result.duration = durationMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu d'une slide Déjeuner
 * Recherche : retour
 */
const parseDejeunerContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher l'heure de retour
  const retourMatch = content.match(/retour\s*:?\s*([^\n]+)/i);
  if (retourMatch) {
    result.retour = retourMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu d'une slide Vrai/Faux
 * Recherche : description
 */
const parseVraiFauxContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu générique avec description
 * Recherche : description
 */
const parseDescriptionContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu d'une slide Objectifs
 * Recherche : description et liste d'items
 */
const parseObjectifsContent = (content: string): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  // Rechercher les items (lignes commençant par - ou *)
  const itemMatches = content.match(/^[\s]*[-*]\s*(.+)$/gm);
  if (itemMatches && itemMatches.length > 0) {
    result.items = itemMatches.map((item) =>
      item.replace(/^[\s]*[-*]\s*/, "").trim()
    );
  }

  return result;
};

/**
 * Parse le contenu d'une slide Démonstration
 * Recherche : titre et description
 */
const parseDemonstrationContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher le titre
  const titreMatch = content.match(/titre\s*:?\s*([^\n]+)/i);
  if (titreMatch) {
    result.titre = titreMatch[1].trim();
  }

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  return result;
};

/**
 * Parse le contenu d'une slide Récapitulatif
 * Recherche : description et liste d'items
 */
const parseRecapitulatifContent = (
  content: string
): Partial<SpecialSlideData> => {
  const result: Partial<SpecialSlideData> = {};

  // Rechercher la description
  const descriptionMatch = content.match(/description\s*:?\s*([^\n]+)/i);
  if (descriptionMatch) {
    result.description = descriptionMatch[1].trim();
  }

  // Rechercher les items (lignes commençant par - ou *)
  const itemMatches = content.match(/^[\s]*[-*]\s*(.+)$/gm);
  if (itemMatches && itemMatches.length > 0) {
    result.items = itemMatches.map((item) =>
      item.replace(/^[\s]*[-*]\s*/, "").trim()
    );
  }

  return result;
};
