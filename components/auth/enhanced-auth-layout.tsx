"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Stethoscope, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  Globe,
  Smartphone,
  Clock,
  Award,
  TrendingUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  type: "login" | "register";
  language: "en" | "bn";
  onLanguageChange: (lang: "en" | "bn") => void;
}

export default function EnhancedAuthLayout({ 
  children, 
  type, 
  language, 
  onLanguageChange 
}: AuthLayoutProps) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);

  const testimonials = [
    {
      name: language === "en" ? "Dr. Fatima Rahman" : "ডা. ফাতিমা রহমান",
      role: language === "en" ? "Cardiologist, Dhaka Medical" : "হৃদরোগ বিশেষজ্ঞ, ঢাকা মেডিকেল",
      text: language === "en" 
        ? "HealthConnect has revolutionized how I manage my patients. The video consultation feature is exceptional!"
        : "হেলথকানেক্ট আমার রোগী ব্যবস্থাপনায় বিপ্লব এনেছে। ভিডিও পরামর্শ বৈশিষ্ট্যটি অসাধারণ!",
      rating: 5,
      avatar: "👩‍⚕️"
    },
    {
      name: language === "en" ? "Rahim Ahmed" : "রহিম আহমেদ",
      role: language === "en" ? "Patient, Chittagong" : "রোগী, চট্টগ্রাম",
      text: language === "en"
        ? "Amazing platform! I can consult with top doctors from home. The Bengali interface makes it so easy to use."
        : "অসাধারণ প্ল্যাটফর্ম! আমি ঘর থেকেই শীর্ষ ডাক্তারদের সাথে পরামর্শ করতে পারি। বাংলা ইন্টারফেস ব্যবহার করা খুবই সহজ।",
      rating: 5,
      avatar: "👨"
    },
    {
      name: language === "en" ? "Dr. Karim Uddin" : "ডা. করিম উদ্দিন",
      role: language === "en" ? "Pediatrician, Sylhet" : "শিশু বিশেষজ্ঞ, সিলেট",
      text: language === "en"
        ? "The prescription management and patient records system is incredibly efficient. Highly recommended!"
        : "প্রেসক্রিপশন ব্যবস্থাপনা এবং রোগীর রেকর্ড সিস্টেম অবিশ্বাস্যভাবে দক্ষ। অত্যন্ত সুপারিশকৃত!",
      rating: 5,
      avatar: "👨‍⚕️"
    }
  ];

  const stats = [
    {
      number: "50,000+",
      label: language === "en" ? "Happy Patients" : "সন্তুষ্ট রোগী",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      number: "2,500+",
      label: language === "en" ? "Expert Doctors" : "বিশেষজ্ঞ ডাক্তার",
      icon: <Stethoscope className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      number: "98.5%",
      label: language === "en" ? "Success Rate" : "সফলতার হার",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-600"
    },
    {
      number: "24/7",
      label: language === "en" ? "Available" : "উপলব্ধ",
      icon: <Clock className="h-6 w-6" />,
      color: "text-orange-600"
    }
  ];

  const features = [
    {
      icon: <Heart className="h-5 w-5" />,
      title: language === "en" ? "AI Health Assistant" : "AI স্বাস্থ্য সহায়ক",
      description: language === "en" 
        ? "Smart symptom checker and health recommendations"
        : "স্মার্ট লক্ষণ পরীক্ষক এবং স্বাস্থ্য সুপারিশ"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: language === "en" ? "Secure & Private" : "নিরাপদ ও ব্যক্তিগত",
      description: language === "en"
        ? "Bank-level security for your health data"
        : "আপনার স্বাস্থ্য তথ্যের জন্য ব্যাংক-স্তরের নিরাপত্তা"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: language === "en" ? "Mobile Payments" : "মোবাইল পেমেন্ট",
      description: language === "en"
        ? "bKash, Nagad, Rocket integration"
        : "বিকাশ, নগদ, রকেট ইন্টিগ্রেশন"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: language === "en" ? "Bilingual Support" : "দ্বিভাষিক সহায়তা",
      description: language === "en"
        ? "Full Bengali and English interface"
        : "সম্পূর্ণ বাংলা এবং ইংরেজি ইন্টারফেস"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto-rotate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HealthConnect</h1>
                <p className="text-white/80 text-sm">
                  {language === "en" ? "Bangladesh's #1 Healthcare Platform" : "বাংলাদেশের #১ স্বাস্থ্যসেবা প্ল্যাটফর্ম"}
                </p>
              </div>
            </div>

            {/* Animated Stats */}
            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 bg-white/20 rounded-xl", stats[currentStat].color)}>
                    {stats[currentStat].icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stats[currentStat].number}</div>
                    <div className="text-white/80">{stats[currentStat].label}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-white/80">{feature.icon}</div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                  </div>
                  <p className="text-white/70 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-white/90 mb-4 text-sm leading-relaxed">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{testimonials[currentTestimonial].avatar}</div>
              <div>
                <div className="font-semibold text-sm">{testimonials[currentTestimonial].name}</div>
                <div className="text-white/70 text-xs">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentTestimonial ? "bg-white" : "bg-white/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Language Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className="text-xs px-4"
              >
                English
              </Button>
              <Button
                variant={language === "bn" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("bn")}
                className="text-xs px-4"
              >
                বাংলা
              </Button>
            </div>
          </div>

          {/* Mobile Header (visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthConnect</h1>
                <p className="text-gray-600 text-sm">
                  {language === "en" ? "Healthcare Made Simple" : "স্বাস্থ্যসেবা সহজ করা হয়েছে"}
                </p>
              </div>
            </div>
          </div>

          {/* Auth Form Card */}
          <Card className="border-0 shadow-2xl shadow-blue-100/50">
            <CardContent className="p-8">
              {children}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>{language === "en" ? "Secure" : "নিরাপদ"}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{language === "en" ? "Verified" : "যাচাইকৃত"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>{language === "en" ? "Trusted" : "বিশ্বস্ত"}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {language === "en" 
                ? "Your data is protected with bank-level security"
                : "আপনার তথ্য ব্যাংক-স্তরের নিরাপত্তা দিয়ে সুরক্ষিত"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
