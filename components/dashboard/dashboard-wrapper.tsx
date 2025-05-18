"use client";

import { I18nProvider } from "@/lib/i18n-simple";
import { AuthProvider } from "@/contexts/auth-context";
import DashboardClient from "./dashboard-client";

export default function DashboardWrapper() {
  return (
    <AuthProvider>
      <I18nProvider>
        <DashboardClient />
      </I18nProvider>
    </AuthProvider>
  );
}
