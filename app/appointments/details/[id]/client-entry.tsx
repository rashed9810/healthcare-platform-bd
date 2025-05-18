"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { I18nProvider } from "@/lib/i18n-simple";
import AppointmentDetailsContent from "./details-content";

export default function ClientEntry({ id }: { id: string }) {
  return (
    <AuthProvider>
      <I18nProvider>
        <AppointmentDetailsContent id={id} />
      </I18nProvider>
    </AuthProvider>
  );
}
