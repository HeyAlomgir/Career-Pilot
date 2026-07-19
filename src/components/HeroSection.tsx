"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const rotatingWords = ["Frontend Developer", "Backend Engineer", "UI/UX Designer", "Full Stack Developer"];

export default function Hero(): React.JSX.Element {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="min-h-[65vh] flex items-center pt-24 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/20 dark:to-transparent">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Left: text + CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 mb-5">
                        AI-Powered Career Marketplace
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                        Find your next{" "}
                        <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
                            <motion.span
                                key={wordIndex}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -30, opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="block bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                            >
                                {rotatingWords[wordIndex]}
                            </motion.span>
                        </span>{" "}
                        role with confidence.
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg">
                        CareerPilot connects top talent with employers using AI-driven job recommendations,
                        resume analysis, and smart matching — all in one platform.
                    </p>

                    {/* Quick search bar */}
                    <form
                        action="/jobs"
                        className="flex items-center gap-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 mb-6 max-w-md shadow-sm"
                    >
                        <FiSearch className="text-gray-400 ml-2 flex-shrink-0" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search job title..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex-shrink-0"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            GET STARTED <FiArrowRight size={16} />
                        </Link>
                        <Link
                            href="/dashboard/jobs"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </motion.div>

                {/* Right: animated visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative hidden lg:flex items-center justify-center"
                >
                    <div className="absolute w-72 h-72 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl" />
                    <div className="relative w-full max-w-sm rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                AI
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Smart Match</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">98% fit for your profile</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {["Frontend Developer", "MERN Stack Engineer", "UI/UX Designer"].map((role, i) => (
                                <motion.div
                                    key={role}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.15 }}
                                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs"
                                >
                                    <span className="text-gray-700 dark:text-gray-300">{role}</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {95 - i * 6}%
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}