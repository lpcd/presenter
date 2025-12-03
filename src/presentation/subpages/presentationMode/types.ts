export interface ParsedContent {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    level: number;
    mergedContent?: string; // Contenu fusionné de toutes les occurrences (pour mode support)
    duplicateInfo?: {
      current: number; // Position actuelle (1-based)
      total: number; // Nombre total d'occurrences
      isFirst: boolean; // Est-ce la première occurrence ?
    };
  }>;
}

export type ViewMode = "presentation" | "support";
