"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiEye, FiTrash2, FiPlusCircle } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Job {
    _id: string;
    title: string;
    company: string;
    category: string;
    jobType: string;
    location: string;
    salary: string;
    deadline: string;
    createdAt: string;
}

export default function ManageJobsPage(): React.JSX.Element {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchMyJobs = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/jobs/employer/my-jobs`, {
                headers: {
                    "x-user-id": user.id,
                    "x-user-email": user.email || "",
                    "x-user-role": (user as any).role || "",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to load your jobs.");
                setJobs([]);
                return;
            }

            setJobs(data.jobs || []);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            toast.error("Something went wrong while loading jobs.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyJobs();
    }, [fetchMyJobs]);

    const handleDelete = async (jobId: string, jobTitle: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${jobTitle}"?`);
        if (!confirmed || !user) return;

        setDeletingId(jobId);
        const deleteToast = toast.loading("Deleting job...");

        try {
            const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": user.id,
                    "x-user-email": user.email || "",
                    "x-user-role": (user as any).role || "",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to delete job.", { id: deleteToast });
                return;
            }

            toast.success("Job deleted successfully!", { id: deleteToast });
            setJobs((prev) => prev.filter((job) => job._id !== jobId));
        } catch (err) {
            console.error("Error deleting job:", err);
            toast.error("Something went wrong.", { id: deleteToast });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground">Manage Jobs</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {loading ? "Loading..." : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} posted`}
                    </p>
                </div>
                <Link
                    href="/dashboard/jobs/add"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors w-fit"
                >
                    <FiPlusCircle size={16} />
                    Post New Job
                </Link>
            </div>

            {/* Loading skeleton */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse border border-gray-200 dark:border-gray-800"
                        />
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                // Empty state
                <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                    <Link
                        href="/dashboard/jobs/add"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        <FiPlusCircle size={16} />
                        Post Your First Job
                    </Link>
                </div>
            ) : (
                // Jobs table (desktop) / cards (mobile)
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950">

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-left text-gray-500 dark:text-gray-400">
                                    <th className="px-5 py-3 font-medium">Job Title</th>
                                    <th className="px-5 py-3 font-medium">Category</th>
                                    <th className="px-5 py-3 font-medium">Location</th>
                                    <th className="px-5 py-3 font-medium">Deadline</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr
                                        key={job._id}
                                        className="border-b border-gray-100 dark:border-gray-800 last:border-0 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{job.company}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{job.category}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{job.location}</td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(job.deadline).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/jobs/${job._id}`}
                                                    className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                                                    title="View"
                                                >
                                                    <FiEye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(job._id, job.title)}
                                                    disabled={deletingId === job._id}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                        {jobs.map((job) => (
                            <div key={job._id} className="p-4 flex flex-col gap-2 bg-white dark:bg-gray-950">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{job.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.company}</p>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{job.category}</span>
                                    <span>{job.location}</span>
                                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Link
                                        href={`/jobs/${job._id}`}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                                    >
                                        <FiEye size={14} /> View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job._id, job.title)}
                                        disabled={deletingId === job._id}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/40 disabled:opacity-40"
                                    >
                                        <FiTrash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}