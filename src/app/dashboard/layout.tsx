import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import React from "react";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
    return (
        <div className="flex h-screen w-screen bg-background overflow-hidden pt-16">
            {/* sidebar */}
            <DashboardSidebar />

            {/* right side */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* dashboard top bar */}
                <header className="border-b border-gray-200 dark:border-gray-800 w-full p-4 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md">
                    <div className="font-semibold text-sm">Dashboard</div>
                </header>

                {/* dynamic content */}
                <main className="flex-1 overflow-y-auto p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
