import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ParsedContent } from "../presentationMode/types";
import { SupportMode } from "../presentationMode/components/SupportMode";
import { LoadingState } from "../presentationMode/components/LoadingState";
import { ErrorState } from "../presentationMode/components/ErrorState";
import { getPresentation } from "../../presentationLoader";
import { Header } from "../presentationMode/components/Header";
import { parseMarkdown } from "../presentationMode/utils/markdownParser";

const moduleFiles = import.meta.glob("../../../assets/presentations/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const Support = () => {
  const { presentationId, filename } = useParams<{
    presentationId: string;
    filename: string;
  }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ParsedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [allModules, setAllModules] = useState<
    Array<{
      id: number;
      title: string;
      description: string;
      filename: string;
      duration: string;
      topics: string[];
    }>
  >([]);
  const [presentationName, setPresentationName] = useState<string>("");

  const handleViewModeChange = useCallback(
    (mode: "presentation" | "support") => {
      if (mode === "presentation" && presentationId && filename) {
        navigate(`/presentations/${presentationId}/presentation/${filename}`);
      }
    },
    [navigate, presentationId, filename]
  );

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);

      try {
        const mdFilename = filename || "00_Plan";
        const folder = presentationId || "dotnet_unit_testing";

        const fileKey = Object.keys(moduleFiles).find((key) =>
          key.includes(`assets/presentations/${folder}/${mdFilename}.md`)
        );

        if (!fileKey) {
          throw new Error(`Fichier non trouvé: ${folder}/${mdFilename}.md`);
        }

        const presentation = folder ? getPresentation(folder) : null;
        const module = presentation?.modules.find(
          (m) => m.filename === mdFilename
        );
        setModuleTitle(module?.title || "");
        setPresentationName(presentation?.name || "");

        if (presentation && module) {
          const currentIndex = presentation.modules.findIndex(
            (m) => m.filename === mdFilename
          );
          setCurrentModuleIndex(currentIndex);
          setAllModules(presentation.modules);
        }

        const markdown = moduleFiles[fileKey];
        const parsed = parseMarkdown(markdown, false);
        setContent(parsed);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du fichier"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [presentationId, filename]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filename]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!content) {
    return null;
  }

  let nextModule = null;
  if (allModules.length > 0 && currentModuleIndex < allModules.length - 1) {
    nextModule = allModules[currentModuleIndex + 1];
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen">
      <Header
        presentationId={presentationId}
        title={content.title}
        currentSlide={0}
        totalSlides={content.sections.length}
        viewMode="support"
        onViewModeChange={handleViewModeChange}
        moduleTitle={moduleTitle}
        presentationName={presentationName}
        isFullscreen={false}
        onToggleFullscreen={() => {}}
        onSlideChange={() => {}}
      />
      <SupportMode
        content={content}
        moduleTitle={moduleTitle}
        presentationId={presentationId}
        allModules={allModules}
        currentModuleIndex={currentModuleIndex}
      />
      {nextModule && (
        <div className="w-full flex justify-center py-8">
          <button
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => {
              navigate(
                `/presentations/${presentationId}/support/${nextModule.filename}`
              );
            }}
          >
            <span>Continuer : {nextModule.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Support;
