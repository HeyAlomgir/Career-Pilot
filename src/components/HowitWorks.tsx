"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiSearch, FiSend, FiCheckCircle } from "react-icons/fi";

const steps = [
    { icon: FiUserPlus, title: "Create an Account", desc: "Sign up as a Job Seeker or Employer in seconds." },
    { icon: FiSearch, title: "Discover Opportunities", desc: "Browse AI-matched jobs tailored to your skills." },
    { icon: FiSend, title: "Apply with Confidence", desc: "Submit applications with just a few clicks." },
    { icon: FiCheckCircle, title: "Get Hired", desc: "Track your applications and land your dream role." },
];

export default function HowItWorks(): React.JSX.Element {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        How CareerPilot Works
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Four simple steps to your next opportunity
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 text-center"
                        >
                            <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                {i + 1}
                            </div>
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4">
                                <step.icon className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{step.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}