import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, FilePenLine, Palette, Search, X } from "lucide-react";
import Presentations from "./components/Presentations.tsx";
import { getAllPresentations, type PresentationData } from "../presentation";
import { appConfig, type BrandingPresetId } from "../config";
import { ThemeToggle } from "../components/ThemeToggle";

// Preset color swatches (visual representation of each theme)
const PRESET_SWATCHES: Record<string, { bg: string; ring: string; label: string }> = {
  light: { bg: "bg-white border border-gray-200", ring: "ring-gray-400", label: "☀ Light" },
  dark: { bg: "bg-gray-900", ring: "ring-gray-600", label: "🌙 Dark" },
  blue: { bg: "bg-blue-600", ring: "ring-blue-400", label: "💙 Blue" },
  contrast: { bg: "bg-black", ring: "ring-rose-500", label: "⚡ Contrast" },
  ocean: { bg: "bg-teal-500", ring: "ring-teal-300", label: "🌊 Ocean" },
};

const Home = () => {
  const { homeConfig } = appConfig;
  const { branding, debug } = appConfig;
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState<BrandingPresetId>(
    branding.preset.selectedPreset as BrandingPresetId,
  );
  const [themeOpen, setThemeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const themeRef = useRef<HTMLDivElement>(null);

  const presentationsCount = useMemo(() => presentations.length, [presentations.length]);

  useEffect(() => {
    try {
      const allPresentations = getAllPresentations();
      const filtered = homeConfig.hideExamplePresentation
        ? allPresentations.filter((p) => p.id !== "exemple")
        : allPresentations;
      setPresentations(filtered);
    } catch (error) {
      console.error("Erreur lors du chargement des présentations:", error);
    } finally {
      setLoading(false);
    }
  }, [homeConfig.hideExamplePresentation]);

  useEffect(() => {
    if (!branding.enabled) return;
    const cachedPreset = localStorage.getItem(branding.preset.storageKey);
    const isValidPreset = branding.preset.availablePresets.some((p) => p.id === cachedPreset);
    if (cachedPreset && isValidPreset) {
      setSelectedPresetId(cachedPreset as BrandingPresetId);
      return;
    }
    setSelectedPresetId(branding.preset.selectedPreset as BrandingPresetId);
  }, [branding]);

  // Close theme popover on outside click or Escape
  useEffect(() => {
    if (!themeOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setThemeOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [themeOpen]);

  const applyPreset = (presetId: BrandingPresetId) => {
    const preset = branding.preset.availablePresets.find((p) => p.id === presetId);
    if (!preset) return;
    const root = document.documentElement;
    root.setAttribute("data-branding", preset.id);
    root.setAttribute("data-theme", preset.themeId);
    root.setAttribute("data-color-scheme", preset.colorScheme);
    localStorage.setItem(branding.preset.storageKey, preset.id);
    localStorage.setItem(branding.theme.storageKey, preset.themeId);
    localStorage.setItem(branding.mode.storageKey, preset.colorScheme);
    setSelectedPresetId(preset.id);
    setThemeOpen(false);
  };

  // Filter presentations by search query
  const filteredPresentations = useMemo(() => {
    if (!searchQuery.trim()) return presentations;
    const q = searchQuery.toLowerCase();
    return presentations.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [presentations, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-page">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-muted text-lg">Chargement des présentations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-page via-surface to-brand-page">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-surface/85 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            {homeConfig.icon ? (
              <img src={homeConfig.icon} alt="Logo" className="w-10 h-10 rounded-lg shadow-md object-cover" />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap size={24} className="text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-brand-text">{homeConfig.title}</h1>
              <p className="text-sm text-brand-muted">{homeConfig.subtitle}</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-subtle pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une formation..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-surface text-brand-text text-sm placeholder-brand-subtle focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-subtle hover:text-brand-text transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface text-brand-text text-sm hover:bg-surface-muted transition-colors"
            >
              <FilePenLine size={16} />
              <span className="hidden sm:inline">Builder</span>
            </Link>

            <ThemeToggle />

            {/* Theme switcher — compact icon + popover */}
            {branding.enabled && debug.showBrandingPresetSelector && (
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setThemeOpen((v) => !v)}
                  title="Changer de thème"
                  className={`p-2 rounded-lg border transition-colors ${
                    themeOpen
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface text-brand-muted hover:bg-surface-muted hover:text-brand-text"
                  }`}
                >
                  <Palette size={17} />
                </button>

                {themeOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-2xl shadow-xl p-3 min-w-[200px] z-50">
                    <p className="text-xs font-medium text-brand-subtle mb-2.5 px-1">Thème de l'interface</p>
                    <div className="space-y-1">
                      {branding.preset.availablePresets.map((preset) => {
                        const swatch = PRESET_SWATCHES[preset.id];
                        const isActive = selectedPresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => applyPreset(preset.id as BrandingPresetId)}
                            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors text-left ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-surface-muted text-brand-text"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full shrink-0 ${swatch?.bg ?? "bg-gray-400"} ${
                                isActive ? `ring-2 ring-offset-1 ${swatch?.ring ?? "ring-primary"}` : ""
                              }`}
                            />
                            <span className="text-sm">{preset.label}</span>
                            {isActive && (
                              <span className="ml-auto text-primary">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <span className="text-sm text-brand-muted hidden lg:inline">
              {filteredPresentations.length !== presentationsCount
                ? `${filteredPresentations.length} / ${presentationsCount}`
                : `${presentationsCount}`}{" "}
              présentation{presentationsCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-8 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
            {homeConfig.heroTitle}
          </h1>
        </div>
      </motion.section>

      {filteredPresentations.length === 0 && searchQuery ? (
        <div className="max-w-7xl mx-auto px-4 pb-16 text-center">
          <p className="text-brand-muted">
            Aucune formation trouvée pour <strong>"{searchQuery}"</strong>.
          </p>
          <button onClick={() => setSearchQuery("")} className="mt-2 text-primary text-sm underline underline-offset-2">
            Effacer la recherche
          </button>
        </div>
      ) : (
        <Presentations presentations={filteredPresentations} />
      )}

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="py-12 px-4 text-center text-brand-muted border-t border-border"
      >
        <p>© 2025 - {homeConfig.footer}</p>
      </motion.footer>
    </div>
  );
};

export default Home;
