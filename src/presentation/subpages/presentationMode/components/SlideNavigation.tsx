import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}: SlideNavigationProps) => {
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const navigate = useNavigate();
  const visibleSlides = useMemo(() => {
    const maxVisible = 11;
    if (totalSlides <= maxVisible) {
      return Array.from({ length: totalSlides }, (_, i) => i);
    }

    const halfVisible = Math.floor(maxVisible / 2);
    let start = Math.max(0, currentSlide - halfVisible);
    const end = Math.min(totalSlides - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentSlide, totalSlides]);

  const navigateToModule = useCallback(
    (filename: string) => {
      if (presentationId) {
        navigate(`/presentations/${presentationId}/presentation/${filename}`);
        setShowModulesMenu(false);
      }
    },
    [presentationId, navigate]
  );

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-black/30 backdrop-blur-sm text-white py-6 px-6 border-t border-white/10 z-20"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onGoToSlide(0)}
            disabled={currentSlide === 0}
            whileHover={{ scale: currentSlide === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentSlide === 0 ? 1 : 0.95 }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition-all ${
              currentSlide === 0
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white text-primary hover:bg-white/90 shadow-lg"
            }`}
            title="Première slide"
          >
            <ChevronsLeft size={20} />
          </motion.button>
          <motion.button
            onClick={onPrevious}
            disabled={currentSlide === 0}
            whileHover={{ scale: currentSlide === 0 ? 1 : 1.05 }}
            whileTap={{ scale: currentSlide === 0 ? 1 : 0.95 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              currentSlide === 0
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white text-primary hover:bg-white/90 shadow-lg"
            }`}
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Précédent</span>
          </motion.button>
        </div>

        <div className="flex gap-2 px-2">
          {visibleSlides.map((index) => (
            <motion.button
              key={index}
              onClick={() => onGoToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={onNext}
            disabled={currentSlide === totalSlides - 1}
            whileHover={{ scale: currentSlide === totalSlides - 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentSlide === totalSlides - 1 ? 1 : 0.95 }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              currentSlide === totalSlides - 1
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white text-primary hover:bg-white/90 shadow-lg"
            }`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight size={20} />
          </motion.button>
          <motion.button
            onClick={() => onGoToSlide(totalSlides - 1)}
            disabled={currentSlide === totalSlides - 1}
            whileHover={{ scale: currentSlide === totalSlides - 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentSlide === totalSlides - 1 ? 1 : 0.95 }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-full font-semibold transition-all ${
              currentSlide === totalSlides - 1
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white text-primary hover:bg-white/90 shadow-lg"
            }`}
            title="Dernière slide"
          >
            <ChevronsRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Menus latéraux */}
      <AnimatePresence>
        {showModulesMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-4 bottom-24 bg-white rounded-xl shadow-2xl p-4 z-50 max-w-xs max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Modules</h3>
              <button
                onClick={() => setShowModulesMenu(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {allModules.map((module, index) => (
                <button
                  key={module.id}
                  onClick={() => navigateToModule(module.filename)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    index === currentModuleIndex
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-medium">{module.title}</div>
                  <div className="text-xs opacity-75">{module.duration}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTableOfContents && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 bottom-24 bg-white rounded-xl shadow-2xl p-4 z-50 max-w-xs max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Sommaire</h3>
              <button
                onClick={() => setShowTableOfContents(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onGoToSlide(index + 1); // +1 car la première slide est l'intro
                    setShowTableOfContents(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    currentSlide === index + 1
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`${
                      section.level === 2
                        ? "font-semibold"
                        : section.level === 3
                        ? "ml-2"
                        : "ml-4 text-sm"
                    }`}
                  >
                    {section.heading}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boutons flottants */}
      <div className="fixed left-4 bottom-28 flex gap-3 z-40">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowModulesMenu(!showModulesMenu)}
          className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu des modules"
          title="Menu des modules - Naviguez entre les différents modules"
        >
          <Menu size={24} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          className="bg-white text-primary p-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Sommaire"
          title="Sommaire - Accédez rapidement aux différentes sections"
        >
          <List size={24} />
        </motion.button>
      </div>
    </motion.footer>
  );
};
