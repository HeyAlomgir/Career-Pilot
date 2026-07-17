"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signUp } from "@/lib/auth-client";
import { Card, Input, Button, Separator, Spinner } from "@heroui/react";
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setIsLoading(true);
    setError("");
    try {
      await signIn.email({ email, password, callbackURL: "/dashboard" }, {
        onError: (ctx) => { setError(ctx.error.message || "Invalid email or password."); setIsLoading(false); },
        onSuccess: () => { router.push("/dashboard"); router.refresh(); },
      });
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "Job Seeker" | "Employer") => {
    setIsLoading(true);
    setError("");
    const demoEmail = role === "Job Seeker" ? "seeker@demo.com" : "employer@demo.com";
    const demoPassword = "DemoPassword123!";
    const demoName = role === "Job Seeker" ? "John Doe (Seeker Demo)" : "Jane Smith (Employer Demo)";
    try {
      await signIn.email({ email: demoEmail, password: demoPassword, callbackURL: "/dashboard" }, {
        onError: async (ctx) => {
          if (ctx.error.status === 400 || ctx.error.message?.toLowerCase().includes("credential") || ctx.error.message?.toLowerCase().includes("user")) {
            await signUp.email({ email: demoEmail, password: demoPassword, name: demoName, role, callbackURL: "/dashboard" }, {
              onError: (signUpCtx) => { setError(signUpCtx.error.message || "Failed to create demo user."); setIsLoading(false); },
              onSuccess: () => { router.push("/dashboard"); router.refresh(); },
            });
          } else {
            setError(ctx.error.message || "Demo login failed.");
            setIsLoading(false);
          }
        },
        onSuccess: () => { router.push("/dashboard"); router.refresh(); },
      });
    } catch (err: any) {
      setError(err?.message || "Demo login failed.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn.social({ provider: "google", callbackURL: "/dashboard" });
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed.");
      setIsLoading(false);
    }
  };

  if (sessionLoading || session) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[75vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 bg-gradient-to-tr from-white via-gray-50 to-indigo-50/20 dark:from-black dark:via-gray-950 dark:to-indigo-950/10 min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800">
        <Card.Header className="flex flex-col gap-1 items-center pt-8 pb-0 px-8 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Access your CareerPilot account to find jobs or hire talent
          </p>
        </Card.Header>

        <Card.Content className="py-6 px-8 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  <FaEnvelope />
                </span>
                <input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  <FaLock />
                </span>
                <input
                  required
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {isVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isPending={isLoading}
              className="w-full font-bold mt-1 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-xl py-2.5"
            >
              Sign In
            </Button>
          </form>

          {/* Social Sign In */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-400 font-semibold uppercase">Or continue with</span>
              <Separator className="flex-1" />
            </div>
            <Button
              onPress={handleGoogleSignIn}
              isPending={isLoading}
              className="w-full font-semibold border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl py-2.5 flex items-center justify-center gap-2"
            >
              <FaGoogle className="text-red-500" /> Sign In with Google
            </Button>
          </div>

          {/* Demo Login */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-bold text-center text-gray-500 uppercase tracking-wider mb-3">
              Course Evaluator Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                isPending={isLoading}
                onPress={() => handleDemoLogin("Job Seeker")}
                className="font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-lg"
              >
                Seeker Demo
              </Button>
              <Button
                size="sm"
                isPending={isLoading}
                onPress={() => handleDemoLogin("Employer")}
                className="font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg"
              >
                Employer Demo
              </Button>
            </div>
          </div>
        </Card.Content>

        <Card.Footer className="justify-center pb-8 px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </Card.Footer>
      </Card>
    </div>
  );
}
