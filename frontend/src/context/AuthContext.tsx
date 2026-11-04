import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "@/lib/axios";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setAuthenticatedUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check logged-in user
  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    }
  };

  // Check authentication when app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout user
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    }
  };
  // Set authenticated user
  const setAuthenticatedUser = (user: User) => {
    setUser(user);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    refreshUser,
    logout,
    setAuthenticatedUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
