import { createContext } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (id: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
