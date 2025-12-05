import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

interface PauseSlideProps {
  duration?: string;
}

export const PauseSlide = ({ duration = "10 min" }: PauseSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-sky-400 to-blue-500 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Icône en arrière-plan */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="absolute inset-0 flex items-center justify-center opacity-10"
      >
        <Coffee size={450} strokeWidth={1} />
      </motion.div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-6xl sm:text-7xl font-bold mb-12"
        >
          Pause
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-12 inline-block"
        >
          <p className="text-2xl opacity-90 mb-4">Durée</p>
          <p className="text-7xl font-bold">{duration}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
