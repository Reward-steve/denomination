import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Initialize state safely (avoids hydration mismatches in React 18+)
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(storedAuth === "true");
  }, []);

  // ✅ Memoized functions (no re-renders unless needed)
  const login = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
