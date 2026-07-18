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
    FiBriefcase as FiBuilding,
    FiArrowLeft,
    FiX,
    FiBookmark,
    FiStar,
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

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
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

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Job details fetch
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

    // Bookmark status fetch
    useEffect(() => {
        const fetchBookmarkStatus = async () => {
            if (!user || !jobId) return;
            try {
                const res = await fetch(`${BACKEND_URL}/api/bookmarks/${jobId}`, {
                    headers: { "x-user-id": user.id },
                });
                const data = await res.json();
                setIsBookmarked(data.bookmarked || false);
            } catch (err) {
                console.error("Error fetching bookmark status:", err);
            }
        };

        fetchBookmarkStatus();
    }, [user, jobId]);

    // Reviews fetch
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/reviews/${jobId}`);
                const data = await res.json();
                setReviews(data.reviews || []);
                setAvgRating(data.avgRating || 0);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };

        if (jobId) fetchReviews();
    }, [jobId]);

    const handleToggleBookmark = async () => {
        if (!user) {
            toast.error("Please sign in to bookmark jobs.");
            router.push("/signin");
            return;
        }

        setBookmarkLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/bookmarks/${jobId}`, {
                method: "POST",
                headers: { "x-user-id": user.id },
            });
            const data = await res.json();
            setIsBookmarked(data.bookmarked);
            toast.success(data.bookmarked ? "Job bookmarked!" : "Bookmark removed");
        } catch (err) {
            console.error("Error toggling bookmark:", err);
            toast.error("Something went wrong.");
        } finally {
            setBookmarkLoading(false);
        }
    };

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

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please sign in to leave a review.");
            router.push("/signin");
            return;
        }

        if (!reviewComment.trim()) {
            toast.error("Please write a comment.");
            return;
        }

        setSubmittingReview(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/reviews/${jobId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                },
                body: JSON.stringify({
                    userName: user.name || "Anonymous",
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to submit review.");
                return;
            }

            toast.success("Review submitted!");
            setReviewComment("");
            setReviewRating(5);

            // reviews আবার fetch করে নিলাম, নতুন review সহ list refresh হবে
            const refreshed = await fetch(`${BACKEND_URL}/api/reviews/${jobId}`);
            const refreshedData = await refreshed.json();
            setReviews(refreshedData.reviews || []);
            setAvgRating(refreshedData.avgRating || 0);
        } catch (err) {
            console.error("Error submitting review:", err);
            toast.error("Something went wrong.");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto animate-pulse">
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
                <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
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

                {/* Top row: Avatar (left) + Bookmark icon (right) */}
                <div className="flex items-start justify-between p-6 pb-0">
                    <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                        {job.imageUrl ? (
                            <img src={job.imageUrl} alt={job.company} className="w-full h-full object-cover" />
                        ) : (
                            <FiBuilding className="text-gray-300 dark:text-gray-700" size={24} />
                        )}
                    </div>

                    <button
                        onClick={handleToggleBookmark}
                        disabled={bookmarkLoading}
                        className={`p-2.5 rounded-full border transition-colors ${isBookmarked
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this job"}
                    >
                        <FiBookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="p-6 pt-4">
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

                    {/* Apply button - শুধু Job Seeker দের জন্য */}
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
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Job Description</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                </p>
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reviews</h2>
                    {reviews.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <FiStar className="text-yellow-500" fill="currentColor" size={14} />
                            <span className="font-semibold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
                            <span>({reviews.length})</span>
                        </div>
                    )}
                </div>

                {/* Review list */}
                {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">No reviews yet. Be the first to leave one!</p>
                ) : (
                    <div className="flex flex-col gap-4 mb-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.userName}</span>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={12}
                                                className={i < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-700"}
                                                fill={i < review.rating ? "currentColor" : "none"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add review form */}
                <form onSubmit={handleReviewSubmit} className="border-t border-gray-100 dark:border-gray-800 pt-5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Leave a Review</p>

                    <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => setReviewRating(i + 1)}
                                className="focus:outline-none"
                            >
                                <FiStar
                                    size={20}
                                    className={i < reviewRating ? "text-yellow-500" : "text-gray-300 dark:text-gray-700"}
                                    fill={i < reviewRating ? "currentColor" : "none"}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        placeholder="Share your experience..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
                    />

                    <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
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