"use client";

import React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Calendar,
  Search,
  Stethoscope,
  LogOut,
  Pill,
} from "lucide-react";
import { isAuthenticated } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;
  const { logout, isAuthenticated: isAuthContextAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // No need to redirect here as the logout function in auth context already handles it
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Use useState and useEffect to handle client-side authentication check
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // First check auth context, then fallback to the isAuthenticated function
    setIsLoggedIn(isAuthContextAuthenticated || isAuthenticated());
  }, [isAuthContextAuthenticated]);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-4 py-4">
            <div className="font-bold text-xl text-primary">HealthConnect</div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/")}
                className="group transition-colors hover:bg-primary/5"
              >
                <Link href="/">
                  <Home className="h-5 w-5 text-primary group-hover:text-primary" />
                  <span className="group-hover:text-primary">Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/find-doctor")}
                className="group transition-colors hover:bg-primary/5"
              >
                <Link href="/find-doctor">
                  <Search className="h-5 w-5 text-primary group-hover:text-primary" />
                  <span className="group-hover:text-primary">Find Doctor</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/symptom-checker")}
                className="group transition-colors hover:bg-primary/5"
              >
                <Link href="/symptom-checker">
                  <Stethoscope className="h-5 w-5 text-primary group-hover:text-primary" />
                  <span className="group-hover:text-primary">
                    Symptom Checker
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isLoggedIn && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/appointments")}
                    className="group transition-colors hover:bg-primary/5"
                  >
                    <Link href="/appointments">
                      <Calendar className="h-5 w-5 text-primary group-hover:text-primary" />
                      <span className="group-hover:text-primary">
                        My Appointments
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/prescriptions")}
                    className="group transition-colors hover:bg-primary/5"
                  >
                    <Link href="/prescriptions">
                      <Pill className="h-5 w-5 text-primary group-hover:text-primary" />
                      <span className="group-hover:text-primary">
                        Prescriptions
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/50 p-4">
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600 transition-colors focus:ring-2 focus:ring-red-300 outline-offset-2"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-primary/5 hover:text-primary transition-colors focus:ring-2 focus:ring-primary/30 outline-offset-2"
                  asChild
                >
                  <Link href="/login">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 17L15 12L10 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 12H3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Login
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start gap-2 relative group overflow-hidden bg-white text-primary hover:bg-white/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 outline-offset-2"
                  asChild
                >
                  <Link href="/register">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 8V14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 11H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Register
                    <span className="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-transparent transition-colors duration-300"></span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  // Use state to track client-side rendering
  const [mounted, setMounted] = React.useState(false);

  // Mark when component is mounted (client-side only)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        {/* Only render AppSidebar on client-side to avoid hydration issues */}
        {mounted && <AppSidebar />}
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
