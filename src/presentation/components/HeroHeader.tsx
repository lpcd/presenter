import { Play, ChevronDown, Home } from "lucide-react";
import { motion } from "framer-motion";
import type { HeroConfig } from "../presentation.types";
import { InlineMarkdown } from "../subpages/presentationMode/components/InlineMarkdown";

interface HeroHeaderProps {
  config?: HeroConfig;
}

const defaultConfig: HeroConfig = {
  title: "Presenter",
  subtitle: "",
  buttonText: "Commencer",
  buttonLink: "#",
};

const HeroHeader = ({ config = defaultConfig }: HeroHeaderProps) => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-gradient-to-br from-primary to-primary-dark text-white px-4 sm:px-8">
      <motion.a
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="/"
        className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-colors shadow-lg"
      >
        <Home size={20} />
        <span className="hidden sm:inline">Accueil</span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight"
        >
          <InlineMarkdown content={config.title} />
        </motion.h1>
        {config.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl sm:text-2xl text-white/90"
          >
            <InlineMarkdown content={config.subtitle} />
          </motion.p>
        )}
        {config.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-base sm:text-lg text-white/80 max-w-3xl"
          >
            <InlineMarkdown content={config.description} />
          </motion.p>
        )}
        {config.tags && config.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center max-w-3xl"
          >
            {config.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              >
                <InlineMarkdown content={tag} />
              </span>
            ))}
          </motion.div>
        )}
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.25 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          href={config.buttonLink}
          className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-full font-semibold text-base sm:text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          <Play size={24} />
          <span>{config.buttonText}</span>
        </motion.a>
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.3, delay: 0.3 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-8 p-2 rounded-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-white/50"
        onClick={handleScrollDown}
        aria-label="Défiler vers le bas"
      >
        <ChevronDown size={32} />
      </motion.button>
    </div>
  );
};

export default HeroHeader;
