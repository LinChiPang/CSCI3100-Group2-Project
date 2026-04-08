import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { login as apiLogin, logout as apiLogout } from "../services/api";

export interface User {
  id: number;
  email: string;
  community_id: number;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  setSession: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const setSession = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const { user: newUser, token } = await apiLogin(email, password);
      setUser(newUser);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
      // Clear local state anyway
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
