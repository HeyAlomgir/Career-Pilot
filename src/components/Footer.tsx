"use client";

import React from "react";
import Link from "next/link";
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function Footer(): React.JSX.Element {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand + description */}
                    <div className="lg:col-span-1">
                        <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-extrabold text-xl">
                            CareerPilot
                        </span>
                        <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                            AI-powered job marketplace connecting talented professionals with the right opportunities.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li>
                                <Link href="/signin" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/jobs/add" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                    Post a Job
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact + Social */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Get in Touch</h3>
                        <ul className="flex flex-col gap-2 text-sm mb-4">
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiMail size={14} className="flex-shrink-0" />
                                support@careerpilot.com
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiPhone size={14} className="flex-shrink-0" />
                                +880 1234-567890
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiMapPin size={14} className="flex-shrink-0" />
                                Dhaka, Bangladesh
                            </li>
                        </ul>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://github.com/HeyAlomgir"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                                aria-label="GitHub"
                            >
                                <FiGithub size={16} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/alomgir-hossain-web/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">© {year} CareerPilot. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <Link href="/about" className="hover:text-indigo-400 transition-colors">
                            Terms
                        </Link>
                        <Link href="/about" className="hover:text-indigo-400 transition-colors">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}