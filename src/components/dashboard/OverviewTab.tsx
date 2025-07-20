"use client";

import React, { useEffect, useState } from "react";
import AlertItem, { Alert } from "@/components/dashboard/AlertItem";
import {
  Thermometer,
  Wind,
  Battery,
  Activity,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import StatusCard from "@/components/dashboard/StatusCard";

interface SolWeather {
  PRE?: { av?: number };
  HWS?: { av?: number };
  AT?: { mx?: number };
  First_UTC?: string;
}

interface WeatherAPIResponse {
  sol_keys: string[];
  [sol: string]: SolWeather | string[] | unknown;
}

const OverviewTab = () => {
  const [weatherData, setWeatherData] = useState<SolWeather | null>(null);
  const [loading, setLoading] = useState(true);

  const systemAlerts: Alert[] = [
    {
      id: 1,
      type: "info",
      message: "Solar panel cleaning cycle completed",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "warning",
      message: "Dust accumulation detected on camera lens",
      time: "15 min ago",
    },
    {
      id: 3,
      type: "success",
      message: "Sample collection successful - Rock analysis initiated",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "info",
      message: "Communication window with Earth: 14:30-16:45 UTC",
      time: "2 hours ago",
    },
  ];

  const roverStatus = {
    distance: 28.42,
    health: 94,
    communicationStrength: 89,
    batteryLevel: 81,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}&feedtype=json&ver=1.0`
        );
        const data: WeatherAPIResponse = await res.json();
        const latestSol = data.sol_keys?.[data.sol_keys.length - 1];

        const solData = data[latestSol];

        if (
          latestSol &&
          typeof solData === "object" &&
          solData !== null &&
          !Array.isArray(solData)
        ) {
          setWeatherData(solData as SolWeather);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const telemetryData = weatherData
    ? [
        {
          time: "00:00",
          temperature: (weatherData.AT?.mx ?? -60) - 25,
          pressure: (weatherData.PRE?.av ?? 7.1) - 0.4,
          windSpeed: (weatherData.HWS?.av ?? 10) - 4,
        },
        {
          time: "06:00",
          temperature: (weatherData.AT?.mx ?? -60) - 15,
          pressure: (weatherData.PRE?.av ?? 7.1) - 0.2,
          windSpeed: (weatherData.HWS?.av ?? 10) - 2,
        },
        {
          time: "12:00",
          temperature: weatherData.AT?.mx ?? -60,
          pressure: weatherData.PRE?.av ?? 7.1,
          windSpeed: weatherData.HWS?.av ?? 10,
        },
        {
          time: "18:00",
          temperature: (weatherData.AT?.mx ?? -60) - 10,
          pressure: (weatherData.PRE?.av ?? 7.1) + 0.2,
          windSpeed: (weatherData.HWS?.av ?? 10) + 2,
        },
      ]
    : [];

  if (loading || !weatherData) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Latest Weather Report</h2>
              <p className="text-red-100">
                Earth Date:{" "}
                {new Date(weatherData.First_UTC ?? "").toDateString()}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-red-100">System Health</p>
              <p className="text-lg font-bold">{roverStatus.health}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-red-100 text-sm">Distance Traveled</p>
              <p className="text-xl font-bold">{roverStatus.distance} km</p>
            </div>
            <div className="text-center">
              <p className="text-red-100 text-sm">Battery Level</p>
              <p className="text-xl font-bold">{roverStatus.batteryLevel}%</p>
            </div>
            <div className="text-center">
              <p className="text-red-100 text-sm">Comm Strength</p>
              <p className="text-xl font-bold">
                {roverStatus.communicationStrength}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Max Temp"
          value={weatherData.AT?.mx ?? -60}
          unit="°C"
          icon={Thermometer}
          status="normal"
        />
        <StatusCard
          title="Pressure"
          value={weatherData.PRE?.av ?? 7.1}
          unit="mbar"
          icon={Activity}
          status="good"
        />
        <StatusCard
          title="Wind Speed"
          value={weatherData.HWS?.av ?? 10}
          unit="m/s"
          icon={Wind}
          status="warning"
        />
        <StatusCard
          title="Battery"
          value={roverStatus.batteryLevel}
          unit="%"
          icon={Battery}
          status={roverStatus.batteryLevel > 70 ? "good" : "warning"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-400" />
            Temperature Trend (24h)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={telemetryData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#ef4444"
                fill="url(#tempGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Wind and Pressure Chart */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-400" />
            Wind & Pressure
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
        <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          System Alerts
        </h3>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
