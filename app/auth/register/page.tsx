"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedAuthLayout from "@/components/auth/enhanced-auth-layout";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  MapPin,
  ArrowRight, 
  Loader2,
  Shield,
  CheckCircle,
  Smartphone,
  Globe,
  Sparkles,
  Zap,
  Calendar,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.role;
      case 2:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      case 3:
        return formData.dateOfBirth && formData.gender && agreeToTerms;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "পাসওয়ার্ড মিলছে না");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || (language === "en" ? "Registration failed" : "নিবন্ধন ব্যর্থ"));
      } else {
        router.push("/auth/login?message=registration-success");
      }
    } catch (error) {
      setError(language === "en" ? "An error occurred during registration" : "নিবন্ধনের সময় একটি ত্রুটি ঘটেছে");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "patient",
      label: language === "en" ? "Patient" : "রোগী",
      description: language === "en" ? "Book appointments and manage health" : "অ্যাপয়েন্টমেন্ট বুক করুন এবং স্বাস্থ্য পরিচালনা করুন",
      icon: "👤",
      color: "bg-blue-50 border-blue-200"
    },
    {
      value: "doctor",
      label: language === "en" ? "Doctor" : "ডাক্তার",
      description: language === "en" ? "Provide consultations and manage patients" : "পরামর্শ প্রদান এবং রোগী পরিচালনা করুন",
      icon: "👨‍⚕️",
      color: "bg-green-50 border-green-200"
    }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {language === "en" ? "Basic Information" : "মৌলিক তথ্য"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "en" ? "Let's start with your basic details" : "আপনার মৌলিক বিবরণ দিয়ে শুরু করি"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                {language === "en" ? "Full Name" : "পূর্ণ নাম"}
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder={language === "en" ? "Enter your full name" : "আপনার পূর্ণ নাম দিন"}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                {language === "en" ? "Phone Number" : "ফোন নম্বর"}
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder={language === "en" ? "01XXXXXXXXX" : "০১XXXXXXXXX"}
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                {language === "en" ? "I am a" : "আমি একজন"}
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleInputChange("role", role.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                      formData.role === role.value 
                        ? "border-blue-500 bg-blue-50" 
                        : role.color
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{role.icon}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{role.label}</h4>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                      {formData.role === role.value && (
                        <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {language === "en" ? "Security Setup" : "নিরাপত্তা সেটআপ"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "en" ? "Create a secure password for your account" : "আপনার অ্যাকাউন্টের জন্য একটি নিরাপদ পাসওয়ার্ড তৈরি করুন"}
              </p>
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
                  placeholder={language === "en" ? "Create a strong password" : "একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                {language === "en" ? "Confirm Password" : "পাসওয়ার্ড নিশ্চিত করুন"}
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={language === "en" ? "Confirm your password" : "আপনার পাসওয়ার্ড নিশ্চিত করুন"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {language === "en" ? "Password strength:" : "পাসওয়ার্ডের শক্তি:"}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-2 flex-1 rounded-full",
                      formData.password.length >= level * 2
                        ? level <= 2 ? "bg-red-400" : level === 3 ? "bg-yellow-400" : "bg-green-400"
                        : "bg-gray-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {language === "en" ? "Additional Details" : "অতিরিক্ত বিবরণ"}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === "en" ? "Help us personalize your experience" : "আপনার অভিজ্ঞতা ব্যক্তিগতকরণে আমাদের সাহায্য করুন"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  {language === "en" ? "Date of Birth" : "জন্ম তারিখ"}
                </Label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {language === "en" ? "Gender" : "লিঙ্গ"}
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={language === "en" ? "Select gender" : "লিঙ্গ নির্বাচন করুন"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{language === "en" ? "Male" : "পুরুষ"}</SelectItem>
                    <SelectItem value="female">{language === "en" ? "Female" : "মহিলা"}</SelectItem>
                    <SelectItem value="other">{language === "en" ? "Other" : "অন্যান্য"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                {language === "en" ? "Address" : "ঠিকানা"}
              </Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="address"
                  type="text"
                  placeholder={language === "en" ? "Enter your address" : "আপনার ঠিকানা দিন"}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                {language === "en" ? "Emergency Contact" : "জরুরি যোগাযোগ"}
              </Label>
              <div className="relative group">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  id="emergencyContact"
                  type="tel"
                  placeholder={language === "en" ? "Emergency contact number" : "জরুরি যোগাযোগ নম্বর"}
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <Checkbox 
                id="terms" 
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                {language === "en" 
                  ? "I agree to the Terms of Service and Privacy Policy. I understand that my health information will be securely stored and used only for healthcare purposes."
                  : "আমি সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত। আমি বুঝি যে আমার স্বাস্থ্য তথ্য নিরাপদে সংরক্ষিত হবে এবং শুধুমাত্র স্বাস্থ্যসেবার উদ্দেশ্যে ব্যবহৃত হবে।"
                }
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <EnhancedAuthLayout 
      type="register" 
      language={language} 
      onLanguageChange={setLanguage}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {language === "en" ? "Join HealthConnect" : "হেলথকানেক্টে যোগ দিন"}
          </h2>
          <p className="text-gray-600">
            {language === "en" 
              ? "Create your account to access quality healthcare"
              : "মানসম্পন্ন স্বাস্থ্যসেবা অ্যাক্সেস করতে আপনার অ্যাকাউন্ট তৈরি করুন"
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                currentStep >= step 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              )}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={cn(
                  "w-12 h-1 mx-2 transition-all duration-200",
                  currentStep > step ? "bg-blue-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50 mb-6">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 h-12"
              >
                {language === "en" ? "Previous" : "পূর্ববর্তী"}
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateStep(currentStep)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {language === "en" ? "Next" : "পরবর্তী"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !validateStep(currentStep)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {language === "en" ? "Creating Account..." : "অ্যাকাউন্ট তৈরি করা হচ্ছে..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {language === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন"}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {language === "en" ? "Already have an account?" : "ইতিমধ্যে অ্যাকাউন্ট আছে?"}{" "}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              {language === "en" ? "Sign In" : "সাইন ইন"}
            </Link>
          </p>
        </div>
      </div>
    </EnhancedAuthLayout>
  );
}
