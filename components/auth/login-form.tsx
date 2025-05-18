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
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { login, setToken } from "@/lib/api/auth";
import { useI18n } from "@/lib/i18n-simple";

// Get language for validation messages
const getFormSchema = (language: string) =>
  z.object({
    email: z.string().email({
      message:
        language === "en"
          ? "Please enter a valid email address."
          : "একটি বৈধ ইমেল ঠিকানা লিখুন।",
    }),
    password: z.string().min(6, {
      message:
        language === "en"
          ? "Password must be at least 6 characters."
          : "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    }),
  });

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { language } = useI18n();

  // Create form schema based on current language
  const formSchema = getFormSchema(language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Enable real-time validation
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    console.log("Login attempt with:", { email: values.email });

    try {
      // Add more detailed debugging
      console.log("Sending login request...");

      // Use a try-catch block specifically for the fetch operation
      let response;
      try {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
        console.log("Fetch completed successfully");
      } catch (fetchError) {
        console.error("Fetch operation failed:", fetchError);
        throw new Error("Network error: Could not connect to the server");
      }

      console.log("Login response status:", response.status);

      // Try to parse the JSON response
      let data;
      try {
        data = await response.json();
        console.log("Login response data:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Response not OK:", response.status, data);
        throw new Error(data.message || "Login failed");
      }

      const { token, user } = data;

      // Store token
      console.log("Storing token:", token ? "Token exists" : "No token");
      console.log("User data:", user);

      // Explicitly log localStorage operations
      try {
        localStorage.setItem("token", token);
        console.log("Token stored in localStorage");
      } catch (storageError) {
        console.error("Failed to store token in localStorage:", storageError);
      }

      // Redirect based on user role
      console.log("Redirecting based on role:", user.role);
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        language === "en"
          ? "Invalid email or password. Please try again."
          : "অবৈধ ইমেল বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-primary hover:underline text-sm"
        >
          Forgot your password?
        </Link>
      </div>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
