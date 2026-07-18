"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Button,
  Dropdown,
  Avatar,
  Spinner,
} from "@heroui/react";
import { FiSun, FiMoon, FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { data: sessionData, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const user = sessionData?.user;
  const userRole = (user as any)?.role || "Job Seeker";

  // Employer আর Job Seeker এর জন্য আলাদা dashboard route
  const dashboardHref = userRole === "Employer" ? "/dashboard" : "/dashboard/seeker";

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
  ];

  const employerLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Post a Job", href: "/dashboard/jobs/add" },
    { label: "Manage Jobs", href: "/dashboard/jobs/manage" },
    { label: "Dashboard", href: dashboardHref },
  ];

  const jobSeekerLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Dashboard", href: dashboardHref },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const links = !user
    ? publicLinks
    : userRole === "Employer"
      ? employerLinks
      : jobSeekerLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity">
              CareerPilot
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Theme toggle + Auth */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <FiSun size={20} className="text-yellow-500" />
                ) : (
                  <FiMoon size={20} className="text-indigo-600" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>

            {/* Auth Section */}
            {isPending ? (
              <Spinner size="sm" />
            ) : user ? (
              /* User Dropdown */
              <Dropdown>
                <Dropdown.Trigger>
                  <div className="flex items-center cursor-pointer focus:outline-none ring-2 ring-indigo-500 rounded-full">
                    <Avatar className="w-8 h-8 rounded-full">
                      {user.image && <Avatar.Image src={user.image} alt={user.name || "User"} />}
                      <Avatar.Fallback className="bg-indigo-600 text-white text-xs font-bold flex items-center justify-center w-full h-full rounded-full">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu aria-label="User Actions">
                    <Dropdown.Item id="info" textValue={user.email || ""} className="opacity-100">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-gray-500">Signed in as</span>
                        <span className="text-sm font-bold text-foreground truncate max-w-[180px]">{user.email}</span>
                        <span className="text-xs text-indigo-500 font-medium">
                          {userRole}
                        </span>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="dashboard"
                      textValue="Dashboard"
                      onAction={() => router.push(dashboardHref)}
                    >
                      <span className="flex items-center gap-2">
                        <FiSettings className="text-gray-500" />
                        Dashboard
                      </span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="logout"
                      textValue="Log Out"
                      className="text-red-500"
                      onAction={handleLogout}
                    >
                      <span className="flex items-center gap-2">
                        <FiLogOut />
                        Log Out
                      </span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              /* Sign In / Sign Up */
              <>
                <Link
                  href="/signin"
                  className="hidden md:inline-block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-4 py-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 font-bold"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          {!user && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/signin"
                className="w-full text-center py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}