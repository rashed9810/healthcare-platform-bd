"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

type Language = "en" | "bn";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Load language preference from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);

    // Save language preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }

    // Reload the page to apply the language change
    window.location.reload();
  };

  // Don't render the actual content until after hydration
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-8 gap-1" disabled>
        <Globe className="h-4 w-4" />
        <span>English</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          {language === "en" ? "English" : "বাংলা"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-primary/10 font-medium" : ""}
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("bn")}
          className={language === "bn" ? "bg-primary/10 font-medium" : ""}
        >
          <span className="mr-2">🇧🇩</span> বাংলা (Bengali)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
