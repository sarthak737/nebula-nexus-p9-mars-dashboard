"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Satellite, CloudRain, Globe, Rocket, Home } from "lucide-react";

import OverviewTab from "@/components/dashboard/OverviewTab";
import WeatherTab from "@/components/dashboard/WeatherTab";
import SystemsTab from "@/components/dashboard/SystemsTab";

const MarsMissionDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionDay] = useState(342);
  const [currentTab, setCurrentTab] = useState<
    "overview" | "weather" | "systems"
  >("overview");

  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: "overview" | "weather" | "systems";
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setCurrentTab(id)}
      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base
        ${
          currentTab === id
            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderTab = () => {
    switch (currentTab) {
      case "overview":
        return <OverviewTab />;
      case "weather":
        return <WeatherTab />;
      case "systems":
        return <SystemsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a16] via-[#2b0a1a] to-[#09090b]" />

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

      <div className="relative z-10">
        <header className="backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="p-3 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-6 h-6 text-white" />
                </Link>

                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Mars Mission Control
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Real-time telemetry and analysis
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-start sm:justify-end">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Mission Time (UTC)</p>
                  <p className="text-lg font-mono text-white">
                    {currentTime.toLocaleTimeString("en-US", { hour12: false })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Sol</p>
                  <p className="text-lg font-bold text-white">{missionDay}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 py-4">
              <TabButton id="overview" label="Overview" icon={Globe} />
              <TabButton id="weather" label="Weather" icon={CloudRain} />
              <TabButton id="systems" label="Systems" icon={Satellite} />
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-8">{renderTab()}</main>
      </div>
    </div>
  );
};

export default MarsMissionDashboard;
