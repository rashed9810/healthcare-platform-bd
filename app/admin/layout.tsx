import type React from "react";
import type { Metadata } from "next";
import AdminLayoutWrapper from "./layout-wrapper";

export const metadata: Metadata = {
  title: "HealthConnect Admin - Healthcare Management System",
  description:
    "Admin dashboard for managing healthcare appointments and doctors",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
