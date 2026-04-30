import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.tsx";
import { appConfig, type BrandingPresetId, type ThemeId } from "./config";

const applyInitialBranding = () => {
  if (!appConfig.branding.enabled) {
    return;
  }

  const { theme, mode } = appConfig.branding;
  const root = document.documentElement;

  const { preset } = appConfig.branding;

  const isValidPreset = (value: string | null): value is BrandingPresetId =>
    Boolean(
      value &&
      preset.availablePresets.some((available) => available.id === value),
    );

  const cachedPreset = localStorage.getItem(preset.storageKey);
  const selectedPreset = isValidPreset(cachedPreset)
    ? cachedPreset
    : preset.selectedPreset;

  const presetConfig = preset.availablePresets.find(
    (available) => available.id === selectedPreset,
  );

  if (presetConfig) {
    root.setAttribute("data-branding", presetConfig.id);
    root.setAttribute("data-theme", presetConfig.themeId);
    root.setAttribute("data-color-scheme", presetConfig.colorScheme);
    return;
  }

  const isValidTheme = (value: string | null): value is ThemeId =>
    Boolean(
      value &&
      theme.availableThemes.some((available) => available.id === value),
    );

  const cachedTheme = localStorage.getItem(theme.storageKey);
  const selectedTheme = isValidTheme(cachedTheme)
    ? cachedTheme
    : theme.defaultTheme;
  root.setAttribute("data-theme", selectedTheme);

  const cachedMode = localStorage.getItem(mode.storageKey);
  const selectedMode =
    cachedMode === "dark" || cachedMode === "light"
      ? cachedMode
      : mode.defaultMode;
  root.setAttribute("data-color-scheme", selectedMode);
};

const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
};

export function AppWrapper() {
  useEffect(() => {
    hideInitialLoader();
  }, []);

  return <App />;
}

applyInitialBranding();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
);
