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
          console.log("Not client side yet, skipping auth check");
          return;
        }

        console.log("Checking authentication status...");
        const token = localStorage.getItem("token");
        console.log("Token in localStorage:", token ? "exists" : "not found");

        if (!token) {
          console.log("No token found, user is not authenticated");
          setIsLoading(false);
          return;
        }

        // Validate token and get user data
        console.log("Validating token...");
        let response;
        try {
          response = await fetch("/api/auth/validate", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Token validation response status:", response.status);
        } catch (fetchError) {
          console.error("Token validation fetch error:", fetchError);
          setIsLoading(false);
          return;
        }

        if (response.ok) {
          try {
            const data = await response.json();
            console.log("Token validation successful, user data:", data.user);
            setUser(data.user);
          } catch (jsonError) {
            console.error("Failed to parse validation response:", jsonError);
            localStorage.removeItem("token");
          }
        } else {
          console.log("Token validation failed, removing token");
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
      console.log("Client-side rendering detected, checking auth");
      checkAuth();
    } else {
      console.log("Server-side rendering, skipping auth check");
    }
  }, [isClient]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    console.log("Auth context login method called with email:", email);

    try {
      console.log("Calling API login function...");

      // Use direct fetch instead of the apiLogin function for debugging
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login API error:", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("Login API success, received data:", {
        hasUser: !!data.user,
        hasToken: !!data.token,
        userRole: data.user?.role,
      });

      const { user, token } = data;

      if (isClient) {
        console.log("Storing token in localStorage");
        localStorage.setItem("token", token);
      }

      console.log("Setting user in auth context");
      setUser(user);

      console.log("Redirecting to dashboard");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error in auth context:", err);
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
