import { useState, useCallback } from "react";
import type { User } from "../types/auth.types";
import { AuthContext } from "./AuthContext";
import { getFromStore, saveInStore } from "../utils/appHelpers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize token and user from encrypted localStorage
  const USER_KEY = import.meta.env.VITE_USER_KEY;
  const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

  const [token, setToken] = useState<string | null>(() =>
    getFromStore<string>(TOKEN_KEY, "local")
  );
  const [user, setUser] = useState<User | null>(() =>
    getFromStore<User>(USER_KEY, "local")
  );

  const isAuthenticated = !!token;

  // Login updates state and encrypted storage
  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);

    saveInStore(TOKEN_KEY, newToken, "local");
    saveInStore(USER_KEY, newUser, "local");

    // Keep sessionStorage for quick runtime access if needed
    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  // Logout clears both state and storage
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
