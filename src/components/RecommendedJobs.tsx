"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { FiCpu, FiMapPin, FiBriefcase } from "react-icons/fi";
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

export default function RecommendedJobs(): React.JSX.Element {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/ai/recommendations`, {
                    headers: { "x-user-id": user.id },
                });
                const data = await res.json();
                setJobs(data.recommendations || []);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    // if (!loading && jobs.length === 0) {
    //     return <></>;
    // }

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                    <FiCpu className="text-indigo-600 dark:text-indigo-400" size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">AI Recommended For You</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Based on your application history
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jobs.slice(0, 4).map((job) => (
                        <Link
                            key={job._id}
                            href={`/jobs/${job._id}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 p-3 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all"
                        >
                            <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                {job.imageUrl ? (
                                    <img src={job.imageUrl} alt={job.company} className="w-full h-full object-cover" />
                                ) : (
                                    <FiBuilding className="text-gray-300 dark:text-gray-700" size={14} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{job.title}</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{job.company}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-0.5">
                                        <FiMapPin size={9} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-0.5">
                                        <FiBriefcase size={9} /> {job.jobType}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}