import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface ObjectivesSlideProps {
  items?: string[];
  description?: string;
}

export const ObjectivesSlide = ({
  items,
  description,
}: ObjectivesSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="absolute inset-0 flex items-center justify-center opacity-10"
      >
        <Target size={450} strokeWidth={1} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center max-w-4xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          className="mb-8 inline-flex items-center justify-center w-32 h-32 bg-white/30 backdrop-blur-md rounded-full"
        >
          <Target size={80} strokeWidth={2.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-6xl sm:text-7xl font-bold mb-12"
        >
          Objectifs
        </motion.h2>

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 text-xl opacity-90"
          >
            <p>{description}</p>
          </motion.div>
        )}

        {items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8"
          >
            <ul className="space-y-4 text-left text-xl">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-yellow-300 text-2xl">🎯</span>
                  <span className="flex-1">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
