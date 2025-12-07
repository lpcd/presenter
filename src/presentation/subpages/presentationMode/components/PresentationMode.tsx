import { useMemo, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideContent } from "./SlideContent";
import { SlideNavigation } from "./SlideNavigation";
import { SlideCounter } from "./SlideCounter";
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
  showControls: boolean;
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
  onEditingChange?: (isEditing: boolean) => void;
  presentationName?: string;
}

export const PresentationMode = ({
  content,
  currentSlide,
  onSlideChange,
  onKeyDown,
  nextModule,
  presentationId,
  moduleTitle,
  showControls,
  allModules,
  currentModuleIndex,
  isControlsLocked = false,
  onToggleControlsLock,
  onEditingChange,
  presentationName,
}: PresentationModeProps) => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const totalSlides = useMemo(
    () => content.sections.length + (nextModule ? 1 : 0) + 1,
    [content.sections.length, nextModule]
  );
  const isLastSlide = currentSlide === content.sections.length + 1;
  const currentSection = useMemo(
    () => content.sections[currentSlide - 1],
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

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  return (
    <>
      <main
        ref={mainRef}
        className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
        onKeyDown={onKeyDown}
        tabIndex={0}
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
                className="slide-content-container bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-12 w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden"
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
                </motion.div>
              </motion.div>
            ) : isLastSlide && nextModule ? (
              <motion.div
                key="next-module-cta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="slide-content-container bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-12 w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden"
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

      {showControls && (
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrevious={goToPreviousSlide}
          onNext={goToNextSlide}
          onGoToSlide={onSlideChange}
          sections={content.sections}
          presentationId={presentationId}
          allModules={allModules}
          currentModuleIndex={currentModuleIndex}
          isControlsLocked={isControlsLocked}
          onToggleControlsLock={onToggleControlsLock}
          presentationName={presentationName}
          moduleTitle={moduleTitle}
        />
      )}

      <SlideCounter
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSlideChange={onSlideChange}
        onEditingChange={onEditingChange}
        isControlsLocked={isControlsLocked}
        onToggleControlsLock={onToggleControlsLock}
      />
    </>
  );
};
