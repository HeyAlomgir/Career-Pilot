"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiSearch, FiMapPin, FiBriefcase, FiBriefcase as FiBuilding } from "react-icons/fi";

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
    createdAt: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const filterInputClass =
    "bg-transparent outline-none w-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500";
const selectClass =
    "w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none";

export default function JobsPage(): React.JSX.Element {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (category) params.append("category", category);
            if (location) params.append("location", location);
            params.append("sort", sort);
            params.append("page", page.toString());
            params.append("limit", "8");

            const res = await fetch(`${BACKEND_URL}/api/jobs?${params.toString()}`);
            const data = await res.json();

            setJobs(data.jobs || []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [search, category, location, sort, page]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto">

            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Browse Jobs</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{total} opportunities waiting for you</p>
            </div>

            {/* Search + Filter Bar */}
            <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
            >
                <div className="w-full md:flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <FiSearch className="text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search job title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={filterInputClass}
                    />
                </div>

                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(1);
                    }}
                    className={selectClass}
                >
                    <option value="">All Categories</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Full Stack Development">Full Stack Development</option>
                    <option value="MERN Stack">MERN Stack</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="DevOps">DevOps</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Other">Other</option>
                </select>

                <div className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <FiMapPin className="text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Location..."
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            setPage(1);
                        }}
                        className={filterInputClass}
                    />
                </div>

                <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>

                <button
                    type="submit"
                    className="w-full md:w-auto px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Search
                </button>
            </form>

            {/* Job Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 h-56 animate-pulse bg-gray-100 dark:bg-gray-900"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                            <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-3 w-2/3 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No jobs found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            className="flex flex-col justify-between h-56 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-5"
                        >
                            <div>
                                {/* Avatar (left) + Title/Company (right) - পাশাপাশি */}
                                <div className="flex items-start gap-3 mb-3">
                                    {/* Avatar - গোল আকৃতির ছোট ছবি */}
                                    <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                        {job.imageUrl ? (
                                            <img src={job.imageUrl} alt={job.company} className="w-full h-full object-cover" />
                                        ) : (
                                            <FiBuilding className="text-gray-300 dark:text-gray-700" size={20} />
                                        )}
                                    </div>

                                    {/* Title + Company (ছবির পাশে) */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{job.company}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
                                            {job.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Description নিচে, পুরো width জুড়ে */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{job.description}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 mt-2">
                                    <span className="flex items-center gap-1">
                                        <FiMapPin size={12} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiBriefcase size={12} /> {job.jobType}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{job.salary}</span>
                                    <Link
                                        href={`/jobs/${job._id}`}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400 px-3">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}