"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarWrapper } from "@/components/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { I18nProvider } from "@/lib/i18n-simple";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <I18nProvider>
          <SidebarWrapper>{children}</SidebarWrapper>
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
