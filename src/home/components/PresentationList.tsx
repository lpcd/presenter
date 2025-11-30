import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import PresentationCard from "./PresentationCard";

// Palette de couleurs pour les cartes (tons plus sombres pour meilleur contraste)
const colorPalette = [
  { from: "from-blue-800", via: "via-blue-900", to: "to-indigo-950" },
  { from: "from-purple-800", via: "via-purple-900", to: "to-pink-950" },
  { from: "from-green-800", via: "via-green-900", to: "to-teal-950" },
  { from: "from-orange-800", via: "via-orange-900", to: "to-red-950" },
  { from: "from-cyan-800", via: "via-cyan-900", to: "to-blue-950" },
  { from: "from-rose-800", via: "via-rose-900", to: "to-pink-950" },
  { from: "from-amber-800", via: "via-amber-900", to: "to-orange-950" },
  { from: "from-emerald-800", via: "via-emerald-900", to: "to-green-950" },
  { from: "from-violet-800", via: "via-violet-900", to: "to-purple-950" },
  { from: "from-sky-800", via: "via-sky-900", to: "to-cyan-950" },
  { from: "from-fuchsia-800", via: "via-fuchsia-900", to: "to-purple-950" },
  { from: "from-lime-800", via: "via-lime-900", to: "to-green-950" },
  { from: "from-teal-800", via: "via-teal-900", to: "to-cyan-950" },
  { from: "from-indigo-800", via: "via-indigo-900", to: "to-blue-950" },
  { from: "from-red-800", via: "via-red-900", to: "to-rose-950" },
  { from: "from-slate-800", via: "via-slate-900", to: "to-gray-950" },
];

// Fonction pour obtenir un index de couleur qui évite les répétitions côte à côte
const getColorIndex = (currentIndex: number, columns: number = 3): number => {
  // Pour une grille de 3 colonnes, on utilise un pattern qui évite les répétitions
  // en alternant intelligemment les couleurs
  const row = Math.floor(currentIndex / columns);
  const col = currentIndex % columns;

  // Pattern qui assure qu'aucune couleur n'est côte à côte
  return (row * 2 + col) % colorPalette.length;
};

interface Presentation {
  id: string;
  name: string;
  description: string;
  folderPath: string;
  duration: string;
  level: string;
  type: string;
  tags: string[];
}

interface PresentationListProps {
  presentations: Presentation[];
}

const PresentationList = ({ presentations }: PresentationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPresentations = useMemo(() => {
    return presentations.filter((presentation) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = presentation.name.toLowerCase().includes(searchLower);
      const tagsMatch = presentation.tags.some((tag) =>
        tag.toLowerCase().includes(searchLower)
      );
      return nameMatch || tagsMatch;
    });
  }, [presentations, searchTerm]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="pb-12 px-4 max-w-7xl mx-auto"
    >
      {/* Barre de recherche */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            {filteredPresentations.length} résultat
            {filteredPresentations.length > 1 ? "s" : ""} trouvé
            {filteredPresentations.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Grille de présentations */}
      {filteredPresentations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-xl text-gray-600 mb-2">
            Aucune présentation trouvée
          </p>
          <p className="text-gray-500">Essayez avec d'autres mots-clés</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {filteredPresentations.map((presentation, index) => {
            const colorIndex = getColorIndex(index);
            const colorGradient = colorPalette[colorIndex];

            return (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 * index }}
                className="flex"
              >
                <PresentationCard
                  id={presentation.id}
                  name={presentation.name}
                  description={presentation.description}
                  duration={presentation.duration}
                  level={presentation.level}
                  type={presentation.type}
                  tags={presentation.tags}
                  link={`/presentations/${presentation.id}`}
                  colorGradient={colorGradient}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};

export default PresentationList;
