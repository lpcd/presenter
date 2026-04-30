import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { getColorScheme, toggleColorScheme, type ColorScheme } from "../utils/theme";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const [scheme, setScheme] = useState<ColorScheme>(getColorScheme);

  // Sync if changed by another component (e.g. the preset selector)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute("data-color-scheme");
      setScheme(attr === "dark" ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-scheme"],
    });
    return () => observer.disconnect();
  }, []);

  const handleToggle = () => {
    const next = toggleColorScheme();
    setScheme(next);
  };

  return (
    <button
      onClick={handleToggle}
      title={scheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`p-2 rounded-lg border border-border bg-surface text-brand-muted hover:bg-surface-muted hover:text-brand-text transition-colors ${className}`}
      aria-label={scheme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      {scheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};
