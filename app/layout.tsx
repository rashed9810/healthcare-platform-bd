import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";

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
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isAdminRoute = pathname.startsWith("/admin");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Header />}
            <div className="flex-1">{children}</div>
            {!isAdminRoute && <Footer />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
