import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  type LoginResponse,
  type SchoolInfo,
} from "./AuthContext";
import { loginSchool } from "../modules/auth/services/auth";
import { toast } from "react-toastify";
import { saveInStore, getFromStore } from "../utils/appHelpers";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // true initially
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSchool = getFromStore("esms-school");
    if (storedSchool) {
      setSchool(storedSchool as SchoolInfo);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse | undefined> => {
    try {
      setLoading(true);
      const res = await loginSchool(username, password);

      const token = res?.data?.token;
      const user = res?.data?.user;
      if (typeof token === "string" && token) {
        saveInStore("token", token);
      }
      if (typeof user === "object" && user) {
        saveInStore("curr_user", user);
      }

      if (!res?.success) {
        toast.error(res?.message || "Login failed");
        return;
      }

      toast.success("Sign in successful");
      const schooldata = res.data?.school;
      if (schooldata) {
        setSchool(schooldata);
        setIsAuthenticated(true);
        saveInStore("esms-school", schooldata);
      }
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSchool(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("esms-school");
    navigate("/auth/signin");
  };

  const value = {
    school,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
