import { motion } from "framer-motion";
import { MarkdownContent } from "./MarkdownContent";
import type { ParsedContent } from "../types";
import { ChevronRight } from "lucide-react";

interface SlideContentProps {
  section: ParsedContent["sections"][0];
  slideIndex: number;
  allSections?: ParsedContent["sections"];
  currentSectionIndex?: number;
}

// Variantes d'animations professionnelles
const slideAnimations = [
  // Slide horizontal classique
  {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  // Fade simple
  {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  // Scale et fade
  {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  // Slide vertical
  {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  // Rotation légère
  {
    initial: { opacity: 0, rotateY: -10 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 10 },
  },
];

export const SlideContent = ({
  section,
  slideIndex,
  allSections = [],
  currentSectionIndex = 0,
}: SlideContentProps) => {
  // Vérifier si la section n'a pas de contenu
  const hasNoContent = !section.content || section.content.trim().length === 0;

  // Sélectionner une animation basée sur l'index de la slide
  const animation = slideAnimations[slideIndex % slideAnimations.length];

  // Si pas de contenu, trouver les sous-sections suivantes (sections avec un niveau supérieur)
  const subsections =
    hasNoContent && allSections.length > 0
      ? allSections.slice(currentSectionIndex + 1).filter((s, idx, arr) => {
          // Prendre les sections de niveau supérieur jusqu'à la prochaine section du même niveau ou inférieur
          if (s.level > section.level) {
            // Vérifier qu'il n'y a pas de section de niveau égal ou inférieur avant
            const hasParentBefore = arr
              .slice(0, idx)
              .some((prev) => prev.level <= section.level);
            return !hasParentBefore;
          }
          return false;
        })
      : [];

  return (
    <motion.div
      key={slideIndex}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full min-h-[600px] flex flex-col"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`font-bold text-primary mb-6 break-words ${
          section.level === 2
            ? "text-3xl sm:text-4xl"
            : section.level === 3
            ? "text-2xl sm:text-3xl"
            : "text-xl sm:text-2xl"
        }`}
      >
        {section.heading}
      </motion.h2>

      {hasNoContent && subsections.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1 flex flex-col justify-center"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Sommaire :
          </h3>
          <ul className="space-y-4">
            {subsections.map((subsection, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + idx * 0.08 }}
                className="flex items-start gap-3 text-gray-700"
              >
                <ChevronRight
                  size={24}
                  className="text-primary flex-shrink-0 mt-1"
                />
                <span className="text-lg">{subsection.heading}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <MarkdownContent content={section.content} />
        </motion.div>
      )}
    </motion.div>
  );
};
