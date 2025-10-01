import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { User } from "../types/auth.types";
import { AuthContext } from "./AuthContext";
import { getFromStore, saveInStore } from "../utils/appHelpers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const USER_KEY = import.meta.env.VITE_USER_KEY;
  const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;
  const PREV_ROUTE_KEY = import.meta.env.VITE_PREV_ROUTE_KEY;

  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(() =>
    getFromStore<string>(TOKEN_KEY, "local")
  );

  const [user, setUser] = useState<User | null>(() =>
    getFromStore<User>(USER_KEY, "local")
  );

  const isAuthenticated = !!token;

  // ✅ Login: only updates state & storage (no redirect here)
  const login = useCallback(
    (newToken: string, newUser: User) => {
      setToken(newToken);
      setUser(newUser);
      saveInStore(TOKEN_KEY, newToken, "local");
      saveInStore(USER_KEY, newUser, "local");
    },
    [TOKEN_KEY, USER_KEY]
  );

  // ✅ Logout: clears storage, saves last route, redirects home
  const logout = useCallback(() => {
    if (isAuthenticated && location.pathname !== "/") {
      saveInStore(PREV_ROUTE_KEY, location.pathname, "local");
    }

    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    navigate("/", { replace: true });
  }, [
    isAuthenticated,
    location.pathname,
    navigate,
    TOKEN_KEY,
    USER_KEY,
    PREV_ROUTE_KEY,
  ]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        logout,
        updateAuthUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
