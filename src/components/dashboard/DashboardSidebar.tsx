"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button, Drawer } from "@heroui/react";
import {
    FiMenu,
    FiHome,
    FiPlusSquare,
    FiList,
    FiGrid,
    FiSearch,
    FiFileText,
    FiUser,
} from "react-icons/fi";

interface SidebarItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    link: string;
}

interface DashboardItemsMap {
    [key: string]: SidebarItem[];
}

export default function DashboardSidebar(): React.JSX.Element {
    const pathname = usePathname();
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    // role onujai nav item map
    const currentRole = (user as any)?.role || "Job Seeker";
    const role = currentRole.toLowerCase();

    const dashboardItems: DashboardItemsMap = {
        employer: [
            { icon: FiGrid, label: "Overview", link: "/dashboard" },
            { icon: FiPlusSquare, label: "Post a Job", link: "/dashboard/jobs/add" },
            { icon: FiList, label: "Manage Jobs", link: "/dashboard/jobs/manage" },
            { icon: FiUser, label: "Profile", link: "/dashboard/profile" },
        ],
        "job seeker": [
            { icon: FiGrid, label: "Overview", link: "/dashboard/seeker" },
            { icon: FiSearch, label: "Browse Jobs", link: "/jobs" },
            { icon: FiFileText, label: "My Applications", link: "/dashboard/seeker/applications" },
            { icon: FiUser, label: "Profile", link: "/dashboard/seeker/profile" },
        ],
    };

    const navItems = dashboardItems[role] ?? dashboardItems["job seeker"];

    const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                    <Link
                        key={item.label}
                        href={item.link}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        <item.icon className="size-5" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Mobile: Drawer trigger */}
            <Drawer>
                <Button variant="secondary" className="lg:hidden m-3">
                    <FiMenu /> Menu
                </Button>

                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>
                                    <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold text-xl">
                                        CareerPilot
                                    </span>
                                </Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body className="flex flex-col justify-between h-full pb-6">
                                <NavLinks />
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                    >
                                        <FiHome className="size-5" />
                                        Back to Home
                                    </Link>
                                </div>
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-col justify-between w-60 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black pt-6 pb-6 px-4">
                <div className="flex flex-col gap-6">
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                        <Link href="/">
                            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold text-xl">
                                CareerPilot
                            </span>
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{currentRole} Dashboard</p>
                    </div>
                    <NavLinks />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                        <FiHome className="size-5" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
