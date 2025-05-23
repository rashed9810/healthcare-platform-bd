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
import { useI18n, Language } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "outline",
  size = "sm",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t, availableLanguages } = useI18n();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  // Don't render the actual content until after hydration
  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("gap-1", className)}
        disabled
      >
        <Globe className="h-4 w-4" />
        <span>English</span>
      </Button>
    );
  }

  // Get the current language name
  const getCurrentLanguageName = () => {
    const currentLanguage = availableLanguages.find(
      (lang) => lang.code === language
    );
    return currentLanguage ? currentLanguage.name : "English";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-1", className)}
        >
          <Globe className="h-4 w-4" />
          {getCurrentLanguageName()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "cursor-pointer",
              language === lang.code && "bg-primary/10 font-medium"
            )}
          >
            <span className="mr-2">{lang.code === "en" ? "🇺🇸" : "🇧🇩"}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
