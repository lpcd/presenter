export interface HeroConfig {
  title: string;
  subtitle: string;
  description?: string;
  tags?: string[];
  buttonText: string;
  buttonLink: string;
}

export interface ModuleConfig {
  id: number;
  title: string;
  description: string;
  filename: string;
  duration: string;
  topics: string[];
}

export interface TeamMemberConfig {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface SettingsConfig {
  theme: string;
  autoPlayDelay: number;
  itemsPerSlide: number;
}

export interface PresentationConfig {
  hero: HeroConfig;
  modules: ModuleConfig[];
  team: TeamMemberConfig[];
  settings: SettingsConfig;
}
