"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/marketing/button";
import type { ValidateDiscountCodeResponse } from "@/lib/types/discount-codes";

type AuthMode = "password" | "magic-link";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSignup = searchParams.get("signup") === "true";
  const plan = searchParams.get("plan");
  const initialCode = searchParams.get("code") || "";

  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [discountCode, setDiscountCode] = useState(initialCode);
  const [discountValidation, setDiscountValidation] = useState<{
    status: "idle" | "validating" | "valid" | "invalid";
    message?: string;
    discount?: ValidateDiscountCodeResponse["discount"];
  }>({ status: initialCode ? "idle" : "idle" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Safely get Supabase credentials with fallback
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-red-600">
            Configuration error. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  // Validate discount code
  const validateDiscountCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setDiscountValidation({ status: "idle" });
        return;
      }

      setDiscountValidation({ status: "validating" });

      try {
        const response = await fetch("/api/discount-codes/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim(), tier: plan }),
        });

        const data: ValidateDiscountCodeResponse = await response.json();

        if (data.valid && data.discount) {
          setDiscountValidation({
            status: "valid",
            message: getDiscountMessage(data.discount),
            discount: data.discount,
          });
        } else {
          setDiscountValidation({
            status: "invalid",
            message: data.error || "Invalid discount code",
          });
        }
      } catch {
        setDiscountValidation({
          status: "invalid",
          message: "Failed to validate code",
        });
      }
    },
    [plan],
  );

  // Generate a user-friendly discount message
  const getDiscountMessage = (
    discount: ValidateDiscountCodeResponse["discount"],
  ) => {
    if (!discount) return "";

    switch (discount.type) {
      case "percentage":
        return `${discount.value}% off your subscription!`;
      case "fixed":
        return `£${discount.value} off your subscription!`;
      case "free_months":
        return `${discount.value} month${discount.value > 1 ? "s" : ""} free!`;
      case "free_forever":
        return "Lifetime free access!";
      default:
        return "Discount applied!";
    }
  };

  // Build redirect URL with plan and discount code
  const buildRedirectUrl = () => {
    const params = new URLSearchParams();
    if (plan) params.set("plan", plan);
    if (discountCode.trim() && discountValidation.status === "valid") {
      params.set("discount_code", discountCode.trim());
    }
    const queryString = params.toString();
    return `${window.location.origin}/auth/callback${queryString ? `?${queryString}` : ""}`;
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Validate confirm password for signup
    if (isSignup && password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (isSignup && password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isSignup) {
        // Sign up with email and password
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: buildRedirectUrl(),
          },
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          setMessage({
            type: "success",
            text: "Check your email to confirm your account!",
          });
        }
      } else {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          // Redirect to dashboard on successful login
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const redirectTo = buildRedirectUrl();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for a login link!",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({
        type: "error",
        text: "Please enter your email address first",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for a password reset link!",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M3 18L9 12L13 16L21 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="21" cy="8" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="font-semibold text-xl text-gray-900">
            TradeSmart
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-gray-500 text-center mb-6">
            {isSignup
              ? "Start your free trial today"
              : "Sign in to your account"}
          </p>

          {/* Auth Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("password")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                authMode === "password"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("magic-link")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                authMode === "magic-link"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={
              authMode === "password" ? handlePasswordAuth : handleMagicLink
            }
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent mb-4"
            />

            {/* Password fields (only for password mode) */}
            {authMode === "password" && (
              <>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent mb-4"
                />

                {/* Confirm password (only for signup) */}
                {isSignup && (
                  <>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent mb-4"
                    />
                  </>
                )}

                {/* Forgot password link (only for login) */}
                {!isSignup && (
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Discount Code Field (shown on signup) */}
            {isSignup && (
              <div className="mb-4">
                <label
                  htmlFor="discountCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discount code{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="discountCode"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      if (discountValidation.status !== "idle") {
                        setDiscountValidation({ status: "idle" });
                      }
                    }}
                    onBlur={() => validateDiscountCode(discountCode)}
                    placeholder="Enter code"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-10 ${
                      discountValidation.status === "valid"
                        ? "border-emerald-500 bg-emerald-50"
                        : discountValidation.status === "invalid"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                    }`}
                  />
                  {/* Validation indicator */}
                  {discountValidation.status === "validating" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {discountValidation.status === "valid" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  {discountValidation.status === "invalid" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Validation message */}
                {discountValidation.message && (
                  <p
                    className={`mt-2 text-sm ${
                      discountValidation.status === "valid"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {discountValidation.message}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? "Please wait..."
                : authMode === "magic-link"
                  ? "Send Magic Link"
                  : isSignup
                    ? "Create Account"
                    : "Sign In"}
            </Button>
          </form>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Toggle */}
        <p className="text-center text-gray-500 mt-6">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/login?signup=true"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
