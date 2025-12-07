import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  FileText,
  Maximize,
  Minimize,
  Lock,
  Unlock,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ViewMode } from "../types";
import { useState } from "react";

interface HeaderProps {
  presentationId: string | undefined;
  title: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  moduleTitle?: string;
  presentationName?: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isControlsLocked?: boolean;
  onToggleControlsLock?: () => void;
  onExportPDF?: () => Promise<void>;
}

export const Header = ({
  presentationId,
  title,
  viewMode,
  onViewModeChange,
  moduleTitle,
  presentationName,
  isFullscreen,
  onToggleFullscreen,
  isControlsLocked = false,
  onToggleControlsLock,
  onExportPDF,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!onExportPDF) return;
    setIsExporting(true);
    try {
      await onExportPDF();
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-sm text-white py-4 px-6 shadow-lg border-b border-white/10 z-20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <motion.button
          onClick={() => navigate(`/presentations/${presentationId}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Retour</span>
        </motion.button>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="text-xl sm:text-2xl font-bold text-center flex-1 min-w-0 truncate"
        >
          {viewMode === "presentation"
            ? presentationName || title
            : moduleTitle || title}
        </motion.h1>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 bg-white/5 rounded-lg p-1">
            <motion.button
              onClick={() => onViewModeChange("presentation")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === "presentation"
                  ? "bg-white text-primary shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Présentation</span>
            </motion.button>
            <motion.button
              onClick={() => onViewModeChange("support")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === "support"
                  ? "bg-white text-primary shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Support</span>
            </motion.button>
          </div>

          {viewMode === "presentation" && onToggleControlsLock && (
            <motion.button
              onClick={onToggleControlsLock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all h-[42px] ${
                isControlsLocked
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title={
                isControlsLocked
                  ? "Contrôles verrouillés - Cliquez pour déverrouiller"
                  : "Verrouiller les contrôles"
              }
            >
              {isControlsLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </motion.button>
          )}
          {viewMode === "presentation" && (
            <motion.button
              onClick={onToggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all text-white/70 hover:text-white hover:bg-white/10 h-[42px]"
              title={
                isFullscreen
                  ? "Quitter le plein écran (Esc)"
                  : "Plein écran (F11)"
              }
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </motion.button>
          )}
          {viewMode === "support" && onExportPDF && (
            <motion.button
              onClick={handleExportPDF}
              disabled={isExporting}
              whileHover={{ scale: isExporting ? 1 : 1.05 }}
              whileTap={{ scale: isExporting ? 1 : 0.95 }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all h-[42px] ${
                isExporting
                  ? "bg-white/10 text-white/40 cursor-wait"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
              title="Exporter en PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">
                {isExporting ? "Export..." : "Exporter"}
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
