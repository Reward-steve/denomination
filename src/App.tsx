import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeProvider";
import LandingPage from "./modules/Landing/pages/LandingPage";
import { RegistrationProvider } from "./context/RegProvider";
import Layout from "./modules/auth/components/Layout";
import { auth, dashboard } from "./routes";
import ResponsiveProvider from "./context/ResponsiveProvider";
import { authMenu, dashboardMenu } from "./constant";

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
        <Route index element={<Navigate to="/landing-page" replace />} />
        {/* Landing Page */}
        <Route path="/landing-page" element={<LandingPage />} />
        {/*Auth-flow - Corrected approach */}

        <Route
          path="/auth/*"
          element={<Layout Items={authMenu} disabled={true} />}
        >
          <Route index element={<Navigate to="personal-info" replace />} />
          {auth.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        <Route path="/dashboard/*" element={<Layout Items={dashboardMenu} />}>
          <Route index element={<Navigate to="home" replace />} />
          {dashboard.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>
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
