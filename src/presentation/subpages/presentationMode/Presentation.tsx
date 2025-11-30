import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ParsedContent } from "./types";
import { PresentationHeader } from "./components/PresentationHeader";
import { PresentationMode } from "./components/PresentationMode";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { getPresentation } from "../overview/presentationLoader";
import { parseMarkdown } from "./utils/markdownParser";

// Charger tous les fichiers markdown dynamiquement depuis tous les dossiers de formations
const moduleFiles = import.meta.glob(
  "../../../assets/myPresentations/**/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

const Presentation = () => {
  const { presentationId, filename } = useParams<{
    presentationId: string;
    filename: string;
  }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ParsedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [nextModule, setNextModule] = useState<{
    id: number;
    title: string;
    filename: string;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimeout, setHideControlsTimeout] = useState<number | null>(
    null
  );
  const [presentationName, setPresentationName] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleViewModeChange = useCallback(
    (mode: "presentation" | "support") => {
      if (mode === "support" && presentationId && filename) {
        navigate(`/presentations/${presentationId}/support/${filename}`);
      }
    },
    [navigate, presentationId, filename]
  );

  // Gestion du plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowControls(true);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-masquage des contrôles après 2 secondes au chargement initial
  useEffect(() => {
    // Seulement au premier chargement
    const timeout = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []); // Tableau vide = exécuté une seule fois

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const showThreshold = 80;
      const isNearTop = e.clientY < showThreshold;
      const isNearBottom = e.clientY > window.innerHeight - showThreshold;

      if (isNearTop || isNearBottom) {
        setShowControls(true);
        if (hideControlsTimeout) {
          clearTimeout(hideControlsTimeout);
        }
        const timeout = window.setTimeout(() => {
          setShowControls(false);
        }, 2000);
        setHideControlsTimeout(timeout);
      } else if (showControls) {
        // Si on s'éloigne des bords, masquer immédiatement
        setShowControls(false);
        if (hideControlsTimeout) {
          clearTimeout(hideControlsTimeout);
          setHideControlsTimeout(null);
        }
      }
    },
    [hideControlsTimeout, showControls]
  );

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construire le chemin du fichier markdown
        const mdFilename = filename || "00_Plan";
        const folder = presentationId || "dotnet_unit_testing";

        // Chercher par pattern dans les clés disponibles
        const fileKey = Object.keys(moduleFiles).find((key) =>
          key.includes(`myPresentations/${folder}/${mdFilename}.md`)
        );

        if (!fileKey) {
          throw new Error(
            `Fichier non trouvé: ${folder}/${mdFilename}.md. Clés disponibles: ${
              Object.keys(moduleFiles).length
            }`
          );
        }

        const markdown = moduleFiles[fileKey];

        // Parser le markdown avec une fonction simple
        const parsed = parseMarkdown(markdown);

        // Trouver le titre du module dans la configuration
        const presentation = folder ? getPresentation(folder) : null;
        const module = presentation?.modules.find(
          (m) => m.filename === mdFilename
        );
        setModuleTitle(module?.title || "");
        setPresentationName(presentation?.name || "");

        // Trouver le module suivant
        if (presentation && module) {
          const currentIndex = presentation.modules.findIndex(
            (m) => m.filename === mdFilename
          );

          if (currentIndex < presentation.modules.length - 1) {
            const next = presentation.modules[currentIndex + 1];
            setNextModule({
              id: next.id,
              title: next.title,
              filename: next.filename,
            });
          } else {
            setNextModule(null);
          }
        }

        // Définir le contenu
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!content) return;

      // Gestion de la touche Escape pour quitter le plein écran
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }

      // Gestion de F11 pour le plein écran
      if (e.key === "F11") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      const totalSlides = content.sections.length + (nextModule ? 1 : 0) + 1;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (currentSlide < totalSlides - 1) {
          setCurrentSlide(currentSlide + 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentSlide > 0) {
          setCurrentSlide(currentSlide - 1);
        }
      } else if (e.key === "+" || e.key === "=") {
        // Zoom in avec + ou =
        e.preventDefault();
        setZoomLevel((prev) => Math.min(prev + 0.1, 2));
      } else if (e.key === "-" || e.key === "_") {
        // Zoom out avec - ou _
        e.preventDefault();
        setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
      } else if (e.key === "0") {
        // Reset zoom avec 0
        e.preventDefault();
        setZoomLevel(1);
      }
    },
    [content, currentSlide, toggleFullscreen, nextModule]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!content) {
    return null;
  }

  return (
    <div
      ref={(el) => el?.focus()}
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col min-h-screen overflow-hidden"
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      tabIndex={0}
    >
      {/* Header - masqué automatiquement en mode présentation */}
      <div
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          !showControls
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
        style={{ zIndex: 50 }}
      >
        <PresentationHeader
          presentationId={presentationId}
          title={content.title}
          currentSlide={currentSlide}
          totalSlides={content.sections.length + (nextModule ? 1 : 0) + 1}
          viewMode="presentation"
          onViewModeChange={handleViewModeChange}
          moduleTitle={moduleTitle}
          presentationName={presentationName}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onSlideChange={setCurrentSlide}
        />
      </div>

      <PresentationMode
        content={content}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
        onKeyDown={handleKeyDown}
        nextModule={nextModule}
        presentationId={presentationId}
        moduleTitle={moduleTitle}
        zoomLevel={zoomLevel}
        showControls={showControls}
      />
    </div>
  );
};

export default Presentation;
