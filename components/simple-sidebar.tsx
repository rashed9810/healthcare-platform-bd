"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Search, Stethoscope, LogOut } from "lucide-react";

export default function SimpleSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("Logging out...");

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Update state
      setIsLoggedIn(false);

      // Redirect to login page
      router.push("/login");

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r dark:bg-gray-950 dark:border-gray-800">
      <div className="p-4 border-b">
        <div className="font-bold text-xl text-primary">HealthConnect</div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive("/")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : ""
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            href="/find-doctor"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive("/find-doctor")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : ""
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Find Doctor</span>
          </Link>

          <Link
            href="/symptom-checker"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive("/symptom-checker")
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : ""
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Symptom Checker</span>
          </Link>

          {isLoggedIn && (
            <Link
              href="/appointments"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
                isActive("/appointments")
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : ""
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>My Appointments</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="border-t p-4">
        {isLoggedIn ? (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/auth/login">
                <span>Login</span>
              </Link>
            </Button>
            <Button className="w-full justify-start gap-2" asChild>
              <Link href="/auth/register">
                <span>Register</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
