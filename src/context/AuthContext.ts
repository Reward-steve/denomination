import { createContext } from "react";
import type { User } from "../types/auth.types";

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (newToken: string, newUser: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});
