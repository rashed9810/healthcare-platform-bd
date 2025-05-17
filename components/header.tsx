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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              HealthConnect
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
              <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-4">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/symptom-checker"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Symptom Checker
                </Link>
                <Link
                  href="/find-doctor"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Find Doctor
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild variant="outline">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Theme:</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Language:</span>
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
