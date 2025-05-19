"use client";

import React from "react";
import { AuthProvider } from "@/contexts/auth-context";
import AdminLayout from "./layout-client";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
