import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarWrapper } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthConnect - Healthcare Appointment Booking System",
  description:
    "Book appointments with doctors, check symptoms, and manage your healthcare journey",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </SidebarWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
