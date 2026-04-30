import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Home, FilePenLine, ChevronRight } from "lucide-react";
import { getAllPresentations } from "../presentation";
import { loadDrafts } from "../builder/builderStorage";

// Icons are stable values — declared outside the component to avoid
// constructing JSX nodes inside try/catch blocks (react-hooks/error-boundaries).
const ICON_HOME = <Home size={15} />;
const ICON_FILE_TEXT = <FileText size={15} />;
const ICON_FILE_PEN = <FilePenLine size={15} />;

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus when the palette opens.
  // We only call setState inside the setTimeout callback (not synchronously in
  // the effect body) to avoid cascading renders (react-hooks/set-state-in-effect).
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      setQuery("");
      setSelectedIdx(0);
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  const allCommands = useMemo((): CommandItem[] => {
    const items: CommandItem[] = [
      {
        id: "home",
        label: "Accueil",
        description: "Retourner à la liste des formations",
        icon: ICON_HOME,
        action: () => { navigate("/"); onClose(); },
        category: "Navigation",
      },
      {
        id: "builder",
        label: "Mes ébauches",
        description: "Ouvrir le Builder",
        icon: ICON_FILE_PEN,
        action: () => { navigate("/builder"); onClose(); },
        category: "Navigation",
      },
    ];

    // Add presentations — JSX icons must NOT be constructed inside try/catch;
    // use the stable constants declared at module level instead.
    try {
      const presentations = getAllPresentations();
      for (const p of presentations) {
        items.push({
          id: `pres-${p.id}`,
          label: p.name,
          description: p.description,
          icon: ICON_FILE_TEXT,
          action: () => { navigate(`/presentations/${p.id}`); onClose(); },
          category: "Formations",
        });
      }
    } catch { /* ignore */ }

    // Add drafts
    try {
      const drafts = loadDrafts();
      for (const d of drafts) {
        items.push({
          id: `draft-${d.id}`,
          label: d.metadata.displayName || d.id,
          description: `Ébauche · ${d.modules.length} module${d.modules.length !== 1 ? "s" : ""}`,
          icon: ICON_FILE_PEN,
          action: () => { navigate(`/builder/${d.id}`); onClose(); },
          category: "Ébauches",
        });
      }
    } catch { /* ignore */ }

    return items;
  }, [navigate, onClose]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [allCommands, query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return map;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatFiltered = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, flatFiltered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatFiltered[selectedIdx]) {
        flatFiltered[selectedIdx].action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, flatFiltered, selectedIdx, onClose]);

  if (!isOpen) return null;

  // Compute flat index offset per group for highlighting
  const indexMap = new Map<string, number>();
  let runningIdx = 0;
  for (const [, items] of grouped) {
    for (const item of items) {
      indexMap.set(item.id, runningIdx++);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={17} className="text-brand-subtle shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            placeholder="Rechercher une formation, une ébauche..."
            className="flex-1 bg-transparent outline-none text-brand-text placeholder-brand-subtle text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border text-xs text-brand-subtle">
            Échap
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-center text-brand-muted text-sm py-8">
              Aucun résultat pour "{query}"
            </p>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => (
              <div key={category}>
                <p className="px-4 py-1.5 text-xs font-semibold text-brand-subtle uppercase tracking-wider">
                  {category}
                </p>
                {items.map((item) => {
                  const flatIdx = indexMap.get(item.id) ?? 0;
                  const isSelected = flatIdx === selectedIdx;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(flatIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-primary/10 text-primary" : "text-brand-text hover:bg-surface-muted"
                      }`}
                    >
                      <span className={`shrink-0 ${isSelected ? "text-primary" : "text-brand-subtle"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate">{item.label}</span>
                        {item.description && (
                          <span className="block text-xs text-brand-subtle truncate">{item.description}</span>
                        )}
                      </span>
                      {isSelected && <ChevronRight size={14} className="shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-brand-subtle">
          <span><kbd className="px-1 border border-border rounded">↑↓</kbd> naviguer</span>
          <span><kbd className="px-1 border border-border rounded">↵</kbd> ouvrir</span>
          <span><kbd className="px-1 border border-border rounded">Échap</kbd> fermer</span>
        </div>
      </div>
    </div>
  );
};
