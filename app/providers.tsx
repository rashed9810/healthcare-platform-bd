'use client';

import React from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarWrapper } from "@/components/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SidebarWrapper>
        {children}
      </SidebarWrapper>
    </ThemeProvider>
  );
}
