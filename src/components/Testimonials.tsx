"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function Testimonials(): React.JSX.Element {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestReviews = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/reviews/latest?limit=4`);
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : data.reviews || []);
            } catch (err) {
                console.error("Error fetching testimonials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestReviews();
    }, []);

    // ডাটাবেসে কোনো review না থাকলে সেকশনটাই hide হয়ে যাবে (কোনো dummy/lorem content দেখাবে না)
    if (!loading && reviews.length === 0) {
        return <></>;
    }

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                        What Our Users Say
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Real feedback from real job seekers
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5"
                            >
                                <div className="flex items-center gap-0.5 mb-3">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <FiStar
                                            key={idx}
                                            size={13}
                                            className={idx < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-700"}
                                            fill={idx < review.rating ? "currentColor" : "none"}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-4">
                                    "{review.comment}"
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{review.userName}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}