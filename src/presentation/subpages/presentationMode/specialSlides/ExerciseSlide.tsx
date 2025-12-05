import { motion } from "framer-motion";
import { Dumbbell, ExternalLink } from "lucide-react";

interface ExerciseSlideProps {
  duration?: string;
  repos?: string;
  description?: string;
}

export const ExerciseSlide = ({
  duration,
  repos,
  description,
}: ExerciseSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <Dumbbell size={120} strokeWidth={1.5} className="text-white/90" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl sm:text-6xl font-bold mb-8 text-center"
      >
        Exercice
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full space-y-6"
      >
        {duration && (
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider opacity-90 mb-2">
              Durée
            </p>
            <p className="text-4xl font-bold">{duration}</p>
          </div>
        )}

        {description && (
          <div className="border-t border-white/30 pt-6">
            <p className="text-lg leading-relaxed text-center">{description}</p>
          </div>
        )}

        {repos && (
          <div className="border-t border-white/30 pt-6 text-center">
            <a
              href={repos}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              <ExternalLink size={20} />
              Accéder au dépôt
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
