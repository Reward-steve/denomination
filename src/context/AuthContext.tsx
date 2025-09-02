import { createContext } from "react";

// This matches the structure from your login API response
export type SchoolInfo = {
  id: string;
  name: string;
  primary_email: string;
  primary_phone: string;
  address: string;
  logo: string;
  reg_status: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: { token: string; school: SchoolInfo; user: object } | null;
};

export type AuthContextType = {
  school: SchoolInfo | null;
  login: (
    username: string,
    password: string
  ) => Promise<LoginResponse | undefined>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
