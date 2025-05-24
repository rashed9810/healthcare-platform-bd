"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/i18n-context";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {t("common.appName")}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-lg font-bold">
                {t("common.appName")}
              </SheetTitle>
              <nav className="flex flex-col gap-4 mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {t("navigation.home")}
                </Link>
                <Link
                  href="/symptom-checker"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {t("navigation.symptomChecker")}
                </Link>
                <Link
                  href="/find-doctor"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {t("navigation.findDoctor")}
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild variant="outline">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      {t("auth.login")}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                    >
                      {t("auth.register")}
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {t("settings.theme")}:
                      </span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {t("settings.language")}:
                      </span>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
