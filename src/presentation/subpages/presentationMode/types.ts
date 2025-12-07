export interface ParsedContent {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    level: number;
    mergedContent?: string;
    duplicateInfo?: {
      current: number;
      total: number;
      isFirst: boolean;
    };
  }>;
}

export type ViewMode = "presentation" | "support";
