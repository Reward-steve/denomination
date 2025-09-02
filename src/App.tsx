import { Routes, Route, Navigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeProvider";
import LandingPage from "./modules/Landing/pages/LandingPage";

// This component will use the theme from our context
function ThemedAppContent() {
  return (
    <>
      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        draggable
        transition={Bounce}
      />

      <Routes>
        {/* Redirect root to Landing Page */}
        <Route index element={<Navigate to="/landing-page" replace />} />

        {/* Landing Page */}
        <Route path="/landing-page" element={<LandingPage />} />

        {/* 404 Fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedAppContent />
    </ThemeProvider>
  );
}
