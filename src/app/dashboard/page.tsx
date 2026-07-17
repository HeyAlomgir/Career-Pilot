"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";

export default function DashboardHomePage(): React.JSX.Element {
    const { data: sessionData, isPending } = useSession();
    const user = sessionData?.user;
    const role = (user as any)?.role || "Job Seeker";

    if (isPending) {
        return <div className="text-sm text-gray-500">Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {user?.name || "there"} 👋
            </h1>
            <p className="text-gray-500">
                You are signed in as an <span className="font-medium text-indigo-600 dark:text-indigo-400">{role}</span>.
            </p>

            {/* এখানে পরে stats card / recent jobs / recent applications বসবে */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-black/40">
                    <p className="text-sm text-gray-500">
                        {role === "Employer" ? "Jobs Posted" : "Applications Sent"}
                    </p>
                    <p className="text-3xl font-bold mt-1">0</p>
                </div>
            </div>
        </div>
    );
}
