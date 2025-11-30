import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Presentation from "./presentation";
import PresentationSlides from "./presentation/subpages/presentationMode";
import Support from "./presentation/subpages/supportMode";
import NotFound from "./notfound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/presentations/:presentationId"
          element={<Presentation />}
        />
        <Route
          path="/presentations/:presentationId/presentation/:filename"
          element={<PresentationSlides />}
        />
        <Route
          path="/presentations/:presentationId/support/:filename"
          element={<Support />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
