"use client";

import React from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Import the sidebar with no SSR to avoid hydration issues
const ClientSidebar = dynamic(() => import("@/components/client-sidebar"), {
  ssr: false,
});

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <ClientSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
