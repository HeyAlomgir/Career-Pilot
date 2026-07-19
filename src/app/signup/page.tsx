"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signUp } from "@/lib/auth-client";
import { Card, Button, Spinner } from "@heroui/react";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaBriefcase, FaChevronDown } from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) { setError("Please fill in all fields."); return; }
    setIsLoading(true);
    setError("");
    try {
      await signUp.email({ email, password, name, role, callbackURL: "/dashboard" }, {
        onError: (ctx) => { setError(ctx.error.message || "Failed to create an account."); setIsLoading(false); },
        onSuccess: () => { router.push("/dashboard"); router.refresh(); },
      });
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
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
            Create Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join CareerPilot today to unlock opportunities
          </p>
        </Card.Header>

        <Card.Content className="py-6 px-8 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"><FaUser /></span>
                <input
                  required type="text" placeholder="Enter your full name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"><FaEnvelope /></span>
                <input
                  required type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"><FaLock /></span>
                <input
                  required type={isVisible ? "text" : "password"} placeholder="Create a password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <button type="button" onClick={toggleVisibility} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Toggle visibility">
                  {isVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <FaBriefcase className="text-gray-400 text-xs" /> I want to join as a...
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Job Seeker">Job Seeker — Browse &amp; Apply for Jobs</option>
                  <option value="Employer">Employer — Post &amp; Manage Job Openings</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"><FaChevronDown /></span>
              </div>
            </div>

            <Button
              type="submit"
              isPending={isLoading}
              className="w-full font-bold mt-1 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 rounded-xl py-2.5"
            >
              Create Account
            </Button>
          </form>
        </Card.Content>

        <Card.Footer className="justify-center pb-8 px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </Card.Footer>

      </Card>
    </div>
  );
}
