"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-indigo-500";

export default function ContactPage(): React.JSX.Element {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);


        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setSubmitting(false);
        }, 900);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 mb-4">
                        Contact Us
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        We'd Love to Hear From You
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                        Questions, feedback, or partnership inquiries — reach out and our team will respond as soon
                        as possible.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1 flex flex-col gap-4"
                    >
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                <FiMail className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">alomgirhosssain71@gmail.com</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                <FiPhone className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Phone</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">+880 1756135199</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">
                                <FiMapPin className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Location</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Mymensingh, Bangladesh</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 sm:p-8"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="What's this about?"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    placeholder="Tell us more..."
                                    className={`${inputClass} resize-none`}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-2 w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                            >
                                <FiSend size={14} />
                                {submitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}