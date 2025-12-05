import { motion } from "framer-motion";
import { X } from "lucide-react";

interface FauxSlideProps {
  description?: string;
}

export const FauxSlide = ({ description }: FauxSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Icône X en arrière-plan */}
      <motion.div
        initial={{ scale: 0, rotate: 90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="absolute inset-0 flex items-center justify-center opacity-10"
      >
        <X size={500} strokeWidth={1.5} />
      </motion.div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-8 inline-flex items-center justify-center w-32 h-32 bg-white/30 backdrop-blur-md rounded-full"
        >
          <X size={80} strokeWidth={2.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-7xl sm:text-8xl font-bold mb-12"
        >
          FAUX
        </motion.h2>

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8"
          >
            <p className="text-2xl leading-relaxed">{description}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
