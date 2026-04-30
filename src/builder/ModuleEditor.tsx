import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import JSZip from "jszip";
import mammoth from "mammoth";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Save,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  Timer,
  EyeOff,
  MonitorPlay,
  Code2,
  Type,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { MarkdownContent } from "../presentation/subpages/presentationMode/components/MarkdownContent";
import { SlideContent } from "../presentation/subpages/presentationMode/components/SlideContent";
import { parseMarkdown } from "../presentation/subpages/presentationMode/utils/markdownParser";
import { detectSpecialSlide } from "../presentation/subpages/presentationMode/utils/specialSlideDetector";
import {
  getDraft,
  addModule,
  updateModule,
  deleteModule,
  buildZipData,
  type Draft,
  type DraftModule,
} from "./builderStorage";
import { DeleteModal } from "./components/DeleteModal";
import { RichEditor, type RichEditorHandle } from "./components/RichEditor";

// ─── Types ───────────────────────────────────────────────────────────────────
type PreviewMode = "none" | "support" | "presentation";
type EditorMode = "codemirror" | "rich";
type SaveStatus = "saved" | "unsaved" | "saving";

const PREVIEW_DEBOUNCE_MS = 200;
const AUTO_SAVE_INTERVAL_MS = 3 * 60 * 1000;
const LS_PREVIEW_MODE = "presenter.editor.previewMode";
const LS_EDITOR_MODE = "presenter.editor.editorMode";

// ─── Templates ───────────────────────────────────────────────────────────────
const MODULE_TEMPLATES: Array<{ label: string; description: string; content: string }> = [
  {
    label: "Cours standard",
    description: "Structure classique avec introduction, sections et récapitulatif",
    content: `# Titre du module

## Introduction

Présentez ici le contexte et les objectifs de ce module.

## Objectifs

- Comprendre les concepts fondamentaux
- Savoir mettre en pratique les notions abordées
- Être capable d'appliquer les bonnes pratiques

## Section 1 — Concept principal

Expliquez le premier concept ici.

\`\`\`bash
# Exemple de commande
echo "Hello World"
\`\`\`

## Section 2 — Approfondissement

Développez ici avec des exemples concrets.

## Exercice

durée: 15min

## Récapitulatif

- Point clé 1
- Point clé 2
- Point clé 3
`,
  },
  {
    label: "Atelier pratique",
    description: "Centré sur la pratique avec exercices et démonstrations",
    content: `# Titre de l'atelier

## Objectifs

- Mettre en pratique les acquis théoriques
- Réaliser un projet concret

## Présentation du contexte

Décrivez le scénario ou le problème à résoudre.

## Démonstration

Montrez d'abord la solution finale attendue.

## Étape 1 — Mise en place

Instructions pas à pas pour la première étape.

\`\`\`bash
# Commandes à exécuter
mkdir mon-projet
cd mon-projet
\`\`\`

## Exercice

durée: 30min

## Étape 2 — Développement

Suite des instructions.

## Questions

## Récapitulatif

- Ce que vous avez réalisé
- Points importants à retenir
`,
  },
  {
    label: "Quiz / Évaluation",
    description: "Module d'évaluation avec questions vrai/faux et QCM",
    content: `# Évaluation — Titre

## Objectifs

Vérifier la compréhension des notions abordées.

## Question 1

Énoncé de la première question ?

- A) Réponse A
- B) Réponse B
- C) Réponse C (correcte)

## Vrai

Le soleil se lève à l'est.

## Faux

La terre est plate.

## Questions

Des questions sur ce module ?

## Récapitulatif

- Points essentiels évalués
- Ressources pour approfondir
`,
  },
  {
    label: "Page blanche",
    description: "Démarrer depuis zéro",
    content: `# Titre du module

## Section 1

Votre contenu ici...
`,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const detectColorMode = (): "light" | "dark" => {
  const mode = document.documentElement.getAttribute("data-color-scheme");
  return mode === "dark" ? "dark" : "light";
};

const decodeXmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const parsePptxToMarkdown = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideFiles = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => {
      const aNum = Number(a.match(/slide(\d+)\.xml$/)?.[1] || "0");
      const bNum = Number(b.match(/slide(\d+)\.xml$/)?.[1] || "0");
      return aNum - bNum;
    });

  if (slideFiles.length === 0) return "# Import PowerPoint\n\nAucun contenu détecté.";

  const slidesContent: string[] = ["# Import PowerPoint", ""];
  for (let i = 0; i < slideFiles.length; i++) {
    const xmlContent = await zip.files[slideFiles[i]].async("text");
    const textMatches = [...xmlContent.matchAll(/<a:t>(.*?)<\/a:t>/g)].map((m) =>
      decodeXmlEntities(m[1]).trim(),
    );
    const cleaned = textMatches.filter((t) => t.length > 0);
    slidesContent.push(`## Slide ${i + 1}`);
    slidesContent.push(...(cleaned.length === 0 ? ["- (Sans contenu)"] : cleaned.map((l) => `- ${l}`)));
    slidesContent.push("");
  }
  return slidesContent.join("\n");
};

const formatRelativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin === 1) return "il y a 1 min";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  return diffH === 1 ? "il y a 1h" : `il y a ${diffH}h`;
};

// Light theme for CodeMirror
const lightTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", fontSize: "14px" },
  ".cm-content": { fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", padding: "12px 0" },
  ".cm-line": { padding: "0 16px" },
  ".cm-gutters": { backgroundColor: "rgb(var(--color-surface-muted))", borderRight: "1px solid rgb(var(--color-border))", color: "rgb(var(--color-text-subtle))" },
  ".cm-activeLineGutter": { backgroundColor: "rgb(var(--color-surface-strong))" },
  ".cm-activeLine": { backgroundColor: "rgb(var(--color-surface-muted) / 0.6)" },
  ".cm-selectionBackground": { backgroundColor: "rgb(var(--color-primary) / 0.2) !important" },
  ".cm-focused .cm-selectionBackground": { backgroundColor: "rgb(var(--color-primary) / 0.3) !important" },
  ".cm-cursor": { borderLeftColor: "rgb(var(--color-primary))" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { overflow: "auto" },
});

// ─── Preview mode selector ────────────────────────────────────────────────────
const PREVIEW_OPTIONS: Array<{ value: PreviewMode; icon: React.ReactNode; label: string; title: string }> = [
  {
    value: "none",
    icon: <EyeOff size={15} />,
    label: "Aucun",
    title: "Pas d'aperçu — éditeur pleine largeur",
  },
  {
    value: "support",
    icon: <FileText size={15} />,
    label: "Support",
    title: "Aperçu style support (document)",
  },
  {
    value: "presentation",
    icon: <MonitorPlay size={15} />,
    label: "Présentation",
    title: "Aperçu style présentation (diapositives)",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const ModuleEditor = () => {
  const { draftId, moduleIndex } = useParams<{ draftId: string; moduleIndex: string }>();
  const navigate = useNavigate();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [currentModule, setCurrentModule] = useState<DraftModule | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const [markdownContent, setMarkdownContent] = useState("");
  const [previewMarkdownContent, setPreviewMarkdownContent] = useState("");

  // Persistent preferences
  const [previewMode, setPreviewMode] = useState<PreviewMode>(() => {
    const stored = localStorage.getItem(LS_PREVIEW_MODE);
    return (stored === "none" || stored === "support" || stored === "presentation") ? stored : "none";
  });
  const [editorMode, setEditorMode] = useState<EditorMode>(() => {
    const stored = localStorage.getItem(LS_EDITOR_MODE);
    return stored === "codemirror" ? "codemirror" : "rich";
  });

  const [currentPreviewSlide, setCurrentPreviewSlide] = useState(0);
  const [colorMode, setColorMode] = useState<"light" | "dark">(detectColorMode());

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [, setTick] = useState(0); // forces re-render for relative time
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingMarkdownRef = useRef<string>("");
  const richEditorRef = useRef<RichEditorHandle | null>(null);

  // Persist preferences
  useEffect(() => { localStorage.setItem(LS_PREVIEW_MODE, previewMode); }, [previewMode]);
  useEffect(() => { localStorage.setItem(LS_EDITOR_MODE, editorMode); }, [editorMode]);

  // Watch color-scheme changes
  useEffect(() => {
    const observer = new MutationObserver(() => setColorMode(detectColorMode()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-scheme"] });
    return () => observer.disconnect();
  }, []);

  // Load draft/module
  useEffect(() => {
    if (!draftId) return;
    const found = getDraft(draftId);
    if (!found) { setNotFound(true); return; }
    setDraft(found);

    if (moduleIndex === "new") {
      setShowTemplates(true);
      const newMod = addModule(draftId);
      if (!newMod) { setNotFound(true); return; }
      setCurrentModule(newMod);
      setMarkdownContent(newMod.markdown);
      setPreviewMarkdownContent(newMod.markdown);
      navigate(`/builder/${draftId}/module/${newMod.index}`, { replace: true });
    } else {
      const idx = parseInt(moduleIndex ?? "0");
      const mod = found.modules.find((m) => m.index === idx);
      if (!mod) { setNotFound(true); return; }
      setCurrentModule(mod);
      setMarkdownContent(mod.markdown);
      setPreviewMarkdownContent(mod.markdown);
      setLastSavedAt(mod.updatedAt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId, moduleIndex]);

  // Debounce preview
  useEffect(() => {
    const t = window.setTimeout(() => setPreviewMarkdownContent(markdownContent), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [markdownContent]);

  // Track unsaved — pendingMarkdownRef always mirrors markdownContent
  useEffect(() => {
    pendingMarkdownRef.current = markdownContent;
    if (!currentModule) return;
    if (markdownContent !== currentModule.markdown) {
      setSaveStatus("unsaved");
      // Clear title error as soon as the user edits (re-validate on next save)
      if (titleError) setTitleError(null);
    }
  }, [markdownContent, currentModule, titleError]);

  const save = useCallback(
    (content: string) => {
      if (!draftId || !currentModule) return;
      // Validate: must have a non-empty H1 title
      const titleMatch = content.match(/^#\s+(.+)$/m);
      if (!titleMatch || !titleMatch[1].trim()) {
        setTitleError("Le module doit commencer par un titre (# Titre du module).");
        return;
      }
      setTitleError(null);
      setSaveStatus("saving");
      const updated = updateModule(draftId, currentModule.index, content);
      if (updated) {
        setCurrentModule(updated);
        setLastSavedAt(updated.updatedAt);
        setSaveStatus("saved");
      }
    },
    [draftId, currentModule],
  );

  // Auto-save every 3 min — does NOT depend on saveStatus to avoid resetting the timer on each keystroke
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (saveStatus === "unsaved") save(pendingMarkdownRef.current);
    }, AUTO_SAVE_INTERVAL_MS);
    return () => { if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  // Refresh relative time display every 30s
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        save(pendingMarkdownRef.current ?? markdownContent);
      }
      // Ctrl+Shift+P cycles through preview modes
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setPreviewMode((prev) => {
          const idx = PREVIEW_OPTIONS.findIndex((o) => o.value === prev);
          return PREVIEW_OPTIONS[(idx + 1) % PREVIEW_OPTIONS.length].value;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [save, markdownContent]);

  // Auto-save before switching editor mode if unsaved
  const handleEditorModeChange = (mode: EditorMode) => {
    if (saveStatus === "unsaved") {
      save(pendingMarkdownRef.current ?? markdownContent);
    }
    setEditorMode(mode);
  };

  const handleConfirmDelete = () => {
    if (!draftId || !currentModule) return;
    deleteModule(draftId, currentModule.index);
    navigate(`/builder/${draftId}`);
  };

  const handleExportZip = async () => {
    if (!draft || !draftId) return;
    save(markdownContent);
    const refreshed = getDraft(draftId);
    if (!refreshed) return;
    const { metadataJson, planMarkdown, modules } = buildZipData(refreshed);
    const zip = new JSZip();
    const folder = zip.folder(refreshed.id);
    if (!folder) return;
    folder.file("metadata.json", metadataJson + "\n");
    folder.file("00_Plan.md", planMarkdown);
    for (const mod of modules) folder.file(mod.filename, mod.content);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${refreshed.id}.zip`;
    document.body.appendChild(a); a.click(); a.remove();
    // Revoke after a short delay so the browser has time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);
    setIsImporting(true);
    try {
      const lower = file.name.toLowerCase();
      let imported = "";
      if (lower.endsWith(".md") || lower.endsWith(".txt")) {
        imported = await file.text();
      } else if (lower.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        imported = `# Import Word\n\n${result.value.trim()}`;
      } else if (lower.endsWith(".pptx")) {
        imported = await parsePptxToMarkdown(await file.arrayBuffer());
      } else if (lower.endsWith(".zip")) {
        const zipFile = await JSZip.loadAsync(await file.arrayBuffer());
        const mdFiles = Object.keys(zipFile.files)
          .filter((p) => !zipFile.files[p].dir && p.toLowerCase().endsWith(".md"))
          .sort();
        const preferred =
          mdFiles.find((p) => /\/01_module\.md$/i.test(p)) ||
          mdFiles.find((p) => /\/01_.*\.md$/i.test(p)) ||
          mdFiles.find((p) => !/\/00_plan\.md$/i.test(p)) ||
          mdFiles[0];
        if (!preferred) throw new Error("Aucun fichier Markdown trouvé dans le .zip.");
        imported = await zipFile.files[preferred].async("text");
      } else {
        throw new Error("Format non supporté. Utilisez .zip, .md, .txt, .docx ou .pptx.");
      }
      setMarkdownContent(imported || "# Nouveau module\n\n");
      setSaveStatus("unsaved");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Erreur pendant l'import.");
    } finally {
      setIsImporting(false);
    }
  };

  const applyTemplate = (content: string) => {
    setMarkdownContent(content);
    setSaveStatus("unsaved");
    setShowTemplates(false);
  };

  // ─── Preview computed ─────────────────────────────────────────────────────
  const deferredPreview = useDeferredValue(previewMarkdownContent);

  const parsedContent = useMemo(
    () => (previewMode === "support" ? parseMarkdown(deferredPreview, false) : parseMarkdown(deferredPreview)),
    [deferredPreview, previewMode],
  );

  const supportSections = useMemo(() => {
    if (previewMode !== "support") return [];
    return parsedContent.sections
      .filter((s) => !s.duplicateInfo || s.duplicateInfo.isFirst)
      .filter((s) => !detectSpecialSlide(s.heading, s.content, s.level).type)
      .map((s) => (s.duplicateInfo && s.mergedContent ? { ...s, content: s.mergedContent } : s));
  }, [parsedContent.sections, previewMode]);

  const moduleTitle = parsedContent.title || currentModule?.filename || "Module";
  const totalSlides = previewMode === "presentation" ? parsedContent.sections.length + 1 : 1;

  useEffect(() => setCurrentPreviewSlide(0), [previewMode, deferredPreview]);
  useEffect(() => {
    setCurrentPreviewSlide((p) => Math.min(p, Math.max(totalSlides - 1, 0)));
  }, [totalSlides]);

  // Stats
  const stats = useMemo(() => {
    const words = markdownContent.trim() ? markdownContent.trim().split(/\s+/).length : 0;
    const slides = parsedContent.sections.length + 1;
    const readMin = Math.max(1, Math.round(words / 200));
    const presMin = Math.max(1, slides * 2);
    return { words, slides, readMin, presMin };
  }, [markdownContent, parsedContent.sections.length]);

  // CodeMirror extensions
  const extensions = useMemo(
    () => [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      EditorView.lineWrapping,
      lightTheme,
    ],
    [],
  );

  // ─── Layout helpers ───────────────────────────────────────────────────────
  const hasPreview = previewMode !== "none";
  const editorHeight = "680px";

  // ─── Not found / loading states ──────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-brand-page flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold text-brand-text">Module introuvable</h1>
          <Link to={`/builder/${draftId ?? ""}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white">
            <ArrowLeft size={16} /> Retour à l'ébauche
          </Link>
        </div>
      </div>
    );
  }

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-brand-page flex items-center justify-center">
        <p className="text-brand-muted">Chargement...</p>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-page via-surface to-brand-page p-4 sm:p-6">
      <div className="mx-auto space-y-4">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <Link to="/builder" className="text-xs text-brand-subtle hover:text-primary transition-colors shrink-0">
                Ébauches
              </Link>
              <span className="text-brand-subtle text-xs">/</span>
              <Link to={`/builder/${draftId}`} className="text-xs text-brand-subtle hover:text-primary transition-colors truncate max-w-[140px]">
                {draft?.metadata.displayName || draftId}
              </Link>
              <span className="text-brand-subtle text-xs">/</span>
              <span className="text-xs font-medium text-brand-text truncate max-w-[160px]">
                {moduleTitle}
              </span>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Stats */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-muted border border-border-subtle text-xs text-brand-subtle">
                <span className="flex items-center gap-1"><FileText size={12} /> {stats.words} mots</span>
                <span className="flex items-center gap-1"><Hash size={12} /> {stats.slides} slides</span>
                <span className="flex items-center gap-1"><Timer size={12} /> ~{stats.presMin}min</span>
              </div>

              {/* Save status */}
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-brand-muted">
                {saveStatus === "saved" && lastSavedAt ? (
                  <><CheckCircle size={13} className="text-green-500" />Sauvegardé {formatRelativeTime(lastSavedAt)}</>
                ) : saveStatus === "saving" ? (
                  <><Clock size={13} className="text-primary animate-pulse" />Sauvegarde...</>
                ) : (
                  <><Clock size={13} className="text-orange-400" />Non sauvegardé</>
                )}
              </span>

              <button
                onClick={() => save(markdownContent)}
                disabled={saveStatus === "saved"}
                title="Enregistrer (Ctrl+S)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-muted text-brand-text hover:bg-surface-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <Save size={14} /> Enregistrer
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-muted text-brand-text hover:bg-surface-strong transition-colors text-sm cursor-pointer">
                <Upload size={14} /> {isImporting ? "Import..." : "Importer"}
                <input type="file" accept=".zip,.md,.txt,.docx,.pptx" className="hidden" disabled={isImporting}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleImportFile(f); e.currentTarget.value = ""; }}
                />
              </label>

              <button
                onClick={handleExportZip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                <Download size={14} /> Exporter
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {importError && <p className="text-xs text-red-500 mt-2">{importError}</p>}
          {titleError && <p className="text-xs text-red-500 mt-2">{titleError}</p>}

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs text-brand-subtle">{currentModule.filename}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowTemplates((v) => !v)} className="text-xs text-primary hover:underline">
                Templates de démarrage
              </button>
              <span className="text-xs text-brand-subtle hidden sm:inline">
                · Ctrl+S sauvegarder · Ctrl+Shift+P changer de vue
              </span>
            </div>
          </div>
        </header>

        {/* ── Template picker ─────────────────────────────────────────────── */}
        {showTemplates && (
          <div className="bg-surface border border-border-subtle rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-brand-text">Choisir un template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-brand-subtle hover:text-brand-text text-xs">Fermer</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MODULE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.label}
                  onClick={() => applyTemplate(tpl.content)}
                  className="text-left p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-surface-muted transition-all group"
                >
                  <p className="text-sm font-medium text-brand-text group-hover:text-primary transition-colors">{tpl.label}</p>
                  <p className="text-xs text-brand-subtle mt-0.5">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Editor + Preview ─────────────────────────────────────────────── */}
        <div className={`grid gap-4 min-w-0 ${hasPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

          {/* ── Left: Editor panel ──────────────────────────────────────── */}
          <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
            {/* Editor toolbar bar */}
            <div className="px-4 py-2.5 border-b border-border-subtle flex items-center justify-between gap-2 flex-wrap">
              {/* Left: editor mode toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-muted border border-border">
                <button
                  type="button"
                  title="Éditeur Markdown (CodeMirror)"
                  onClick={() => handleEditorModeChange("codemirror")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    editorMode === "codemirror"
                      ? "bg-surface text-brand-text shadow-sm"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <Code2 size={13} />
                  <span className="hidden sm:inline">CodeMirror</span>
                </button>
                <button
                  type="button"
                  title="Éditeur enrichi avec toolbar"
                  onClick={() => handleEditorModeChange("rich")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    editorMode === "rich"
                      ? "bg-surface text-brand-text shadow-sm"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <Type size={13} />
                  <span className="hidden sm:inline">Enrichi</span>
                </button>
              </div>

              {/* Right: preview mode selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-muted border border-border">
                {PREVIEW_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.title}
                    onClick={() => setPreviewMode(opt.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      previewMode === opt.value
                        ? "bg-surface text-brand-text shadow-sm"
                        : "text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor area */}
            <div className="flex-1 overflow-visible">
              {editorMode === "codemirror" ? (
                <CodeMirror
                  value={markdownContent}
                  onChange={(val) => setMarkdownContent(val)}
                  extensions={extensions}
                  theme={colorMode === "dark" ? oneDark : "light"}
                  height={editorHeight}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: false,
                    rectangularSelection: true,
                    crosshairCursor: false,
                    highlightActiveLine: true,
                    highlightActiveLineGutter: true,
                    highlightSelectionMatches: true,
                    searchKeymap: true,
                  }}
                  className="text-sm"
                />
              ) : (
                <RichEditor
                  ref={richEditorRef}
                  value={markdownContent}
                  onChange={setMarkdownContent}
                  height={editorHeight}
                />
              )}
            </div>

            {/* Inline stats for mobile */}
            <div className="lg:hidden px-4 py-2 border-t border-border-subtle flex items-center gap-3 text-xs text-brand-subtle bg-surface-muted">
              <span className="flex items-center gap-1"><FileText size={11} />{stats.words} mots</span>
              <span className="flex items-center gap-1"><Hash size={11} />{stats.slides} slides</span>
            </div>
          </div>

          {/* ── Right: Preview panel ─────────────────────────────────────── */}
          {hasPreview && (
            <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-sm font-semibold text-brand-text">Rendu en direct</h2>
                <span className="text-xs text-brand-subtle">
                  {previewMode === "support" ? "Style support" : "Style présentation"}
                </span>
              </div>

              <div className="flex-1 overflow-hidden">
                {previewMode === "support" ? (
                  <div
                    className="rounded-b-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 overflow-auto"
                    style={{ height: editorHeight }}
                  >
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-6 mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center break-words">{moduleTitle}</h2>
                      </div>
                      <div className="bg-surface rounded-2xl shadow-2xl p-6 space-y-8 overflow-x-hidden support-content border border-border-subtle">
                        {supportSections.map((section, idx) => (
                          <article key={`${section.heading}-${idx}`}>
                            <h2 className={`font-bold text-primary mb-4 break-words ${
                              section.level === 2 ? "text-2xl sm:text-3xl" : section.level === 3 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                            }`}>
                              {section.heading}
                            </h2>
                            <MarkdownContent content={section.content} />
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-b-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 overflow-auto"
                    style={{ height: editorHeight }}
                  >
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3 h-full">
                      <div className="flex-1 w-full flex items-center justify-center min-h-0">
                        {currentPreviewSlide === 0 ? (
                          <div className="slide-content-container bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-8 w-full h-[520px] flex flex-col items-center justify-center text-center overflow-hidden">
                            <h2 className="text-3xl sm:text-4xl font-bold break-words">{moduleTitle}</h2>
                          </div>
                        ) : (
                          <SlideContent
                            section={parsedContent.sections[currentPreviewSlide - 1]}
                            slideIndex={currentPreviewSlide}
                            allSections={parsedContent.sections}
                            currentSectionIndex={currentPreviewSlide - 1}
                          />
                        )}
                      </div>
                      <div className="w-full flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 shrink-0">
                        <button
                          onClick={() => setCurrentPreviewSlide((p) => Math.max(0, p - 1))}
                          disabled={currentPreviewSlide === 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                          <ChevronLeft size={14} /> Préc.
                        </button>
                        <span className="text-sm text-white">{currentPreviewSlide + 1} / {totalSlides}</span>
                        <button
                          onClick={() => setCurrentPreviewSlide((p) => Math.min(totalSlides - 1, p + 1))}
                          disabled={currentPreviewSlide >= totalSlides - 1}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-primary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                        >
                          Suiv. <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        title="Supprimer ce module ?"
        description={`Le module "${currentModule.filename}" sera définitivement supprimé.`}
        confirmLabel="Supprimer le module"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ModuleEditor;
