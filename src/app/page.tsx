"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import {
  FaRobot,
  FaBriefcase,
  FaFileAlt,
  FaChevronRight,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 bg-gradient-to-b from-indigo-500/10 via-white to-white dark:from-indigo-950/20 dark:via-black dark:to-black">
        {/* Background blur blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto flex flex-col items-center gap-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide border border-indigo-500/20">
            <FaRobot className="text-sm" />
            AI-Powered Career Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent max-w-3xl">
            Navigate Your Career with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
            CareerPilot connects top talent with employers through AI-driven job
            recommendations, automated resume analysis, and smart gig matching.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-8 flex items-center gap-2"
              >
                Get Started <FaChevronRight className="text-xs" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                size="lg"
                className="font-semibold border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 px-8"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12 flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Why CareerPilot?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Discover features designed to modernize the job search and hiring
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-md">
            <Card.Content className="flex flex-col gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl">
                <FaRobot />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Recommendations
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Our advanced AI recommendation system matches job seekers with
                relevant opportunities based on skills, experience, and interests.
              </p>
            </Card.Content>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-md">
            <Card.Content className="flex flex-col gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
                <FaFileAlt />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Resume Analyzer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Upload your resume to get instant AI feedback on formatting,
                keyword optimization, and overall compatibility score for target roles.
              </p>
            </Card.Content>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-md">
            <Card.Content className="flex flex-col gap-4 p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                <FaBriefcase />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Gig Marketplace
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Whether you seek a full-time position or a flexible freelance
                gig, CareerPilot offers unified tools to hire or be hired.
              </p>
            </Card.Content>
          </Card>
        </div>
      </section>


    </div>
  );
}
