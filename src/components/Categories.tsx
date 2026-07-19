"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCode, FiServer, FiLayers, FiGitBranch, FiSmartphone, FiSettings, FiPenTool, FiDatabase } from "react-icons/fi";

const categories = [
    { name: "Frontend Development", icon: FiCode },
    { name: "Backend Development", icon: FiServer },
    { name: "Full Stack Development", icon: FiLayers },
    { name: "MERN Stack", icon: FiGitBranch },
    { name: "Mobile Development", icon: FiSmartphone },
    { name: "DevOps", icon: FiSettings },
    { name: "UI/UX Design", icon: FiPenTool },
    { name: "Data Science", icon: FiDatabase },
];

export default function Categories(): React.JSX.Element {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        Popular Categories
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Explore jobs by your area of expertise
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                                className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 h-32 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all text-center"
                            >
                                <cat.icon className="text-indigo-600 dark:text-indigo-400" size={24} />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                                    {cat.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}