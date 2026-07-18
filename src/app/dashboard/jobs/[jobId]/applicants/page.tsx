"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck, FiX, FiMail, FiClock } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Application {
    _id: string;
    applicantName: string;
    applicantEmail: string;
    whyInterested: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
}

const statusStyles: Record<Application["status"], string> = {
    pending: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
    accepted: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40",
    rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40",
};

export default function JobApplicantsPage(): React.JSX.Element {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.jobId as string;
    const { data: sessionData } = useSession();
    const user = sessionData?.user;
    const userRole = (user as any)?.role || "";

    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchApplicants = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/applications/job/${jobId}`, {
                headers: {
                    "x-user-id": user.id,
                    "x-user-role": userRole,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to load applicants.");
                setApplications([]);
                return;
            }

            setApplications(data.applications || []);
        } catch (err) {
            console.error("Error fetching applicants:", err);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }, [user, userRole, jobId]);

    useEffect(() => {
        fetchApplicants();
    }, [fetchApplicants]);

    const handleStatusUpdate = async (applicationId: string, newStatus: "accepted" | "rejected") => {
        setUpdatingId(applicationId);
        const statusToast = toast.loading(`Marking as ${newStatus}...`);

        try {
            const res = await fetch(`${BACKEND_URL}/api/applications/${applicationId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-role": userRole,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to update status.", { id: statusToast });
                return;
            }

            toast.success(`Application ${newStatus}!`, { id: statusToast });
            setApplications((prev) =>
                prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
            );
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Something went wrong.", { id: statusToast });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">

            <button
                onClick={() => router.push("/dashboard/jobs/manage")}
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
            >
                <FiArrowLeft size={16} /> Back to Manage Jobs
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Applicants</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {loading ? "Loading..." : `${applications.length} applicant${applications.length !== 1 ? "s" : ""}`}
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse border border-gray-200 dark:border-gray-800"
                        />
                    ))}
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No one has applied to this job yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{app.applicantName}</p>
                                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <FiMail size={12} /> {app.applicantEmail}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                        <FiClock size={12} /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusStyles[app.status]}`}>
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Why they want this job:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{app.whyInterested}</p>
                            </div>

                            {/* Accept/Reject - শুধু pending থাকলে দেখাবে */}
                            {app.status === "pending" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate(app._id, "accepted")}
                                        disabled={updatingId === app._id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        <FiCheck size={14} /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(app._id, "rejected")}
                                        disabled={updatingId === app._id}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        <FiX size={14} /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}