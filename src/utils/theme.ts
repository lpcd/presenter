/**
 * Minimal theme utility — reads/writes the same localStorage keys
 * used by the branding system so both stay in sync.
 */
const COLOR_SCHEME_KEY = "presenter.color-scheme";
const PRESET_KEY = "presenter.branding-preset";

export type ColorScheme = "light" | "dark";

export function getColorScheme(): ColorScheme {
  const stored = localStorage.getItem(COLOR_SCHEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const attr = document.documentElement.getAttribute("data-color-scheme");
  return attr === "dark" ? "dark" : "light";
}

export function setColorScheme(scheme: ColorScheme): void {
  const root = document.documentElement;
  root.setAttribute("data-color-scheme", scheme);
  localStorage.setItem(COLOR_SCHEME_KEY, scheme);

  // Also update the preset key to the generic dark/light preset
  const currentPreset = localStorage.getItem(PRESET_KEY);
  // Only switch preset if it's one of the two default ones
  if (currentPreset === "light" || currentPreset === "dark" || !currentPreset) {
    const newPreset = scheme === "dark" ? "dark" : "light";
    localStorage.setItem(PRESET_KEY, newPreset);
    root.setAttribute("data-branding", newPreset);
    root.setAttribute("data-theme", "default");
  }
}

export function toggleColorScheme(): ColorScheme {
  const current = getColorScheme();
  const next: ColorScheme = current === "dark" ? "light" : "dark";
  setColorScheme(next);
  return next;
}
