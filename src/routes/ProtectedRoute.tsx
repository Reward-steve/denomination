import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRequireLogin?: () => void; // optional if you want to show a modal
}

export default function ProtectedRoute({
  children,
  onRequireLogin,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && onRequireLogin) {
      onRequireLogin(); // optionally open a login modal
    }
  }, [isAuthenticated, onRequireLogin]);

  if (!isAuthenticated) {
    // 🚀 Redirect instead of blank page
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
