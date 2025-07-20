"use client";
import React, { useState, useEffect } from "react";
import { Satellite, CloudRain, Globe, Rocket } from "lucide-react";

import OverviewTab from "@/components/dashboard/OverviewTab";
import WeatherTab from "@/components/dashboard/WeatherTab";
import SystemsTab from "@/components/dashboard/SystemsTab";

const MarsMissionDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionDay] = useState(342);
  const [currentTab, setCurrentTab] = useState<
    "overview" | "weather" | "systems"
  >("overview");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10">
        <header className="border-b border-slate-700/40 backdrop-blur-sm bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
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

        <nav className="border-b border-slate-700/40 backdrop-blur-sm bg-slate-900/30">
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
