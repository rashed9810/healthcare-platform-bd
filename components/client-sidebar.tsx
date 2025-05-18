"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "./sidebar";

export default function ClientSidebar() {
  // Use state to track client-side rendering
  const [mounted, setMounted] = useState(false);

  // Mark when component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client-side to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return <AppSidebar />;
}
