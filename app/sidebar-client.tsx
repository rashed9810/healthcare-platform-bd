"use client";

import { useEffect, useState } from "react";
import SimpleSidebar from "@/components/simple-sidebar";

export default function SidebarClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render on client-side
  if (!isMounted) {
    return null;
  }

  return null; // The sidebar is rendered directly in the simple-sidebar.tsx component
}
