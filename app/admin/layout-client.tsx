"use client";

import type React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon as Dashboard,
  Users,
  Calendar,
  Settings,
  BarChart,
  FileText,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-background">
          <Sidebar>
            <SidebarHeader>
              <div className="p-2">
                <h2 className="text-xl font-bold">HealthConnect</h2>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/dashboard">
                      <Dashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/doctors">
                      <Users className="h-4 w-4" />
                      <span>Doctors</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/patients">
                      <Users className="h-4 w-4" />
                      <span>Patients</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/appointments">
                      <Calendar className="h-4 w-4" />
                      <span>Appointments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/analytics">
                      <BarChart className="h-4 w-4" />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/reports">
                      <FileText className="h-4 w-4" />
                      <span>Reports</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
