"use client";

import RegisterForm from "@/components/auth/register-form";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/contexts/auth-context";

export default function RegisterPage() {
  return (
    <I18nProvider>
      <AuthProvider>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <RegisterForm />
          </div>
        </div>
      </AuthProvider>
    </I18nProvider>
  );
}
