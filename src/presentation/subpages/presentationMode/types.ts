export interface ParsedContent {
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    level: number;
  }>;
}

export type ViewMode = "presentation" | "support";
