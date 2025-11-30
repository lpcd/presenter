import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import PresentationList from "./components/PresentationList";
import { getAllPresentations, type PresentationData } from "../presentation";

const Home = () => {
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [loading, setLoading] = useState(true);

  const presentationsCount = useMemo(
    () => presentations.length,
    [presentations.length]
  );

  useEffect(() => {
    try {
      const allPresentations = getAllPresentations();
      setPresentations(allPresentations);
    } catch (error) {
      console.error("Erreur lors du chargement des présentations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Chargement des présentations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Hub</h1>
              <p className="text-sm text-gray-600">
                Ma plateforme de présentations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {presentationsCount} présentation
              {presentationsCount > 1 ? "s" : ""} disponible
              {presentationsCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-8 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Mes présentations
          </h1>
        </div>
      </motion.section>

      {/* Presentations List with Search */}
      <PresentationList presentations={presentations} />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="py-12 px-4 text-center text-gray-600 border-t border-gray-200"
      >
        <p>© 2025 - Plateforme de présentations</p>
      </motion.footer>
    </div>
  );
};

export default Home;
