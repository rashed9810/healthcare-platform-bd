"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarWrapper } from "@/components/sidebar";

// Note: We're not using AuthProvider and I18nProvider here anymore
// They will be used in specific client components that need them

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SidebarWrapper>{children}</SidebarWrapper>
    </ThemeProvider>
  );
}
