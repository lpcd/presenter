import { useMemo } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import { appConfig } from "../../config/config";
import {
  getPresentationCategories,
  type PresentationCategory,
} from "../../presentation";

const colorPalette = appConfig.presentations.cardGradients;

const getColorIndex = (currentIndex: number, columns: number = 3): number => {
  const row = Math.floor(currentIndex / columns);
  const col = currentIndex % columns;
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

interface PresentationSection {
  category: PresentationCategory;
  items: Presentation[];
}

interface PresentationsProps {
  presentations: Presentation[];
}

const Presentations = ({ presentations }: PresentationsProps) => {
  const sections = useMemo<PresentationSection[]>(() => {
    if (!appConfig.presentations.sectionByMetadataType) {
      return [
        {
          category: {
            id: "all",
            label: "Présentations",
            type: "all",
          },
          items: presentations,
        },
      ];
    }

    const categories = getPresentationCategories();
    const sectionsByType = new Map<string, Presentation[]>();

    for (const category of categories) {
      sectionsByType.set(category.type, []);
    }

    const uncategorized: Presentation[] = [];

    for (const presentation of presentations) {
      const type = presentation.type?.trim();
      if (!type || !sectionsByType.has(type)) {
        uncategorized.push(presentation);
        continue;
      }
      sectionsByType.get(type)!.push(presentation);
    }

    const sectionList: PresentationSection[] = categories
      .map((category) => ({
        category,
        items: sectionsByType.get(category.type) || [],
      }))
      .filter((section) => section.items.length > 0);

    if (uncategorized.length > 0) {
      sectionList.push({
        category: {
          id: "autres",
          label: appConfig.presentations.uncategorizedLabel,
          type: appConfig.presentations.uncategorizedLabel,
        },
        items: uncategorized,
      });
    }

    return sectionList;
  }, [presentations]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="pb-12 px-4 max-w-7xl mx-auto"
    >
      {presentations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-xl text-brand-muted mb-2">
            Aucune présentation trouvée
          </p>
          <p className="text-brand-subtle">Essayez avec d'autres mots-clés</p>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {sections.map((section, sectionIndex) => (
            <section key={section.category.id} className="space-y-4">
              <div className="text-left">
                <h2 className="text-2xl font-semibold text-brand-text">
                  {section.category.label}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                {section.items.map((presentation, index) => {
                  const colorIndex = getColorIndex(index + sectionIndex * 3);
                  const colorGradient = colorPalette[colorIndex];

                  return (
                    <motion.div
                      key={presentation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.04 * index }}
                      className="flex"
                    >
                      <Card
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
            </section>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Presentations;
