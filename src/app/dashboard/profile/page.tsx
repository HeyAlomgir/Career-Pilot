"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiCamera, FiBriefcase } from "react-icons/fi";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

export default function ProfilePage(): React.JSX.Element {
    const { data: sessionData, refetch } = useSession();
    const user = sessionData?.user;
    const userRole = (user as any)?.role || "Job Seeker";

    // Profile info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setImageUrl(user.image || "");
        }
    }, [user]);

    // Avatar image upload (imgbb)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!IMGBB_API_KEY) {
            toast.error("Image upload is not configured yet.");
            return;
        }

        setUploadingImage(true);
        const uploadToast = toast.loading("Uploading image...");

        try {
            const imgForm = new FormData();
            imgForm.append("image", file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: imgForm,
            });

            const data = await res.json();

            if (!data.success) throw new Error("Upload failed");

            setImageUrl(data.data.url);
            toast.success("Image uploaded! Don't forget to save.", { id: uploadToast });
        } catch (err) {
            console.error("Image upload error:", err);
            toast.error("Failed to upload image.", { id: uploadToast });
        } finally {
            setUploadingImage(false);
        }
    };

    // Name + Image সেভ করা
    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }

        setSavingProfile(true);
        const saveToast = toast.loading("Updating profile...");

        try {
            await authClient.updateUser({ name, image: imageUrl });
            toast.success("Profile updated successfully!", { id: saveToast });
            if (refetch) refetch();
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile.", { id: saveToast });
        } finally {
            setSavingProfile(false);
        }
    };

    // Email বদলানো (Better Auth এ verification লাগতে পারে)
    const handleEmailSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || email === user?.email) {
            toast.error("Please enter a new, different email.");
            return;
        }

        const saveToast = toast.loading("Updating email...");
        try {
            await authClient.changeEmail({ newEmail: email });
            toast.success("Email update requested. Check your inbox to verify.", { id: saveToast });
        } catch (err) {
            console.error("Error changing email:", err);
            toast.error("Failed to update email.", { id: saveToast });
        }
    };

    // Password বদলানো
    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }

        setSavingPassword(true);
        const saveToast = toast.loading("Updating password...");

        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            toast.success("Password updated successfully!", { id: saveToast });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Error changing password:", err);
            toast.error("Failed to update password. Check your current password.", { id: saveToast });
        } finally {
            setSavingPassword(false);
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
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Manage your account information and security settings.
                </p>
            </div>

            {/* Basic info + avatar */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>

                <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                    {/* Avatar upload */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                            {imageUrl ? (
                                <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                (name || "U").charAt(0).toUpperCase()
                            )}
                        </div>
                        <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <FiCamera size={14} />
                            {uploadingImage ? "Uploading..." : "Change Photo"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                            <FiUser className="inline mr-1.5" size={14} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FiBriefcase size={14} />
                        Account Type: <span className="font-semibold text-gray-900 dark:text-white">{userRole}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={savingProfile || uploadingImage}
                        className="mt-2 w-full sm:w-fit px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>

            {/* Email change */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Email Address</h2>
                <form onSubmit={handleEmailSave} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                            <FiMail className="inline mr-1.5" size={14} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                        />
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Changing your email may require verification via a confirmation link.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full sm:w-fit px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Update Email
                    </button>
                </form>
            </div>

            {/* Password change */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSave} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                            <FiLock className="inline mr-1.5" size={14} />
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className={inputClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingPassword}
                        className="w-full sm:w-fit px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                        {savingPassword ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}