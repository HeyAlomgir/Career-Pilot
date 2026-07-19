"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiCpu, FiFileText, FiShield, FiZap } from "react-icons/fi";

const features = [
    {
        icon: FiCpu,
        title: "AI Job Recommendations",
        desc: "Get personalized job suggestions powered by AI that learns from your profile and preferences.",
    },
    {
        icon: FiFileText,
        title: "Smart Application Tracking",
        desc: "Track every application's status in real-time, from submission to acceptance.",
    },
    {
        icon: FiShield,
        title: "Verified Employers",
        desc: "Every company on CareerPilot goes through a role-based verification process.",
    },
    {
        icon: FiZap,
        title: "Fast & Simple Apply",
        desc: "Apply to jobs in seconds with a streamlined, distraction-free application flow.",
    },
];

export default function WhyChooseUs(): React.JSX.Element {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        Why Choose CareerPilot
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Built to make job hunting and hiring effortless
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6"
                        >
                            <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                <feature.icon className="text-indigo-600 dark:text-indigo-400" size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}