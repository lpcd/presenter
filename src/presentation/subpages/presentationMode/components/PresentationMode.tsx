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
  nextModule: {
    id: number;
    title: string;
    filename: string;
    optional?: boolean;
  } | null;
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
    optional?: boolean;
  }>;
  currentModuleIndex: number;
  isControlsLocked?: boolean;
  onToggleControlsLock?: () => void;
  onEditingChange?: (isEditing: boolean) => void;
  presentationName?: string;
  showModulesMenu?: boolean;
  showTableOfContents?: boolean;
  onShowModulesMenuChange?: (show: boolean) => void;
  onShowTableOfContentsChange?: (show: boolean) => void;
  isModuleOptional?: boolean;
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
  showModulesMenu = false,
  showTableOfContents = false,
  onShowModulesMenuChange,
  onShowTableOfContentsChange,
  isModuleOptional = false,
}: PresentationModeProps) => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const totalSlides = useMemo(
    () => content.sections.length + (nextModule ? 1 : 0) + 1,
    [content.sections.length, nextModule],
  );

  const nextNonOptionalModule = useMemo(() => {
    if (!nextModule?.optional) return null;

    const currentIdx = allModules.findIndex(
      (m) => m.filename === nextModule.filename,
    );
    if (currentIdx === -1) return null;

    for (let i = currentIdx + 1; i < allModules.length; i++) {
      if (!allModules[i].optional) {
        return allModules[i];
      }
    }
    return null;
  }, [nextModule, allModules]);

  const isLastSlide = currentSlide === content.sections.length + 1;
  const currentSection = useMemo(
    () => content.sections[currentSlide - 1],
    [content.sections, currentSlide],
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
                    {isModuleOptional && (
                      <span className="text-3xl sm:text-4xl block mt-4 opacity-80">
                        (Facultatif)
                      </span>
                    )}
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
                  className="w-full max-w-2xl"
                >
                  <h2 className="text-4xl sm:text-5xl font-bold mb-8">
                    Module terminé ! 🎉
                  </h2>

                  {nextModule.optional && nextNonOptionalModule ? (
                    <div className="space-y-4">
                      <motion.div
                        onClick={() => {
                          navigate(
                            `/presentations/${presentationId}/presentation/${nextModule.filename}`,
                          );
                          onSlideChange(0);
                        }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                      >
                        <p className="text-sm opacity-75 mb-2">
                          Module facultatif suivant
                        </p>
                        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                          {nextModule.title}
                          <ArrowRight size={24} />
                        </h3>
                      </motion.div>

                      <motion.div
                        onClick={() => {
                          navigate(
                            `/presentations/${presentationId}/presentation/${nextNonOptionalModule.filename}`,
                          );
                          onSlideChange(0);
                        }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                      >
                        <p className="text-sm opacity-75 mb-2">
                          Prochain module obligatoire
                        </p>
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                          {nextNonOptionalModule.title}
                          <ArrowRight size={24} />
                        </h3>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      onClick={() => {
                        navigate(
                          `/presentations/${presentationId}/presentation/${nextModule.filename}`,
                        );
                        onSlideChange(0);
                      }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all"
                    >
                      <p className="text-sm opacity-75 mb-2">Prochain module</p>
                      <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                        {nextModule.title}
                        <ArrowRight size={24} />
                      </h3>
                      {nextModule.optional && (
                        <p className="text-xs opacity-60">(Facultatif)</p>
                      )}
                    </motion.div>
                  )}
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
          showModulesMenu={showModulesMenu}
          showTableOfContents={showTableOfContents}
          onShowModulesMenuChange={onShowModulesMenuChange}
          onShowTableOfContentsChange={onShowTableOfContentsChange}
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
