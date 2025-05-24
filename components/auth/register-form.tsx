"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { register, setToken } from "@/lib/api/auth";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/language-switcher";

// Get language for validation messages
const getFormSchema = (language: string) =>
  z
    .object({
      name: z.string().min(2, {
        message:
          language === "en"
            ? "Name must be at least 2 characters."
            : "নাম কমপক্ষে ২ অক্ষরের হতে হবে।",
      }),
      email: z.string().email({
        message:
          language === "en"
            ? "Please enter a valid email address."
            : "একটি বৈধ ইমেল ঠিকানা লিখুন।",
      }),
      phone: z.string().min(10, {
        message:
          language === "en"
            ? "Phone number must be at least 10 digits."
            : "ফোন নম্বর কমপক্ষে ১০ সংখ্যার হতে হবে।",
      }),
      password: z.string().min(6, {
        message:
          language === "en"
            ? "Password must be at least 6 characters."
            : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
      }),
      confirmPassword: z.string(),
      language: z.enum(["en", "bn"], {
        message:
          language === "en"
            ? "Please select a language preference."
            : "একটি ভাষা পছন্দ নির্বাচন করুন।",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message:
        language === "en" ? "Passwords do not match" : "পাসওয়ার্ড মিলছে না",
      path: ["confirmPassword"],
    });

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { language } = useI18n();

  // Create form schema based on current language
  const formSchema = getFormSchema(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      language: language,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user } = await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        language: values.language,
      });

      // Store token
      setToken(token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        language === "en"
          ? "Registration failed. Please try again."
          : "নিবন্ধন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <CardHeader>
        <CardTitle>
          {language === "en"
            ? "Create an Account"
            : "একটি অ্যাকাউন্ট তৈরি করুন"}
        </CardTitle>
        <CardDescription>
          {language === "en"
            ? "Sign up to access healthcare services"
            : "স্বাস্থ্যসেবা পরিষেবাগুলি অ্যাক্সেস করতে সাইন আপ করুন"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Full Name" : "পুরো নাম"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={language === "en" ? "John Doe" : "জন ডো"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "en" ? "Email" : "ইমেল"}</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Phone Number" : "ফোন নম্বর"}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en" ? "Password" : "পাসওয়ার্ড"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {language === "en"
                      ? "Confirm Password"
                      : "পাসওয়ার্ড নিশ্চিত করুন"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    {language === "en" ? "Preferred Language" : "পছন্দের ভাষা"}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="en" />
                        </FormControl>
                        <FormLabel className="font-normal">English</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bn" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Bengali (বাংলা)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "en"
                    ? "Creating Account..."
                    : "অ্যাকাউন্ট তৈরি করা হচ্ছে..."}
                </>
              ) : language === "en" ? (
                "Register"
              ) : (
                "নিবন্ধন করুন"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          {language === "en"
            ? "Already have an account?"
            : "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?"}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {language === "en" ? "Login" : "লগইন"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
