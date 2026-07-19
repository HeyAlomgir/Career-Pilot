"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function CTA(): React.JSX.Element {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-14 text-center"
                >
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                        Ready to find your next opportunity?
                    </h2>
                    <p className="text-indigo-100 text-sm mb-8 max-w-md mx-auto">
                        Join thousands of professionals and companies already using CareerPilot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-600 text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            Get Started Free <FiArrowRight size={16} />
                        </Link>
                        <Link
                            href="/jobs"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}