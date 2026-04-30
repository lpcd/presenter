export const appConfig = {
  debug: {
    isLocalDevelopment: true,
    showBrandingPresetSelector: true,
  },
  homeConfig: {
    icon: undefined as string | undefined,
    title: "Hub",
    subtitle: "Ma plateforme de présentations",
    heroTitle: "Mes présentations",
    footer: "Plateforme de présentations",
    presentationsPath: "assets/presentations",
    hideExamplePresentation: false,
  },
  presentations: {
    sectionByMetadataType: true,
    uncategorizedLabel: "Autres",
    cardGradients: [
      {
        from: "from-brand-gradient-1-from",
        via: "via-brand-gradient-1-via",
        to: "to-brand-gradient-1-to",
      },
      {
        from: "from-brand-gradient-2-from",
        via: "via-brand-gradient-2-via",
        to: "to-brand-gradient-2-to",
      },
      {
        from: "from-brand-gradient-3-from",
        via: "via-brand-gradient-3-via",
        to: "to-brand-gradient-3-to",
      },
      {
        from: "from-brand-gradient-4-from",
        via: "via-brand-gradient-4-via",
        to: "to-brand-gradient-4-to",
      },
    ],
  },
  support: {
    defaultViewMode: "support" as "support" | "presentation",
  },
  branding: {
    enabled: true,
    preset: {
      storageKey: "presenter.branding-preset",
      selectedPreset: "light",
      availablePresets: [
        {
          id: "light",
          label: "Light (actuel)",
          themeId: "default",
          colorScheme: "light",
        },
        {
          id: "dark",
          label: "Dark",
          themeId: "default",
          colorScheme: "dark",
        },
        {
          id: "blue",
          label: "Blue",
          themeId: "blue",
          colorScheme: "light",
        },
        {
          id: "contrast",
          label: "Contrast",
          themeId: "contrast",
          colorScheme: "dark",
        },
        {
          id: "ocean",
          label: "Ocean",
          themeId: "ocean",
          colorScheme: "light",
        },
      ] as const,
    },
    theme: {
      storageKey: "presenter.theme",
      defaultTheme: "default",
      availableThemes: [
        { id: "default", label: "Default" },
        { id: "blue", label: "Blue" },
        { id: "contrast", label: "Contrast" },
        { id: "ocean", label: "Ocean" },
      ],
    },
    mode: {
      storageKey: "presenter.color-scheme",
      defaultMode: "light" as "light" | "dark",
    },
  },
  cache: {
    presentations: {
      enabled: true,
    },
  },
  pdf: {
    codeBlockRenderMode: "wrap" as "wrap" | "scale",
  },
};

export type ThemeId =
  (typeof appConfig.branding.theme.availableThemes)[number]["id"];

export type BrandingPresetId =
  (typeof appConfig.branding.preset.availablePresets)[number]["id"];
