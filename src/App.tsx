import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeProvider";
import LandingPage from "./modules/Landing/pages/LandingPage";
import { RegistrationProvider } from "./context/RegProvider";
import Settings from "./modules/auth/components/Layout";
import { auth } from "./routes";
import ResponsiveProvider from "./context/ResponsiveProvider";

// This component will use the theme from our context
function ThemedAppContent() {
  return (
    <RegistrationProvider>
      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        draggable
        className={"text-sm"}
      />

      <Routes>
        {/* Redirect root to Landing Page */}
        <Route index element={<Navigate to="/landing-page" replace />} />
        {/* Landing Page */}
        <Route path="/landing-page" element={<LandingPage />} />
        {/*Auth-flow - Corrected approach */}

        <Route path="/auth/*" element={<Settings />}>
          {/* All child routes of /auth/ should be nested here */}
          {auth.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        {/* 404 Fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </RegistrationProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ResponsiveProvider>
        <ThemedAppContent />
      </ResponsiveProvider>
    </ThemeProvider>
  );
}
