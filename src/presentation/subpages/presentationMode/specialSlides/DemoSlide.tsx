import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";

interface DemoSlideProps {
  titre?: string;
  description?: string;
}

export const DemoSlide = ({
  titre = "Démonstration",
  description,
}: DemoSlideProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="slide-content-container bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-2xl shadow-2xl p-12 w-full min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="absolute inset-0 flex items-center justify-center opacity-10"
      >
        <MonitorPlay size={500} strokeWidth={1} />
      </motion.div>

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
          <MonitorPlay size={80} strokeWidth={2} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-6xl sm:text-7xl font-bold mb-8"
        >
          {titre}
        </motion.h2>

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8"
          >
            <p className="text-2xl leading-relaxed">{description}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <p className="text-2xl font-semibold">💻 Live Coding</p>
          <p className="text-lg opacity-90">
            Suivez attentivement la démonstration
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
