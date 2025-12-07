import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

export const QuestionsSlide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="grid grid-cols-3 gap-16">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3 + i * 0.05,
                type: "spring",
                stiffness: 100,
              }}
            >
              <HelpCircle size={80} strokeWidth={1} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
          className="mb-8 inline-flex items-center justify-center w-40 h-40 bg-white/30 backdrop-blur-md rounded-full"
        >
          <HelpCircle size={100} strokeWidth={2} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="text-7xl sm:text-8xl font-bold mb-12"
        >
          Questions ?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <p className="text-2xl opacity-90">
            N'hésitez pas à poser vos questions
          </p>
          <p className="text-xl opacity-75">💬 Discussion ouverte</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
