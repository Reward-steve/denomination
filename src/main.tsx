import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "../src/assets/styles/animate.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.tsx";
import ResponsiveProvider from "./context/Responsive.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ResponsiveProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ResponsiveProvider>
    </BrowserRouter>
  </StrictMode>
);
