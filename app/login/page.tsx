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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Form schema
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const router = useRouter();

  // Direct login function that bypasses form validation
  const directLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`Direct login failed: ${JSON.stringify(data)}`);
      } else {
        // Store token in localStorage
        localStorage.setItem("token", data.token);

        // Store user data
        localStorage.setItem("user", JSON.stringify(data.user));

        setError(`Direct login successful! Redirecting...`);

        // Redirect based on user role
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin/dashboard");
          } else if (data.user.role === "doctor") {
            router.push("/doctor/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      setError(`Direct login error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending login request...");

      // Check if the email is one of the test accounts
      const testEmails = [
        "test@example.com",
        "doctor@example.com",
        "patient@example.com",
      ];
      if (!testEmails.includes(values.email)) {
        setError(
          `Invalid email. Please use one of the test accounts shown above.`
        );
        setIsLoading(false);
        return;
      }

      // Call the login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      console.log("Login response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.message);

        // Provide more helpful error messages
        if (data.message === "Invalid credentials") {
          if (values.password !== "password123") {
            throw new Error(
              "Invalid password. For test accounts, use 'password123'."
            );
          } else {
            throw new Error(
              "Login failed. Please check your credentials and try again."
            );
          }
        } else {
          throw new Error(
            data.message || "Login failed. Please check your credentials."
          );
        }
      }

      console.log("Login successful, storing token");

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "doctor") {
        router.push("/doctor/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md">
          <div className="mx-auto max-w-md space-y-6 py-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your credentials to access your account
              </p>
              <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
                <p className="font-medium">Test Accounts:</p>
                <p>Admin: test@example.com / password123</p>
                <p>Doctor: doctor@example.com / password123</p>
                <p>Patient: patient@example.com / password123</p>
                <Button
                  variant="link"
                  className="text-xs text-primary p-0 h-auto mt-1"
                  onClick={() => {
                    form.setValue("email", "test@example.com");
                    form.setValue("password", "password123");
                  }}
                >
                  Auto-fill Admin Credentials
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          {...field}
                        />
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
                <div className="space-y-2">
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

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-sm"
                    onClick={async () => {
                      setIsLoading(true);
                      setError(null);

                      try {
                        const response = await fetch("/api/auth/test-login", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: "test@example.com",
                            password: "password123",
                          }),
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          setError(
                            `Test login failed: ${JSON.stringify(data)}`
                          );
                        } else {
                          setError(
                            `Test login successful: ${JSON.stringify(data)}`
                          );
                        }
                      } catch (err) {
                        setError(`Test login error: ${err.message}`);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Test Login API
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={directLogin}
                    disabled={isLoading}
                  >
                    Direct Login (Admin)
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-xs"
                    onClick={() => setDebugMode(!debugMode)}
                  >
                    {debugMode ? "Hide Debug Info" : "Show Debug Info"}
                  </Button>

                  {debugMode && (
                    <div className="p-2 bg-muted text-xs rounded">
                      <p>
                        JWT_SECRET:{" "}
                        {process.env.NEXT_PUBLIC_JWT_SECRET || "Not set"}
                      </p>
                      <p>
                        API URL:{" "}
                        {process.env.NEXT_PUBLIC_API_URL ||
                          window.location.origin}
                      </p>
                      <p>Environment: {process.env.NODE_ENV}</p>
                    </div>
                  )}
                </div>
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
        </div>
      </div>
    </div>
  );
}
