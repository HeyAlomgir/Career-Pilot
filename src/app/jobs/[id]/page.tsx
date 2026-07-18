"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiCalendar,
    FiImage,
    FiArrowLeft,
    FiX,
} from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Job {
    _id: string;
    title: string;
    description: string;
    company: string;
    salary: string;
    location: string;
    category: string;
    jobType: string;
    deadline: string;
    imageUrl?: string;
    employerId: string;
    createdAt: string;
}

export default function JobDetailsPage(): React.JSX.Element {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.id as string;
    const { data: sessionData } = useSession();
    const user = sessionData?.user;
    const userRole = (user as any)?.role || "Job Seeker";

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}`);
                if (!res.ok) {
                    setJob(null);
                    return;
                }
                const data = await res.json();
                setJob(data);
            } catch (err) {
                console.error("Error fetching job:", err);
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchJob();
    }, [jobId]);

    const handleApplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please sign in to apply.");
            router.push("/signin");
            return;
        }

        if (!coverLetter.trim()) {
            toast.error("Please write a short cover letter.");
            return;
        }

        setSubmitting(true);
        const applyToast = toast.loading("Submitting application...");

        try {
            const res = await fetch(`${BACKEND_URL}/api/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                    "x-user-email": user.email || "",
                    "x-user-role": userRole,
                },
                body: JSON.stringify({
                    jobId,
                    applicantName: user.name || "",
                    coverLetter,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to submit application.", { id: applyToast });
                setSubmitting(false);
                return;
            }

            toast.success("Application submitted successfully!", { id: applyToast });
            setShowApplyModal(false);
            setCoverLetter("");
        } catch (err) {
            console.error("Error applying:", err);
            toast.error("Something went wrong. Please try again.", { id: applyToast });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto animate-pulse">
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
                <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Job not found.</p>
                <Link href="/jobs" className="text-indigo-600 dark:text-indigo-400 font-medium">
                    Back to Browse Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">

            {/* Back link */}
            <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
            >
                <FiArrowLeft size={16} /> Back to Browse Jobs
            </Link>

            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden mb-6">
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                    {job.imageUrl ? (
                        <img src={job.imageUrl} alt={job.company} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <FiImage className="text-gray-300 dark:text-gray-700" size={40} />
                    )}
                </div>

                <div className="p-6">
                    <span className="inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full mb-3">
                        {job.category}
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                        {job.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-5">{job.company}</p>

                    {/* Key info row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                <FiDollarSign size={12} /> Salary
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.salary}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                <FiMapPin size={12} /> Location
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.location}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                <FiBriefcase size={12} /> Job Type
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.jobType}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                <FiCalendar size={12} /> Deadline
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Apply button - শুধু Job Seeker দের জন্য দেখাবে */}
                    {userRole !== "Employer" && (
                        <button
                            onClick={() => setShowApplyModal(true)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            </div>

            {/* Description / Overview */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Job Description</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                </p>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="w-full max-w-lg bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 relative">
                        <button
                            onClick={() => setShowApplyModal(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <FiX size={18} />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Apply for {job.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">at {job.company}</p>

                        <form onSubmit={handleApplySubmit} className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-900 dark:text-white">Cover Letter</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={6}
                                placeholder="Tell the employer why you're a great fit for this role..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-2 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}