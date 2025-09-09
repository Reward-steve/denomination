import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeProvider";
import LandingPage from "./modules/Landing/pages/LandingPage";
import { RegistrationProvider } from "./context/RegProvider";
import Layout from "./modules/auth/components/Layout";
import { auth, dashboard } from "./routes";
import ResponsiveProvider from "./context/ResponsiveProvider";
import { authMenu, dashboardMenu } from "./constant";
import NotFound from "./modules/auth/pages/NotFound";
import { useState } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Login } from "./modules/auth/pages/LoginModal";
import { AuthProvider } from "./context/AuthProvider";

// This component will use the theme from our context
function ThemedAppContent() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        draggable
        className={"text-sm"}
      />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth-flow */}
        <Route
          path="/auth/*"
          element={<Layout Items={authMenu} disabled={true} />}
        >
          <Route index element={<Navigate to="personal-info" replace />} />
          {auth.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        {/* Dashboard flow, protected by login modal */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute onRequireLogin={() => setShowLogin(true)}>
              <Layout Items={dashboardMenu} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          {dashboard.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal for login */}
      <Login
        showLogin={showLogin}
        handleCloseLogin={() => setShowLogin(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RegistrationProvider>
        <AuthProvider>
          <ResponsiveProvider>
            <ThemedAppContent />
          </ResponsiveProvider>
        </AuthProvider>
      </RegistrationProvider>
    </ThemeProvider>
  );
}
