"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiTarget, FiUsers, FiCpu, FiTrendingUp } from "react-icons/fi";

const values = [
    {
        icon: FiTarget,
        title: "Our Mission",
        desc: "To make job hunting and hiring effortless by connecting the right talent with the right opportunities through intelligent, AI-driven matching.",
    },
    {
        icon: FiUsers,
        title: "Who We Serve",
        desc: "From job seekers looking for their next career move to employers searching for the perfect candidate, CareerPilot is built for both.",
    },
    {
        icon: FiCpu,
        title: "Powered by AI",
        desc: "Our platform uses AI to analyze skills, preferences, and application history to deliver smarter job recommendations and instant support.",
    },
    {
        icon: FiTrendingUp,
        title: "Always Improving",
        desc: "We continuously refine our matching algorithms and platform experience based on real user feedback and outcomes.",
    },
];

export default function AboutPage(): React.JSX.Element {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 mb-4">
                        About Us
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Navigating Careers, One Match at a Time
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        CareerPilot is an AI-powered job marketplace built to remove the friction from job searching
                        and hiring. We combine modern web technology with intelligent automation to help job seekers
                        find roles they're genuinely excited about, and help employers find talent that fits.
                    </p>
                </motion.div>

                {/* Values grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {values.map((value, i) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6"
                        >
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                                <value.icon className="text-indigo-600 dark:text-indigo-400" size={22} />
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Story section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Our Story</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        Traditional job boards often leave both job seekers and employers sifting through irrelevant
                        listings and applications. CareerPilot was built to change that — by using AI to understand
                        what a job seeker is actually looking for, and what an employer actually needs, we cut through
                        the noise and surface matches that make sense.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Whether you're applying for your first role or hiring for a growing team, CareerPilot is
                        designed to make the process faster, clearer, and more human.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}