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
import StatusCard from "@/components/dashboard/StatusCard";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend,
  Filler
);

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
  const [multiSolData, setMultiSolData] = useState<
    {
      sol: string;
      temperature: number;
      pressure: number;
      windSpeed: number;
    }[]
  >([]);
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

        const solsToShow = data.sol_keys.slice(-5);
        const chartData = solsToShow.map((sol) => {
          const d = data[sol] as SolWeather;
          return {
            sol,
            temperature: d.AT?.mx ?? -60,
            pressure: d.PRE?.av ?? 7.1,
            windSpeed: d.HWS?.av ?? 10,
          };
        });
        setMultiSolData(chartData);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !weatherData) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  const temperatureData = {
    labels: multiSolData.map((d) => `Sol ${d.sol}`),
    datasets: [
      {
        label: "Max Temperature (°C)",
        data: multiSolData.map((d) => d.temperature),
        fill: true,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 1)",
        tension: 0.3, // smooth curves
        pointRadius: 4,
      },
    ],
  };

  const temperatureOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#f87171" } },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: { ticks: { color: "#9ca3af" } },
      y: {
        ticks: { color: "#9ca3af" },
        beginAtZero: false,
        suggestedMin: Math.min(...multiSolData.map((d) => d.temperature)) - 10,
        suggestedMax: Math.max(...multiSolData.map((d) => d.temperature)) + 10,
      },
    },
  };

  const windPressureData = {
    labels: multiSolData.map((d) => `Sol ${d.sol}`),
    datasets: [
      {
        label: "Wind Speed (m/s)",
        data: multiSolData.map((d) => d.windSpeed),
        fill: false,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        pointRadius: 4,
        yAxisID: "y1",
      },
      {
        label: "Pressure (mbar)",
        data: multiSolData.map((d) => d.pressure),
        fill: false,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
        pointRadius: 4,
        yAxisID: "y",
      },
    ],
  };

  const windPressureOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#6ee7b7" } },
      tooltip: {
        mode: "index", // <- Now correctly typed
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af" },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: { color: "#34d399" },
        beginAtZero: false,
        suggestedMin: Math.min(...multiSolData.map((d) => d.pressure)) - 2,
        suggestedMax: Math.max(...multiSolData.map((d) => d.pressure)) + 2,
        title: {
          display: true,
          text: "Pressure (mbar)",
          color: "#34d399",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        ticks: { color: "#3b82f6" },
        beginAtZero: true,
        suggestedMax: Math.max(...multiSolData.map((d) => d.windSpeed)) + 5,
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: "Wind Speed (m/s)",
          color: "#3b82f6",
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-red-400" />
            Temperature Trend (Last 5 Sols)
          </h3>
          <Line data={temperatureData} options={temperatureOptions} />
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-md">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-blue-400" />
            Wind & Pressure (Last 5 Sols)
          </h3>
          <Line data={windPressureData} options={windPressureOptions} />
        </div>
      </div>

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
