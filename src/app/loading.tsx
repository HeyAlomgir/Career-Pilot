"use client";

import React from "react";
import { Spinner } from "@heroui/react";

export default function Loading(): React.JSX.Element {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4 relative overflow-hidden">

            {/* Background Decorative Gradient Blob (CareerPilot Indigo/Purple Theme) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-indigo-500/10 via-blue-500/5 to-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="z-10 flex flex-col items-center gap-4">

                {/* HeroUI Spinner */}
                <Spinner
                    size="lg"
                    color="secondary"
                    className="scale-125"
                />

                {/* Loading Text */}
                <div className="flex flex-col items-center mt-2">
                    <p className="text-sm font-semibold tracking-widest uppercase bg-gradient-to-r from-indigo-300 via-neutral-400 to-purple-300 bg-clip-text text-transparent animate-pulse">
                        Matching Opportunities...
                    </p>
                    <span className="text-[11px] text-neutral-600 mt-1 tracking-wide">
                        Loading CareerPilot Data
                    </span>
                </div>
            </div>
        </div>
    );
}