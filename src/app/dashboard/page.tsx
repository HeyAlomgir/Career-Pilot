"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { FiBriefcase, FiFileText, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface EmployerStats {
    totalJobs: number;
    totalApplications: number;
    pending: number;
    accepted: number;
    rejected: number;
}

interface Application {
    status: "pending" | "accepted" | "rejected";
}

const COLORS = {
    jobs: "#6366f1",
    pending: "#f59e0b",
    accepted: "#22c55e",
    rejected: "#ef4444",
};

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-5 flex items-center gap-4">
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}1A` }}
            >
                <Icon size={20} style={{ color } as React.CSSProperties} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    );
}

export default function DashboardOverviewPage(): React.JSX.Element {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;
    const userRole = (user as any)?.role || "Job Seeker";

    const [loading, setLoading] = useState(true);
    const [employerStats, setEmployerStats] = useState<EmployerStats | null>(null);
    const [seekerStats, setSeekerStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                if (userRole === "Employer") {
                    const res = await fetch(`${BACKEND_URL}/api/applications/employer/stats`, {
                        headers: {
                            "x-user-id": user.id,
                            "x-user-role": userRole,
                        },
                    });
                    const data = await res.json();
                    setEmployerStats(data);
                } else {
                    const res = await fetch(`${BACKEND_URL}/api/applications/my`, {
                        headers: { "x-user-id": user.id },
                    });
                    const data = await res.json();
                    const applications: Application[] = data.applications || [];

                    setSeekerStats({
                        total: applications.length,
                        pending: applications.filter((a) => a.status === "pending").length,
                        accepted: applications.filter((a) => a.status === "accepted").length,
                        rejected: applications.filter((a) => a.status === "rejected").length,
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, userRole]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto animate-pulse flex flex-col gap-4">
                <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-900" />
                    ))}
                </div>
                <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-900" />
            </div>
        );
    }

    // ---------- Employer view ----------
    if (userRole === "Employer") {
        const stats = employerStats || { totalJobs: 0, totalApplications: 0, pending: 0, accepted: 0, rejected: 0 };

        const barData = [
            { name: "Jobs Posted", count: stats.totalJobs, fill: COLORS.jobs },
            { name: "Pending", count: stats.pending, fill: COLORS.pending },
            { name: "Approved", count: stats.accepted, fill: COLORS.accepted },
            { name: "Rejected", count: stats.rejected, fill: COLORS.rejected },
        ];

        const pieData = [
            { name: "Pending", value: stats.pending, color: COLORS.pending },
            { name: "Approved", value: stats.accepted, color: COLORS.accepted },
            { name: "Rejected", value: stats.rejected, color: COLORS.rejected },
        ].filter((d) => d.value > 0);

        return (
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Welcome back, {user?.name || "there"}
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={FiBriefcase} label="Jobs Posted" value={stats.totalJobs} color={COLORS.jobs} />
                    <StatCard icon={FiClock} label="Pending" value={stats.pending} color={COLORS.pending} />
                    <StatCard icon={FiCheckCircle} label="Approved" value={stats.accepted} color={COLORS.accepted} />
                    <StatCard icon={FiXCircle} label="Rejected" value={stats.rejected} color={COLORS.rejected} />
                </div>

                {/* Bar chart - Jobs vs Application statuses একসাথে */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Jobs &amp; Applicant Status Overview
                    </h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {barData.map((entry, index) => (
                                    <Cell key={`bar-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart - শুধু applicant status breakdown */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Applicant Status Breakdown</h2>
                    {pieData.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                            No applicants yet. Once candidates apply, their status will show here.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        );
    }

    // ---------- Job Seeker view ----------
    const seekerBarData = [
        { name: "Pending", count: seekerStats.pending, fill: COLORS.pending },
        { name: "Accepted", count: seekerStats.accepted, fill: COLORS.accepted },
        { name: "Rejected", count: seekerStats.rejected, fill: COLORS.rejected },
    ];

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Welcome back, {user?.name || "there"}
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FiFileText} label="Total Applications" value={seekerStats.total} color={COLORS.jobs} />
                <StatCard icon={FiClock} label="Pending" value={seekerStats.pending} color={COLORS.pending} />
                <StatCard icon={FiCheckCircle} label="Accepted" value={seekerStats.accepted} color={COLORS.accepted} />
                <StatCard icon={FiXCircle} label="Rejected" value={seekerStats.rejected} color={COLORS.rejected} />
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Your Application Status</h2>
                {seekerStats.total === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                        You haven't applied to any jobs yet.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={seekerBarData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                {seekerBarData.map((entry, index) => (
                                    <Cell key={`bar-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}