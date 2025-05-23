"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { I18nProvider } from "@/lib/i18n/i18n-context";

// Import SidebarProvider directly to avoid circular dependencies
import { SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <I18nProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
