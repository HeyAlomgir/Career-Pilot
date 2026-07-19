"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { FiBriefcase, FiUsers, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function AnimatedNumber({ value, suffix = "+" }: { value: number; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 1500 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [springValue]);

    return (
        <span ref={ref}>
            {displayValue}
            {suffix}
        </span>
    );
}

export default function Stats(): React.JSX.Element {
    const [stats, setStats] = useState({ totalJobs: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/jobs?limit=1`);
                const data = await res.json();
                setStats({ totalJobs: data.total || 0 });
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    const items = [
        { icon: FiBriefcase, label: "Active Job Listings", value: stats.totalJobs || 12, suffix: "+" },
        { icon: FiUsers, label: "Registered Employers", value: 25, suffix: "+" },
        { icon: FiCheckCircle, label: "Successful Hires", value: 40, suffix: "+" },
        { icon: FiTrendingUp, label: "AI Match Accuracy", value: 95, suffix: "%" },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600 dark:bg-indigo-950">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center text-white"
                    >
                        <item.icon className="mx-auto mb-2 opacity-80" size={26} />
                        <p className="text-3xl font-extrabold">
                            <AnimatedNumber value={item.value} suffix={item.suffix} />
                        </p>
                        <p className="text-xs text-indigo-100 mt-1">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}