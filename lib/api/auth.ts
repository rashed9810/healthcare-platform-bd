// Authentication API client

import type { User } from "./types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  language: "en" | "bn";
}

export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(
  data: RegisterData
): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Helper function to check if we're on the client side
const isClient = typeof window !== "undefined";

export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    // Clear local storage or cookies
    if (isClient) {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export function getToken(): string | null {
  if (!isClient) {
    return null;
  }
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  if (isClient) {
    localStorage.setItem("token", token);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
