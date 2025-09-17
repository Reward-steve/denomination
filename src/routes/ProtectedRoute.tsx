import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Redirect version
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

// Modal version
export function ProtectedRouteWithModal({
  children,
  onRequireLogin,
}: {
  children: React.ReactNode;
  onRequireLogin: () => void;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    onRequireLogin();
    return <div />; // render nothing else
  }
  return <>{children}</>;
}
