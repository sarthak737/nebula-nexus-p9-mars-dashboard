"use client";
import React, { useState, useEffect } from "react";

import CTASection from "@/components/landingPage/CTASection";
import ToolsSection from "@/components/landingPage/ToolsSection";
import Metrics from "@/components/landingPage/Metrics";
import LiveData from "@/components/landingPage/LiveData";
import Hero from "@/components/landingPage/Hero";
import Header from "@/components/landingPage/Header";

const MarsLandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a0f16] via-[#3b0a18] to-[#0f0b14]" />

        <div
          className="absolute w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-[#ff6b35]/30 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: `${mousePosition.x * 0.4}%`,
            top: `${mousePosition.y * 0.4}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] bg-[#f97316]/25 rounded-full blur-3xl transition-all duration-1500"
          style={{
            right: `${mousePosition.x * 0.3}%`,
            bottom: `${mousePosition.y * 0.3}%`,
            transform: "translate(50%, 50%)",
          }}
        />

        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] h-[1.5px] bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:25px_25px] opacity-10" />
      </div>

      <Header />
      <Hero />
      <LiveData />
      <Metrics />
      <ToolsSection />
      <CTASection />
    </div>
  );
};

export default MarsLandingPage;
