import { motion, AnimatePresence } from "framer-motion";
import { MarkdownContent } from "./MarkdownContent";
import type { ParsedContent } from "../types";
import { ArrowUp, ChevronUp, ChevronDown, Menu, List } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { detectSpecialSlide } from "../utils/specialSlideDetector";

interface SupportModeProps {
  content: ParsedContent;
  moduleTitle: string;
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

export const SupportMode = ({
  content,
  moduleTitle,
  presentationId,
  allModules,
  currentModuleIndex,
}: SupportModeProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const navigate = useNavigate();

  const filteredSections = content.sections
    .filter(
      (section) => !section.duplicateInfo || section.duplicateInfo.isFirst
    )
    .filter((section) => {
      const specialSlide = detectSpecialSlide(
        section.heading,
        section.content,
        section.level
      );
      return !specialSlide.type;
    })
    .map((section) => {
      if (section.duplicateInfo && section.mergedContent) {
        return {
          ...section,
          content: section.mergedContent,
        };
      }
      return section;
    });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToNextSection = useCallback(() => {
    const currentScrollY = window.scrollY + 150;
    const nextSection = sectionRefs.current.find(
      (ref) => ref && ref.offsetTop > currentScrollY
    );
    if (nextSection) {
      const headerOffset = 100;
      window.scrollTo({
        top: nextSection.offsetTop - headerOffset,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToPreviousSection = useCallback(() => {
    const currentScrollY = window.scrollY - 10;
    const previousSection = [...sectionRefs.current]
      .reverse()
      .find((ref) => ref && ref.offsetTop < currentScrollY);
    if (previousSection) {
      const headerOffset = 100;
      window.scrollTo({
        top: previousSection.offsetTop - headerOffset,
        behavior: "smooth",
      });
    }
  }, []);

  const navigateToModule = useCallback(
    (filename: string) => {
      if (presentationId) {
        navigate(`/presentations/${presentationId}/support/${filename}`);
        setShowModulesMenu(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [presentationId, navigate]
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 sm:p-8 pt-24 sm:pt-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-8"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-center">
            {moduleTitle}
          </h1>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 space-y-12 overflow-x-hidden support-content">
          {filteredSections.map((section, index) => (
            <motion.article
              key={index}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              id={`section-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="pb-12 last:pb-0"
            >
              <h2
                className={`font-bold text-primary mb-6 break-words ${
                  section.level === 2
                    ? "text-3xl sm:text-4xl"
                    : section.level === 3
                    ? "text-2xl sm:text-3xl"
                    : "text-xl sm:text-2xl"
                }`}
              >
                {section.heading}
              </h2>
              <MarkdownContent content={section.content} />
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModulesMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-4 top-24 bg-white rounded-xl shadow-2xl p-4 z-40 max-w-xs max-h-[70vh] overflow-y-auto"
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
            className="fixed right-4 top-24 bg-white rounded-xl shadow-2xl p-4 z-40 max-w-xs max-h-[70vh] overflow-y-auto"
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
              {filteredSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    scrollToSection(index);
                    setShowTableOfContents(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
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

      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-30">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={scrollToTop}
              className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Retour en haut"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToPreviousSection}
          className="bg-white text-primary p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all mx-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Section précédente"
        >
          <ChevronUp size={20} />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToNextSection}
          className="bg-white text-primary p-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all mx-auto"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Section suivante"
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>

      <div className="fixed left-4 bottom-8 flex flex-col gap-3 z-30">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowModulesMenu(!showModulesMenu)}
          className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary/90 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu des modules"
          title="Menu des modules - Naviguez entre les différents modules de la formation"
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
          title="Sommaire - Accédez rapidement aux différentes sections du module"
        >
          <List size={24} />
        </motion.button>
      </div>
    </motion.main>
  );
};
