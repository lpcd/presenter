import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import NotFound from "./notfound";
import { CommandPalette } from "./components/CommandPalette";

// Lazy-load all heavy routes so the initial bundle stays small.
const Presentation = lazy(() => import("./presentation"));
const PresentationSlides = lazy(() => import("./presentation/subpages/presentationMode"));
const Support = lazy(() => import("./presentation/subpages/supportMode"));
const BuilderHome = lazy(() => import("./builder/BuilderHome"));
const BuilderDetail = lazy(() => import("./builder/BuilderDetail"));
const ModuleEditor = lazy(() => import("./builder/ModuleEditor"));

const RouteFallback = () => (
  <div className="flex h-screen items-center justify-center text-text-subtle">Chargement…</div>
);

function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/presentations/:presentationId"
          element={<Suspense fallback={<RouteFallback />}><Presentation /></Suspense>}
        />
        <Route
          path="/presentations/:presentationId/presentation/:filename"
          element={<Suspense fallback={<RouteFallback />}><PresentationSlides /></Suspense>}
        />
        <Route
          path="/presentations/:presentationId/support/:filename"
          element={<Suspense fallback={<RouteFallback />}><Support /></Suspense>}
        />
        <Route path="/builder" element={<Suspense fallback={<RouteFallback />}><BuilderHome /></Suspense>} />
        <Route path="/builder/:draftId" element={<Suspense fallback={<RouteFallback />}><BuilderDetail /></Suspense>} />
        <Route
          path="/builder/:draftId/module/:moduleIndex"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ModuleEditor />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
