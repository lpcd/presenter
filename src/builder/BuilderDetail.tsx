import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Download, Pencil, X, GripVertical, Loader2, CheckCircle } from "lucide-react";
import JSZip from "jszip";
import {
  getDraft,
  updateDraftMetadata,
  addModule,
  deleteModule,
  deleteDraft,
  reorderModules,
  buildZipData,
  type Draft,
  type DraftMetadata,
} from "./builderStorage";
import { DeleteModal } from "./components/DeleteModal";
import { ThemeToggle } from "../components/ThemeToggle";

const LEVEL_OPTIONS = [
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Expert",
  "Tous niveaux",
];

const LEVEL_COLORS: Record<string, string> = {
  "Débutant": "bg-green-100 text-green-800",
  "Intermédiaire": "bg-blue-100 text-blue-800",
  "Avancé": "bg-orange-100 text-orange-800",
  "Expert": "bg-red-100 text-red-800",
  "Tous niveaux": "bg-gray-100 text-gray-700",
};

const BuilderDetail = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const navigate = useNavigate();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  // Delete states
  const [deleteModuleTarget, setDeleteModuleTarget] = useState<number | null>(null);
  const [showDeleteDraft, setShowDeleteDraft] = useState(false);

  // Drag-and-drop state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!draftId) return;
    const found = getDraft(draftId);
    if (!found) {
      setNotFound(true);
    } else {
      setDraft(found);
    }
  }, [draftId]);

  const persistMetadata = useCallback(
    (partial: Partial<DraftMetadata>) => {
      if (!draftId) return;
      const updated = updateDraftMetadata(draftId, partial);
      if (updated) setDraft(updated);
    },
    [draftId],
  );

  const handleField = useCallback(<K extends keyof DraftMetadata>(
    key: K,
    value: DraftMetadata[K],
  ) => {
    setDraft((prev) =>
      prev ? { ...prev, metadata: { ...prev.metadata, [key]: value } } : prev,
    );
    persistMetadata({ [key]: value });
  }, [persistMetadata]);

  const addTag = useCallback((raw: string) => {
    const tag = raw.trim();
    if (!tag || !draft) return;
    const exists = draft.metadata.tags.some(
      (t) => t.toLowerCase() === tag.toLowerCase(),
    );
    if (exists) return;
    handleField("tags", [...draft.metadata.tags, tag]);
  }, [draft, handleField]);

  const removeTag = useCallback((tag: string) => {
    if (!draft) return;
    handleField(
      "tags",
      draft.metadata.tags.filter((t) => t !== tag),
    );
  }, [draft, handleField]);

  const handleAddModule = () => {
    if (!draftId) return;
    const newModule = addModule(draftId);
    if (newModule) {
      navigate(`/builder/${draftId}/module/${newModule.index}`);
    }
  };

  const handleConfirmDeleteModule = () => {
    if (deleteModuleTarget === null || !draftId) return;
    deleteModule(draftId, deleteModuleTarget);
    setDeleteModuleTarget(null);
    const refreshed = getDraft(draftId);
    setDraft(refreshed);
  };

  const handleConfirmDeleteDraft = () => {
    if (!draftId) return;
    deleteDraft(draftId);
    navigate("/builder");
  };

  const handleExportZip = async () => {
    if (!draft || isExporting) return;
    setIsExporting(true);
    setExportDone(false);
    try {
      const { metadataJson, planMarkdown, modules } = buildZipData(draft);
      const zip = new JSZip();
      const folder = zip.folder(draft.id);
      if (!folder) return;

      folder.file("metadata.json", metadataJson + "\n");
      folder.file("00_Plan.md", planMarkdown);
      for (const mod of modules) {
        folder.file(mod.filename, mod.content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${draft.id}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2500);
    } finally {
      setIsExporting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-brand-page flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-brand-text">
            Ébauche introuvable
          </h1>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white"
          >
            <ArrowLeft size={16} />
            Retour aux ébauches
          </Link>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-brand-page flex items-center justify-center">
        <p className="text-brand-muted">Chargement...</p>
      </div>
    );
  }

  const sortedModules = [...draft.modules].sort((a, b) => a.index - b.index);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-page via-surface to-brand-page p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="bg-surface border border-border-subtle rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-muted text-brand-text hover:bg-surface-strong transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Ébauches
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-brand-text">
                  {draft.metadata.displayName || "Sans titre"}
                </h1>
                <p className="text-xs text-brand-subtle mt-0.5">
                  ID : {draft.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleExportZip}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : exportDone ? (
                  <CheckCircle size={16} />
                ) : (
                  <Download size={16} />
                )}
                {isExporting ? "Export..." : exportDone ? "Téléchargé !" : "Exporter (.zip)"}
              </button>
              <button
                onClick={() => setShowDeleteDraft(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                title="Supprimer l'ébauche"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Metadata form */}
        <section className="bg-surface border border-border-subtle rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-brand-text">
            Métadonnées
          </h2>

          <div className="space-y-2">
            <label className="text-sm text-brand-muted">Nom</label>
            <input
              value={draft.metadata.displayName}
              onChange={(e) => handleField("displayName", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-brand-text text-sm"
              placeholder="Nom de la formation"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-brand-muted">
              Description{" "}
              <span className="text-brand-subtle">(génère le Plan)</span>
            </label>
            <textarea
              value={draft.metadata.description}
              onChange={(e) => handleField("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-brand-text text-sm resize-none"
              placeholder="Décrivez la formation..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-brand-muted">Type</label>
              <input
                value={draft.metadata.type}
                onChange={(e) => handleField("type", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-brand-text text-sm"
                placeholder="Formation, Atelier..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-brand-muted">Niveau</label>
              <select
                value={draft.metadata.level}
                onChange={(e) => handleField("level", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-brand-text text-sm"
              >
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {draft.metadata.level && (
            <div>
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${LEVEL_COLORS[draft.metadata.level] ?? LEVEL_COLORS["Tous niveaux"]}`}
              >
                {draft.metadata.level}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-brand-muted">Durée estimée</label>
            <input
              value={draft.metadata.estimatedDuration}
              onChange={(e) =>
                handleField("estimatedDuration", e.target.value)
              }
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-brand-text text-sm"
              placeholder="2h, 3h30..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-brand-muted">Tags</label>
            <div className="w-full px-3 py-2 rounded-lg border border-border bg-surface min-h-[44px] flex flex-wrap items-center gap-2">
              {draft.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary-dark"
                    aria-label={`Supprimer ${tag}`}
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(tagDraft);
                    setTagDraft("");
                  }
                  if (e.key === "Backspace" && tagDraft.length === 0) {
                    const last = draft.metadata.tags.at(-1);
                    if (last) removeTag(last);
                  }
                }}
                onBlur={() => {
                  addTag(tagDraft);
                  setTagDraft("");
                }}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-brand-text placeholder-brand-subtle"
                placeholder="Ajouter un tag (Entrée ou virgule)"
              />
            </div>
          </div>
        </section>

        {/* Modules list */}
        <section className="bg-surface border border-border-subtle rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-brand-text">
              Modules{" "}
              <span className="text-brand-subtle font-normal text-sm">
                ({sortedModules.length})
              </span>
            </h2>
            <button
              onClick={handleAddModule}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              <Plus size={15} />
              Ajouter un module
            </button>
          </div>

          {sortedModules.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl p-8 text-center text-brand-muted text-sm">
              Aucun module pour l'instant.{" "}
              <button
                onClick={handleAddModule}
                className="text-primary underline underline-offset-2"
              >
                Créer le premier module
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {sortedModules.map((mod, listIdx) => {
                const titleMatch = mod.markdown.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : mod.filename;
                const wordCount = mod.markdown.split(/\s+/).length;
                const estimatedMin = Math.max(5, Math.round(wordCount / 130) * 5);
                const duration =
                  estimatedMin >= 60
                    ? `${Math.floor(estimatedMin / 60)}h${estimatedMin % 60 > 0 ? estimatedMin % 60 : ""}`
                    : `${estimatedMin}min`;
                const isDragOver = dragOverIndex === listIdx;

                return (
                  <li
                    key={mod.index}
                    draggable
                    onDragStart={() => { dragIndexRef.current = listIdx; }}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIndex(listIdx); }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={() => {
                      const from = dragIndexRef.current;
                      if (from === null || from === listIdx || !draftId) return;
                      const newOrder = [...sortedModules];
                      const [moved] = newOrder.splice(from, 1);
                      newOrder.splice(listIdx, 0, moved);
                      const updated = reorderModules(draftId, newOrder.map((m) => m.index));
                      if (updated) setDraft(updated);
                      dragIndexRef.current = null;
                      setDragOverIndex(null);
                    }}
                    onDragEnd={() => { dragIndexRef.current = null; setDragOverIndex(null); }}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors group cursor-grab active:cursor-grabbing ${
                      isDragOver
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-border-subtle hover:border-primary/30 hover:bg-surface-muted"
                    }`}
                  >
                    <span className="shrink-0 text-brand-subtle opacity-40 group-hover:opacity-80 transition-opacity">
                      <GripVertical size={15} />
                    </span>
                    <Link
                      to={`/builder/${draftId}/module/${mod.index}`}
                      className="flex-1 min-w-0 flex items-center gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {String(mod.index).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-brand-text truncate">
                          {title}
                        </span>
                        <span className="block text-xs text-brand-subtle">
                          {mod.filename} · ~{duration}
                        </span>
                      </span>
                    </Link>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/builder/${draftId}/module/${mod.index}`}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-brand-muted hover:text-primary transition-colors"
                        title="Éditer"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteModuleTarget(mod.index)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-brand-muted hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Delete module modal */}
      <DeleteModal
        isOpen={deleteModuleTarget !== null}
        title="Supprimer ce module ?"
        description="Cette action est irréversible. Le contenu du module sera définitivement supprimé."
        confirmLabel="Supprimer le module"
        onConfirm={handleConfirmDeleteModule}
        onCancel={() => setDeleteModuleTarget(null)}
      />

      {/* Delete draft modal */}
      <DeleteModal
        isOpen={showDeleteDraft}
        title="Supprimer cette ébauche ?"
        description={`"${draft.metadata.displayName}" et tous ses modules seront définitivement supprimés.`}
        confirmLabel="Supprimer l'ébauche"
        onConfirm={handleConfirmDeleteDraft}
        onCancel={() => setShowDeleteDraft(false)}
      />
    </div>
  );
};

export default BuilderDetail;
