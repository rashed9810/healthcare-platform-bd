"use client";

import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  // Use client-side check for admin routes
  const isAdminRoute = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname.startsWith("/admin");
    }
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute() && <Header />}
      <div className="flex-1">{children}</div>
      {!isAdminRoute() && <Footer />}
    </div>
  );
}
