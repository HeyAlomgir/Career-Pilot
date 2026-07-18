"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiUpload, FiX } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

interface FormData {
    title: string;
    description: string;
    company: string;
    salary: string;
    location: string;
    category: string;
    jobType: string;
    deadline: string;
    imageUrl: string;
}

const initialForm: FormData = {
    title: "",
    description: "",
    company: "",
    salary: "",
    location: "",
    category: "",
    jobType: "",
    deadline: "",
    imageUrl: "",
};

// একবার লিখে রাখলাম, বার বার className এ কপি-পেস্ট করার দরকার নেই
const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

export default function AddJobPage(): React.JSX.Element {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [formData, setFormData] = useState<FormData>(initialForm);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!IMGBB_API_KEY) {
            toast.error("Image upload is not configured yet.");
            return;
        }

        setUploading(true);
        const uploadToast = toast.loading("Uploading image...");

        try {
            const imgForm = new FormData();
            imgForm.append("image", file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: imgForm,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error("Upload failed");
            }

            setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
            toast.success("Image uploaded!", { id: uploadToast });
        } catch (err) {
            console.error("Image upload error:", err);
            toast.error("Failed to upload image.", { id: uploadToast });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, imageUrl: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { imageUrl, ...requiredData } = formData;
        for (const [key, value] of Object.entries(requiredData)) {
            if (!value.trim()) {
                toast.error(`Please fill in the "${key}" field.`);
                return;
            }
        }

        if (!user) {
            toast.error("You must be logged in to post a job.");
            return;
        }

        setLoading(true);
        const submitToast = toast.loading("Posting job...");

        try {
            const res = await fetch(`${BACKEND_URL}/api/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                    "x-user-email": user.email || "",
                    "x-user-role": (user as any).role || "",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to post job.", { id: submitToast });
                setLoading(false);
                return;
            }

            toast.success("Job posted successfully!", { id: submitToast });
            setFormData(initialForm);

            setTimeout(() => {
                router.push("/dashboard/jobs/manage");
            }, 1000);
        } catch (err) {
            console.error("Error posting job:", err);
            toast.error("Something went wrong. Please try again.", { id: submitToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-extrabold text-foreground mb-1">Post a Job</h1>
            <p className="text-gray-500 text-sm mb-6">Fill in the details below to publish a new job listing.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Company Logo / Job Image <span className="text-gray-400 font-normal">(optional)</span>
                    </label>

                    {formData.imageUrl ? (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img src={formData.imageUrl} alt="Job" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-indigo-400 transition-colors">
                            <FiUpload className="text-gray-400 mb-1" size={20} />
                            <span className="text-xs text-gray-400">{uploading ? "Uploading..." : "Upload"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior Frontend Developer"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. CareerPilot Inc."
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Job Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Salary</label>
                        <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="e.g. $60,000 - $80,000"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Dhaka / Remote"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select category</option>
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Job Type</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select job type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Application Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={inputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="mt-2 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "Posting..." : "Post Job"}
                </button>
            </form>
        </div>
    );
}