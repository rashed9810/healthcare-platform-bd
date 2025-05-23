"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import EnhancedAuthLayout from "@/components/auth/enhanced-auth-layout";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  Shield,
  CheckCircle,
  Smartphone,
  Globe,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || (language === "en" ? "Login failed" : "লগইন ব্যর্থ"));
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on user role
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "doctor") {
          router.push("/doctor/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError(language === "en" ? "An error occurred during login" : "লগইনের সময় একটি ত্রুটি ঘটেছে");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginOptions = [
    {
      role: "patient",
      email: "patient@example.com",
      label: language === "en" ? "Demo Patient" : "ডেমো রোগী",
      icon: "👤",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      role: "doctor", 
      email: "doctor@example.com",
      label: language === "en" ? "Demo Doctor" : "ডেমো ডাক্তার",
      icon: "👨‍⚕️",
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      role: "admin",
      email: "test@example.com", 
      label: language === "en" ? "Demo Admin" : "ডেমো অ্যাডমিন",
      icon: "👨‍💼",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    }
  ];

  const handleQuickLogin = (email: string) => {
    setEmail(email);
    setPassword("password123");
  };

  return (
    <EnhancedAuthLayout 
      type="login" 
      language={language} 
      onLanguageChange={setLanguage}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === "en" ? "Welcome Back!" : "স্বাগতম!"}
          </h2>
          <p className="text-gray-600">
            {language === "en" 
              ? "Sign in to access your healthcare dashboard"
              : "আপনার স্বাস্থ্যসেবা ড্যাশবোর্ড অ্যাক্সেস করতে সাইন ইন করুন"
            }
          </p>
        </div>

        {/* Quick Login Options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 text-center">
            {language === "en" ? "Quick Demo Access" : "দ্রুত ডেমো অ্যাক্সেস"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {quickLoginOptions.map((option) => (
              <button
                key={option.role}
                onClick={() => handleQuickLogin(option.email)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200 text-center",
                  option.color
                )}
              >
                <div className="text-xl mb-1">{option.icon}</div>
                <div className="text-xs font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {language === "en" ? "Or continue with email" : "অথবা ইমেইল দিয়ে চালিয়ে যান"}
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              {language === "en" ? "Email Address" : "ইমেইল ঠিকানা"}
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder={language === "en" ? "Enter your email" : "আপনার ইমেইল দিন"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              {language === "en" ? "Password" : "পাসওয়ার্ড"}
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={language === "en" ? "Enter your password" : "আপনার পাসওয়ার্ড দিন"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                {language === "en" ? "Remember me" : "আমাকে মনে রাখুন"}
              </Label>
            </div>
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {language === "en" ? "Forgot password?" : "পাসওয়ার্ড ভুলে গেছেন?"}
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {language === "en" ? "Signing in..." : "সাইন ইন করা হচ্ছে..."}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                {language === "en" ? "Sign In" : "সাইন ইন"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500" />
            <span>{language === "en" ? "Secure Login" : "নিরাপদ লগইন"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Smartphone className="h-4 w-4 text-blue-500" />
            <span>{language === "en" ? "Mobile Ready" : "মোবাইল প্রস্তুত"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Globe className="h-4 w-4 text-purple-500" />
            <span>{language === "en" ? "Bilingual" : "দ্বিভাষিক"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>{language === "en" ? "Fast Access" : "দ্রুত অ্যাক্সেস"}</span>
          </div>
        </div>
        
        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {language === "en" ? "Don't have an account?" : "অ্যাকাউন্ট নেই?"}{" "}
            <Link 
              href="/auth/register" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {language === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন"}
            </Link>
          </p>
        </div>
      </div>
    </EnhancedAuthLayout>
  );
}
