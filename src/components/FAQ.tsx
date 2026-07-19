"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
    {
        q: "Is CareerPilot free to use?",
        a: "Yes, creating an account and browsing jobs is completely free for job seekers. Employers can post jobs at no cost as well.",
    },
    {
        q: "How does the AI job matching work?",
        a: "Our AI analyzes your profile, skills, and application history to recommend jobs that best fit your career goals.",
    },
    {
        q: "Can I apply to multiple jobs?",
        a: "Absolutely. You can apply to as many jobs as you'd like and track all your applications from your dashboard.",
    },
    {
        q: "How do employers manage applicants?",
        a: "Employers get a dedicated dashboard to view, accept, or reject applicants for each job they post.",
    },
];

export default function FAQ(): React.JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/50">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={faq.q}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left"
                            >
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                                <motion.span animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <FiChevronDown className="text-gray-400" size={18} />
                                </motion.span>
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}