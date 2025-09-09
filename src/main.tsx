import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../src/assets/styles/animate.css";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
