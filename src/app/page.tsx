"use client";

import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Hero from "@/components/HeroSection";
import HowItWorks from "@/components/HowitWorks";
import LatestJobs from "@/components/LatesJob";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/Whychooseus";
import React from "react";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}

      <Hero />
      <LatestJobs />
      <Categories />
      <HowItWorks />
      <Stats />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTA />



    </div>
  );
}
