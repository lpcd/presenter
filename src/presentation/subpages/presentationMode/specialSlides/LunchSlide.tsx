import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

interface LunchSlideProps {
  retour?: string;
}

export const LunchSlide = ({ retour = "14h00" }: LunchSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="absolute inset-0 flex items-center justify-center opacity-10"
      >
        <Utensils size={450} strokeWidth={1} />
      </motion.div>

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
          Déjeuner
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/30 backdrop-blur-md rounded-3xl p-12 inline-block"
        >
          <p className="text-2xl opacity-90 mb-4">Reprise à</p>
          <p className="text-7xl font-bold">{retour}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xl opacity-90"
        >
          Bon appétit ! 🍽️
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
