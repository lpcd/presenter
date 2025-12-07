import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ParsedContent } from "./types";
import { Header } from "./components/Header";
import { PresentationMode } from "./components/PresentationMode";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { getPresentation } from "../../presentationLoader";
import { parseMarkdown } from "./utils/markdownParser";

const moduleFiles = import.meta.glob("../../../assets/presentations/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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
  const [isEditingSlideNumber, setIsEditingSlideNumber] = useState(false);
  const [isControlsLocked, setIsControlsLocked] = useState(true);
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
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);

  const handleViewModeChange = useCallback(
    (mode: "presentation" | "support") => {
      if (mode === "support" && presentationId && filename) {
        navigate(`/presentations/${presentationId}/support/${filename}`);
      }
    },
    [navigate, presentationId, filename]
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setShowControls(true);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isControlsLocked) {
      if (hideControlsTimeout) {
        clearTimeout(hideControlsTimeout);
        setHideControlsTimeout(null);
      }
      setShowControls(true);
      return;
    }

    setShowControls(true);
    const timeout = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);
    setHideControlsTimeout(timeout);

    return () => {
      clearTimeout(timeout);
      setHideControlsTimeout(null);
    };
  }, [isControlsLocked]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isControlsLocked) {
        setShowControls(true);
        return;
      }

      if (isEditingSlideNumber) {
        setShowControls(true);
        return;
      }

      const showThresholdTop = 96;
      const isNearTop = e.clientY < showThresholdTop;
      const showThresholdLeft = 180;
      const isNearLeft = e.clientX < showThresholdLeft;

      if (isNearTop || isNearLeft) {
        if (!showControls) {
          setShowControls(true);
        }
        if (!hideControlsTimeout) {
          const timeout = window.setTimeout(() => {
            setShowControls(false);
            setHideControlsTimeout(null);
          }, 3000);
          setHideControlsTimeout(timeout);
        }
      } else {
        if (showControls) {
          setShowControls(false);
        }
        if (hideControlsTimeout) {
          clearTimeout(hideControlsTimeout);
          setHideControlsTimeout(null);
        }
      }
    },
    [hideControlsTimeout, showControls, isEditingSlideNumber, isControlsLocked]
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
      setCurrentSlide(0);

      try {
        const mdFilename = filename || "00_Plan";
        const folder = presentationId || "dotnet_unit_testing";

        const fileKey = Object.keys(moduleFiles).find((key) =>
          key.includes(`assets/presentations/${folder}/${mdFilename}.md`)
        );

        if (!fileKey) {
          throw new Error(
            `Fichier non trouvé: ${folder}/${mdFilename}.md. Clés disponibles: ${
              Object.keys(moduleFiles).length
            }`
          );
        }

        const markdown = moduleFiles[fileKey];

        const parsed = parseMarkdown(markdown);

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

      if (isEditingSlideNumber) {
        return;
      }

      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }

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
      }
    },
    [content, currentSlide, toggleFullscreen, nextModule, isEditingSlideNumber]
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
      <div
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          !showControls
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
        style={{ zIndex: 50 }}
      >
        <Header
          presentationId={presentationId}
          title={content.title}
          viewMode="presentation"
          onViewModeChange={handleViewModeChange}
          moduleTitle={moduleTitle}
          presentationName={presentationName}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          isControlsLocked={isControlsLocked}
          onToggleControlsLock={() => setIsControlsLocked(!isControlsLocked)}
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
        showControls={showControls}
        allModules={allModules}
        currentModuleIndex={currentModuleIndex}
        isControlsLocked={isControlsLocked}
        onToggleControlsLock={() => setIsControlsLocked(!isControlsLocked)}
        onEditingChange={setIsEditingSlideNumber}
        presentationName={presentationName}
      />
    </div>
  );
};

export default Presentation;
