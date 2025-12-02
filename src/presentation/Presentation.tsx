import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import HeroHeader from "./components/HeroHeader";
import Modules from "./components/Modules";
import { getPresentation, type PresentationData } from "./presentationLoader";

const Presentation = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const [presentation, setPresentation] = useState<PresentationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const foundPresentation = presentationId
        ? getPresentation(presentationId)
        : null;

      if (!foundPresentation) {
        setError(`Présentation "${presentationId}" non trouvée`);
      } else {
        setPresentation(foundPresentation);
      }
    } catch (err) {
      console.error("Erreur lors du chargement de la présentation:", err);
      setError("Erreur lors du chargement de la présentation");
    } finally {
      setLoading(false);
    }
  }, [presentationId]);

  const heroConfig = useMemo(() => {
    if (!presentation) return null;
    return {
      ...presentation.hero,
      description: presentation.description,
      tags: presentation.tags,
      buttonLink: `/presentations/${presentation.id}/presentation/${presentation.modules[0]?.filename}`,
    };
  }, [presentation]);

  const modulesData = useMemo(() => {
    if (!presentation) return [];
    return presentation.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      link: `/presentations/${presentation.id}/presentation/${module.filename}`,
      duration: module.duration,
      topics: module.topics,
    }));
  }, [presentation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Chargement de la présentation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Présentation non trouvée
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full min-h-screen"
    >
      <HeroHeader config={heroConfig!} />
      <Modules modules={modulesData} />
    </motion.div>
  );
};

export default Presentation;
