"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from "@/lib/api/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  language: "en" | "bn";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    language: "en" | "bn"
  ) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Mark when we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run in browser environment after hydration
        if (!isClient) {
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Validate token and get user data
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await apiLogin({ email, password });
      if (isClient) {
        localStorage.setItem("token", token);
      }
      setUser(user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    language: "en" | "bn" = "en"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await apiRegister({
        name,
        email,
        password,
        phone,
        language,
      });
      if (isClient) {
        localStorage.setItem("token", token);
      }
      setUser(user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiLogout();
      if (isClient) {
        localStorage.removeItem("token");
      }
      setUser(null);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
