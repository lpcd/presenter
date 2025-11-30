import { useMemo, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideContent } from "./SlideContent";
import { SlideNavigation } from "./SlideNavigation";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ParsedContent } from "../types";

interface PresentationModeProps {
  content: ParsedContent;
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  nextModule: { id: number; title: string; filename: string } | null;
  presentationId: string | undefined;
  moduleTitle: string;
  zoomLevel: number;
  showControls: boolean;
}

export const PresentationMode = ({
  content,
  currentSlide,
  onSlideChange,
  onKeyDown,
  nextModule,
  presentationId,
  moduleTitle,
  zoomLevel,
  showControls,
}: PresentationModeProps) => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const totalSlides = useMemo(
    () => content.sections.length + (nextModule ? 1 : 0) + 1, // +1 pour la slide d'introduction
    [content.sections.length, nextModule]
  );
  const isLastSlide = currentSlide === content.sections.length + 1;
  const currentSection = useMemo(
    () => content.sections[currentSlide - 1], // -1 car la première slide est l'intro
    [content.sections, currentSlide]
  );

  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      onSlideChange(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, onSlideChange]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  }, [currentSlide, onSlideChange]);

  // Remettre le scroll en haut à chaque changement de slide
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  return (
    <>
      {/* Slide principale */}
      <main
        ref={mainRef}
        className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
        onKeyDown={onKeyDown}
        tabIndex={0}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center",
        }}
      >
        <div className="w-full max-w-5xl relative flex items-center justify-center py-8">
          <AnimatePresence mode="wait">
            {currentSlide === 0 ? (
              <motion.div
                key="intro-slide"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-12 w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h2 className="text-5xl sm:text-6xl font-bold mb-8">
                    {moduleTitle}
                  </h2>
                  <p className="text-xl sm:text-2xl opacity-90">
                    {content.title}
                  </p>
                </motion.div>
              </motion.div>
            ) : isLastSlide && nextModule ? (
              <motion.div
                key="next-module-cta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-12 w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                    Module terminé ! 🎉
                  </h2>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <p className="text-sm opacity-75 mb-2">Prochain module</p>
                    <h3 className="text-2xl font-bold mb-2">
                      {nextModule.title}
                    </h3>
                  </div>
                  <motion.button
                    onClick={() => {
                      navigate(
                        `/presentations/${presentationId}/presentation/${nextModule.filename}`
                      );
                      onSlideChange(0);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <span>Continuer</span>
                    <ArrowRight size={24} />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <SlideContent
                section={currentSection}
                slideIndex={currentSlide}
                allSections={content.sections}
                currentSectionIndex={currentSlide - 1}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation en bas - masquée automatiquement en mode présentation */}
      <div
        className={`fixed bottom-0 left-0 right-0 transition-all duration-300 ${
          !showControls
            ? "translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
        style={{ zIndex: 50 }}
      >
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevious={goToPreviousSlide}
          onNext={goToNextSlide}
          onGoToSlide={onSlideChange}
        />
      </div>
    </>
  );
};
