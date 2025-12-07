import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.tsx";

const hideInitialLoader = () => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
};

export function AppWrapper() {
  useEffect(() => {
    hideInitialLoader();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
