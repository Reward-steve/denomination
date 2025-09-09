import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRequireLogin: () => void;
}

export default function ProtectedRoute({
  children,
  onRequireLogin,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onRequireLogin(); // open login modal
    }
  }, [isAuthenticated, onRequireLogin]);

  if (!isAuthenticated) {
    // Don't render dashboard content until logged in
    return null;
  }

  return <>{children}</>;
}
