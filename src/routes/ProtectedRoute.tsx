import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRequireLogin?: () => void; // optional modal
}

export default function ProtectedRoute({
  children,
  onRequireLogin,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (onRequireLogin) {
      onRequireLogin(); // open modal if provided
      return null; // don't render children
    }
    // Redirect to auth page and save intended path
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
