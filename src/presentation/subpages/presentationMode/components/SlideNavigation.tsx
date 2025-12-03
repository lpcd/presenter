import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
}

export const SlideNavigation = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
}: SlideNavigationProps) => {
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
    </motion.footer>
  );
};
