import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
// import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  // const navigate = useNavigate();

  // ✅ Initialize from sessionStorage on first load
  useEffect(() => {
    const storedToken = sessionStorage.getItem("tk");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // ✅ Login saves the token in sessionStorage
  const login = useCallback((newToken: string) => {
    setToken(newToken);
    sessionStorage.setItem("tk", newToken);
  }, []);

  // ✅ Logout clears from sessionStorage
  const logout = useCallback(() => {
    setToken(null);
    sessionStorage.removeItem("tk"); // clears token
    sessionStorage.removeItem("curr_user"); // clears
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
