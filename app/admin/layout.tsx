import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AdminLayoutWrapper from "./layout-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthConnect Admin - Healthcare Management System",
  description:
    "Admin dashboard for managing healthcare appointments and doctors",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
