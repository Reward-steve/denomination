import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getFromStore, saveInStore } from "../utils/appHelpers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // ✅ Initialize from localStorage on first load
  useEffect(() => {
    const storedToken = getFromStore("tk");
    if (storedToken) {
      setToken(storedToken as string);
    }
  }, []);

  // ✅ Login saves the token
  const login = useCallback((newToken: string) => {
    setToken(newToken);
    saveInStore("tk", newToken);
  }, []);

  // ✅ Logout clears everything
  const logout = useCallback(() => {
    setToken(null);
    sessionStorage.removeItem("tk"); // consistent cleanup
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
