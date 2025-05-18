"use client";

import { I18nProvider } from "@/lib/i18n-simple";
import { AuthProvider } from "@/contexts/auth-context";
import LoginForm from "./login-form";

export default function LoginWrapper() {
  return (
    <AuthProvider>
      <I18nProvider>
        <div className="mx-auto max-w-md space-y-6 py-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
        </div>
      </I18nProvider>
    </AuthProvider>
  );
}
