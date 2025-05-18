"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { I18nProvider } from "@/lib/i18n-simple";

export default function AppointmentDetailsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </AuthProvider>
  );
}
