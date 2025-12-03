import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  FileText,
  Maximize,
  Minimize,
  Lock,
  Unlock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ViewMode } from "../types";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  presentationId: string | undefined;
  title: string;
  currentSlide: number;
  totalSlides: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  moduleTitle?: string;
  presentationName?: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSlideChange?: (slide: number) => void;
  onEditingChange?: (isEditing: boolean) => void;
  isControlsLocked?: boolean;
  onToggleControlsLock?: () => void;
}

export const Header = ({
  presentationId,
  title,
  currentSlide,
  totalSlides,
  viewMode,
  onViewModeChange,
  moduleTitle,
  presentationName,
  isFullscreen,
  onToggleFullscreen,
  onSlideChange,
  onEditingChange,
  isControlsLocked = false,
  onToggleControlsLock,
}: HeaderProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSlideNumberClick = () => {
    if (viewMode === "presentation" && onSlideChange) {
      setInputValue(String(currentSlide + 1));
      setIsEditing(true);
      onEditingChange?.(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const slideNumber = parseInt(inputValue);
      if (slideNumber >= 1 && slideNumber <= totalSlides && onSlideChange) {
        onSlideChange(slideNumber - 1);
      }
      setIsEditing(false);
      onEditingChange?.(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      onEditingChange?.(false);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    onEditingChange?.(false);
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
          {/* Bouton plein écran (uniquement en mode présentation) */}
          {viewMode === "presentation" && (
            <motion.button
              onClick={onToggleFullscreen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all text-white/70 hover:text-white hover:bg-white/10"
              title={
                isFullscreen
                  ? "Quitter le plein écran (Esc)"
                  : "Plein écran (F11)"
              }
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </motion.button>
          )}
          {/* Bouton verrouillage contrôles (uniquement en mode présentation) */}
          {viewMode === "presentation" && onToggleControlsLock && (
            <motion.button
              onClick={onToggleControlsLock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
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
          {/* Toggle mode */}
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

          {/* Compteur de slides (uniquement en mode présentation) */}
          {viewMode === "presentation" && (
            <div
              className="text-white/60 text-sm font-medium px-4 py-2.5 bg-white/5 rounded-lg whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors inline-flex items-center h-[42px]"
              onClick={handleSlideNumberClick}
              title="Cliquez pour aller à une slide spécifique"
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onBlur={handleInputBlur}
                  className="w-12 bg-white text-primary text-center rounded px-1 outline-none"
                  placeholder={String(currentSlide + 1)}
                  style={{ minWidth: "3rem", width: "3rem" }}
                />
              ) : (
                <span
                  style={{
                    minWidth: "1.5rem",
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {currentSlide + 1}
                </span>
              )}{" "}
              / {totalSlides}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};
