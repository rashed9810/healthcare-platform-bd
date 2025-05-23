import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/i18n-context";
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
  // Use client-side check for admin routes
  const isAdminRoute = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname.startsWith("/admin");
    }
    return false;
  };

  return (
    <html suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <I18nProvider>
            <div className="flex flex-col min-h-screen">
              {!isAdminRoute() && <Header />}
              <div className="flex-1">{children}</div>
              {!isAdminRoute() && <Footer />}
            </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
