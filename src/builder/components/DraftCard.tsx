import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Copy, FileText, Calendar, Upload, CheckCircle, Loader2 } from "lucide-react";
import JSZip from "jszip";
import type { Draft } from "../builderStorage";
import { buildZipData, duplicateDraft } from "../builderStorage";

interface DraftCardProps {
  draft: Draft;
  onDuplicated: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  "Débutant": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Intermédiaire": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Avancé": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "Expert": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "Tous niveaux": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const getLevelColor = (level: string) =>
  LEVEL_COLORS[level] ?? LEVEL_COLORS["Tous niveaux"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const DraftCard = ({ draft, onDuplicated }: DraftCardProps) => {
  const { metadata, modules, updatedAt } = draft;
  const moduleCount = modules.length;
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    duplicateDraft(draft.id);
    onDuplicated();
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isExporting) return;
    setIsExporting(true);
    setExportDone(false);
    try {
      const { metadataJson, planMarkdown, modules: mods } = buildZipData(draft);
      const zip = new JSZip();
      const folder = zip.folder(draft.id);
      if (!folder) return;
      folder.file("metadata.json", metadataJson + "\n");
      folder.file("00_Plan.md", planMarkdown);
      for (const mod of mods) folder.file(mod.filename, mod.content);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${draft.id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 2500);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="group relative bg-surface border border-border-subtle rounded-2xl hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Action buttons — visible on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleDuplicate}
          title="Dupliquer"
          className="p-1.5 rounded-lg bg-surface border border-border shadow-sm hover:bg-surface-muted hover:border-primary/30 transition-colors text-brand-muted hover:text-primary"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={handlePublish}
          title={isExporting ? "Export en cours..." : exportDone ? "Téléchargé !" : "Exporter le ZIP"}
          disabled={isExporting}
          className="p-1.5 rounded-lg bg-surface border border-border shadow-sm hover:bg-primary/10 hover:border-primary/30 transition-colors text-brand-muted hover:text-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 size={13} className="animate-spin" />
          ) : exportDone ? (
            <CheckCircle size={13} className="text-green-500" />
          ) : (
            <Upload size={13} />
          )}
        </button>
      </div>

      <Link to={`/builder/${draft.id}`} className="block p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3 pr-16">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-brand-text truncate group-hover:text-primary transition-colors">
              {metadata.displayName || "Sans titre"}
            </h3>
            {metadata.description && (
              <p className="text-sm text-brand-muted mt-1 line-clamp-2">
                {metadata.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {metadata.type && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {metadata.type}
              </span>
            )}
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getLevelColor(metadata.level)}`}>
              {metadata.level}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-brand-muted mb-3">
          {metadata.estimatedDuration && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {metadata.estimatedDuration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FileText size={14} />
            {moduleCount} module{moduleCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            Modifié le {formatDate(updatedAt)}
          </span>
        </div>

        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {metadata.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-surface-muted text-brand-subtle border border-border-subtle">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  );
};
