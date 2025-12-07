import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Menu, List, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModulesMenu } from "./ModulesMenu";
import { TableOfContents } from "./TableOfContents";
import { exportSlidesPDF } from "../utils/pdfExport";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
  sections: Array<{
    heading: string;
    content: string;
    level: number;
  }>;
  presentationId: string | undefined;
  allModules: Array<{
    id: number;
    title: string;
    description: string;
    filename: string;
    duration: string;
    topics: string[];
  }>;
  currentModuleIndex: number;
  isControlsLocked?: boolean;
  onToggleControlsLock?: () => void;
  presentationName?: string;
  moduleTitle?: string;
  showModulesMenu?: boolean;
  showTableOfContents?: boolean;
  onShowModulesMenuChange?: (show: boolean) => void;
  onShowTableOfContentsChange?: (show: boolean) => void;
}

export const SlideNavigation = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  sections,
  presentationId,
  allModules,
  currentModuleIndex,
  isControlsLocked = false,
  onToggleControlsLock,
  presentationName = "Presentation",
  moduleTitle = "Module",
  showModulesMenu: externalShowModulesMenu,
  showTableOfContents: externalShowTableOfContents,
  onShowModulesMenuChange,
  onShowTableOfContentsChange,
}: SlideNavigationProps) => {
  const [internalShowModulesMenu, setInternalShowModulesMenu] = useState(false);
  const [internalShowTableOfContents, setInternalShowTableOfContents] =
    useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  const showModulesMenu = externalShowModulesMenu ?? internalShowModulesMenu;
  const showTableOfContents =
    externalShowTableOfContents ?? internalShowTableOfContents;
  const setShowModulesMenu =
    onShowModulesMenuChange ?? setInternalShowModulesMenu;
  const setShowTableOfContents =
    onShowTableOfContentsChange ?? setInternalShowTableOfContents;

  const navigateToModule = useCallback(
    (filename: string) => {
      if (presentationId) {
        navigate(`/presentations/${presentationId}/presentation/${filename}`);
        setShowModulesMenu(false);
      }
    },
    [presentationId, navigate]
  );

  const handleModulesMenuToggle = () => {
    const newState = !showModulesMenu;

    if (newState && !isControlsLocked && onToggleControlsLock) {
      onToggleControlsLock();
    }

    setShowModulesMenu(newState);
    if (newState && showTableOfContents) {
      setShowTableOfContents(false);
    }
  };

  const handleTableOfContentsToggle = () => {
    const newState = !showTableOfContents;

    if (newState && !isControlsLocked && onToggleControlsLock) {
      onToggleControlsLock();
    }

    setShowTableOfContents(newState);
    if (newState && showModulesMenu) {
      setShowModulesMenu(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportSlidesPDF(
        presentationName,
        moduleTitle,
        totalSlides,
        onGoToSlide
      );
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    } finally {
      setIsExporting(false);
      onGoToSlide(currentSlide);
    }
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed left-0 top-24 -translate-y-1/2 bg-black/30 backdrop-blur-sm text-white py-4 px-3 rounded-r-2xl border-r border-t border-b border-white/10 z-20"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleModulesMenuToggle}
          className="bg-primary text-white p-3 rounded-xl shadow-2xl hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu des modules"
          title="Menu des modules"
        >
          <Menu size={24} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleTableOfContentsToggle}
          className="bg-white text-primary p-3 rounded-xl shadow-xl hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Sommaire"
          title="Sommaire"
        >
          <List size={24} />
        </motion.button>

        <div className="w-8 h-px bg-white/20 my-2"></div>

        <motion.button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          whileHover={{ scale: currentSlide === 0 ? 1 : 1.1 }}
          whileTap={{ scale: currentSlide === 0 ? 1 : 0.9 }}
          className={`p-3 rounded-xl font-semibold transition-all ${
            currentSlide === 0
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-white text-primary hover:bg-white/90 shadow-lg"
          }`}
          aria-label="Slide précédente"
          title="Slide précédente"
        >
          <ChevronUp size={24} />
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          whileHover={{ scale: currentSlide === totalSlides - 1 ? 1 : 1.1 }}
          whileTap={{ scale: currentSlide === totalSlides - 1 ? 1 : 0.9 }}
          className={`p-3 rounded-xl font-semibold transition-all ${
            currentSlide === totalSlides - 1
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-white text-primary hover:bg-white/90 shadow-lg"
          }`}
          aria-label="Slide suivante"
          title="Slide suivante"
        >
          <ChevronDown size={24} />
        </motion.button>

        <div className="w-8 h-px bg-white/20 my-2"></div>

        <motion.button
          onClick={handleExportPDF}
          disabled={isExporting}
          whileHover={{ scale: isExporting ? 1 : 1.1 }}
          whileTap={{ scale: isExporting ? 1 : 0.9 }}
          className={`p-3 rounded-xl font-semibold transition-all ${
            isExporting
              ? "bg-white/10 text-white/40 cursor-wait"
              : "bg-primary text-white hover:bg-primary/90 shadow-lg"
          }`}
          aria-label="Exporter en PDF"
          title="Exporter les diapositives en PDF"
        >
          <Download size={24} />
        </motion.button>
      </div>

      <ModulesMenu
        show={showModulesMenu}
        onClose={() => setShowModulesMenu(false)}
        allModules={allModules}
        currentModuleIndex={currentModuleIndex}
        onNavigateToModule={navigateToModule}
      />

      <TableOfContents
        show={showTableOfContents}
        onClose={() => setShowTableOfContents(false)}
        sections={sections}
        currentSlide={currentSlide}
        onGoToSlide={onGoToSlide}
      />
    </motion.aside>
  );
};
