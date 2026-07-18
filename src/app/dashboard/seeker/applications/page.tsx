"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiBriefcase, FiClock, FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Application {
    _id: string;
    jobId: string;
    applicantName: string;
    applicantEmail: string;
    whyInterested: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
}

// প্রতিটা status এর জন্য রঙ ও আইকন
const statusConfig: Record<
    Application["status"],
    { label: string; className: string; icon: React.ComponentType<{ className?: string; size?: number }> }
> = {
    pending: {
        label: "Pending",
        className: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
        icon: FiClock,
    },
    accepted: {
        label: "Accepted",
        className: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40",
        icon: FiCheckCircle,
    },
    rejected: {
        label: "Rejected",
        className: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40",
        icon: FiXCircle,
    },
};

export default function MyApplicationsPage(): React.JSX.Element {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyApplications = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/applications/my`, {
                headers: {
                    "x-user-id": user.id,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to load your applications.");
                setApplications([]);
                return;
            }

            setApplications(data.applications || []);
        } catch (err) {
            console.error("Error fetching applications:", err);
            toast.error("Something went wrong while loading your applications.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyApplications();
    }, [fetchMyApplications]);

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Applications</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {loading
                        ? "Loading..."
                        : `${applications.length} application${applications.length !== 1 ? "s" : ""} submitted`}
                </p>
            </div>

            {/* Loading skeleton */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse border border-gray-200 dark:border-gray-800"
                        />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                // Empty state
                <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <FiBriefcase className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't applied to any jobs yet.</p>
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        <FiSearch size={16} />
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                // Applications list
                <div className="flex flex-col gap-4">
                    {applications.map((app) => {
                        const status = statusConfig[app.status] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={app._id}
                                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5"
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Applied as <span className="font-semibold text-gray-900 dark:text-white">{app.applicantName}</span>
                                        </p>
                                    </div>

                                    <span
                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${status.className}`}
                                    >
                                        <StatusIcon size={12} />
                                        {status.label}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Why you applied:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{app.whyInterested}</p>
                                </div>

                                <div className="mt-3">
                                    <Link
                                        href={`/jobs/${app.jobId}`}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        View Job Details →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}