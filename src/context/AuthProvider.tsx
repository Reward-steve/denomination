import { useState, useCallback } from "react";
import type { User } from "../types/auth.types";
import { AuthContext } from "./AuthContext";
import { getFromStore, saveInStore } from "../utils/appHelpers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize token and user from encrypted localStorage
  const [token, setToken] = useState<string | null>(() =>
    getFromStore<string>("tk", "local")
  );
  const [user, setUser] = useState<User | null>(() =>
    getFromStore<User>("curr_user", "local")
  );

  const isAuthenticated = !!token;

  // Login updates state and encrypted storage
  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    saveInStore("tk", newToken, "local");
    saveInStore("curr_user", newUser, "local");

    // Keep sessionStorage for quick runtime access if needed
    sessionStorage.setItem("tk", newToken);
    sessionStorage.setItem("curr_user", JSON.stringify(newUser));
  }, []);

  // Logout clears both state and storage
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem("tk");
    sessionStorage.removeItem("curr_user");

    localStorage.removeItem("tk");
    localStorage.removeItem("curr_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
