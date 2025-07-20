"use client";

import { useEffect, useState } from "react";
import { Battery, Signal, Loader2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface PressureData {
  av?: number;
}

interface WindData {
  av?: number;
}

interface WeatherData {
  PRE?: PressureData;
  HWS?: WindData;
  [key: string]: unknown;
}

const SystemsTab = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [telemetryData, setTelemetryData] = useState<
    { time: string; battery: number }[]
  >([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const res = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}&feedtype=json&ver=1.0`
        );
        const data = await res.json();
        const latestSol = data.sol_keys[data.sol_keys.length - 1];
        setWeatherData(data[latestSol]);
      } catch (err) {
        console.error("Failed to fetch NASA data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const batteryLevel = Math.max(
    40,
    Math.min(100, 100 - (weatherData?.PRE?.av ?? 700) / 10)
  );
  const communicationStrength = Math.floor(Math.random() * 30) + 70;
  const solarPanelEfficiency = Math.max(
    60,
    100 - (weatherData?.HWS?.av ?? 10) * 3
  );

  useEffect(() => {
    // Smooth fake data with slight downward trend
    const smoothTelemetry = Array.from({ length: 10 }, (_, i) => ({
      time: `${i + 1}h`,
      battery: Math.max(0, batteryLevel - i * 1.2 + Math.random() * 2),
    }));
    setTelemetryData(smoothTelemetry);
  }, [batteryLevel]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  const systemData = [
    { name: "Power", value: batteryLevel, color: "#10b981" },
    { name: "Communication", value: communicationStrength, color: "#3b82f6" },
    { name: "Navigation", value: 92, color: "#f59e0b" },
    { name: "Instruments", value: 96, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
        <h3 className="text-white text-lg font-bold mb-6">
          System Health Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {systemData.map((system, index) => (
            <div key={index} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={system.color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - system.value / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {system.value}%
                  </span>
                </div>
              </div>
              <p className="text-slate-300 font-medium">{system.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Battery className="w-5 h-5 text-green-400" />
            Power Management
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Battery Level</span>
                <span className="text-white font-bold">{batteryLevel}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Solar Panel Efficiency</span>
                <span className="text-white font-bold">
                  {solarPanelEfficiency}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${solarPanelEfficiency}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Signal className="w-5 h-5 text-blue-400" />
            Communication Status
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Signal Strength</span>
              <span className="text-white font-bold">
                {communicationStrength}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Earth Distance</span>
              <span className="text-white font-bold">201.3M km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Signal Delay</span>
              <span className="text-white font-bold">11m 12s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Next Contact</span>
              <span className="text-green-400 font-bold">14:30 UTC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
        <h3 className="text-white text-lg font-bold mb-4">
          Battery Level History
        </h3>
        <div className="h-64">
          <Line
            data={{
              labels: telemetryData.map((d) => d.time),
              datasets: [
                {
                  label: "Battery Level",
                  data: telemetryData.map((d) => d.battery),
                  fill: true,
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  borderColor: "#10b981",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: "#fff" } },
              },
              scales: {
                x: { ticks: { color: "#9ca3af" }, grid: { color: "#334155" } },
                y: { ticks: { color: "#9ca3af" }, grid: { color: "#334155" } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemsTab;
