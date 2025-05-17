"use client";

import LoginForm from "@/components/auth/login-form";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  return (
    <I18nProvider>
      <AuthProvider>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
              <p className="text-center text-muted-foreground mb-8">
                Enter your credentials to access your account
              </p>
              <LoginForm />
            </div>
          </div>
        </div>
      </AuthProvider>
    </I18nProvider>
  );
}
