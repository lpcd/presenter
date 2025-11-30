import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.tsx";

// Fonction pour masquer le loader initial
const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
};

// Wrapper pour gérer le loader
export function AppWrapper() {
  useEffect(() => {
    // Masquer le loader une fois que React est monté
    hideInitialLoader();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
