"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("patient" | "doctor" | "admin")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Protected route effect running");
    console.log("Auth state:", {
      isLoading,
      isAuthenticated,
      userRole: user?.role,
    });

    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
    }

    if (!isLoading && isAuthenticated && allowedRoles && user) {
      console.log("Checking role authorization:", {
        userRole: user.role,
        allowedRoles,
      });
      if (!allowedRoles.includes(user.role)) {
        console.log(
          "User role not authorized, redirecting to unauthorized page"
        );
        router.push("/unauthorized");
      } else {
        console.log("User authorized to access this route");
      }
    }
  }, [isLoading, isAuthenticated, router, allowedRoles, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
