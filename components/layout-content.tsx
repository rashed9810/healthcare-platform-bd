"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  // During SSR or before client hydration, render without conditional elements
  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <div className="flex-1">{children}</div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
