"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiBriefcase, FiEdit2 } from "react-icons/fi";

export default function ProfilePage(): React.JSX.Element {
    const { data: sessionData, refetch } = useSession();
    const user = sessionData?.user;
    const userRole = (user as any)?.role || "Job Seeker";

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        setSaving(true);
        const saveToast = toast.loading("Updating profile...");

        try {
            // Better Auth এর updateUser মেথড দিয়ে নাম আপডেট হচ্ছে
            await authClient.updateUser({ name });

            toast.success("Profile updated successfully!", { id: saveToast });
            setIsEditing(false);

            // session refresh করে নতুন নাম দেখানো হচ্ছে
            if (refetch) refetch();
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile.", { id: saveToast });
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">My Profile</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                View and manage your account information.
            </p>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">

                {/* Avatar + basic info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-full">
                            {userRole}
                        </span>
                    </div>
                </div>

                {!isEditing ? (
                    // View mode
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <FiUser className="text-gray-400 flex-shrink-0" size={18} />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Full Name</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FiMail className="text-gray-400 flex-shrink-0" size={18} />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Email Address</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FiBriefcase className="text-gray-400 flex-shrink-0" size={18} />
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Account Type</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{userRole}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 flex items-center justify-center gap-2 w-full sm:w-fit px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <FiEdit2 size={14} />
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    // Edit mode
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-500 text-sm outline-none cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed.</p>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setName(user.name || "");
                                }}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}