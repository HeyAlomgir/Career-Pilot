"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { FiBriefcase as FiBuilding } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Job {
    _id: string;
    title: string;
    company: string;
    category: string;
    location: string;
    jobType: string;
    salary: string;
    imageUrl?: string;
}

export default function LatestJobs(): React.JSX.Element {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/jobs?sort=newest&limit=8&page=1`);
                const data = await res.json();
                setJobs(data.jobs || []);
            } catch (err) {
                console.error("Error fetching latest jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                            Latest Job Openings
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Fresh opportunities added by top companies
                        </p>
                    </div>
                    <Link
                        href="/jobs"
                        className="hidden sm:flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        View All <FiArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No jobs posted yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {jobs.slice(0, 8).map((job, i) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-5 flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-11 h-11 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                            {job.imageUrl ? (
                                                <img src={job.imageUrl} alt={job.company} className="w-full h-full object-cover" />
                                            ) : (
                                                <FiBuilding className="text-gray-300 dark:text-gray-700" size={16} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{job.company}</p>
                                        </div>
                                    </div>
                                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
                                        {job.category}
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <FiMapPin size={11} /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiBriefcase size={11} /> {job.jobType}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{job.salary}</span>
                                        <Link
                                            href={`/jobs/${job._id}`}
                                            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="sm:hidden mt-6 text-center">
                    <Link href="/jobs" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        View All Jobs →
                    </Link>
                </div>
            </div>
        </section>
    );
}