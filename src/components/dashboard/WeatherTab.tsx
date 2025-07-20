"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Sun, Thermometer, Wind, Activity, Loader2 } from "lucide-react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement
);

interface SolData {
  First_UTC?: string;
  Last_UTC?: string;
  Season?: string;
  AT?: { mn?: number; mx?: number; av?: number };
  PRE?: { mn?: number; mx?: number; av?: number };
  HWS?: { mn?: number; mx?: number; av?: number };
  WD?: {
    most_common?: {
      compass_point?: string;
    };
  };
}

interface WeatherData {
  maxTemp: number | string;
  minTemp: number | string;
  avgTemp: number | string;
  windSpeed: number | string;
  pressure: number | string;
  pressureMin: number | string;
  pressureMax: number | string;
  season: string;
  windDirection: string;
  firstUTC: string;
  lastUTC: string;
}

interface TelemetryEntry {
  time: string;
  temperature: number;
  pressure: number;
  windSpeed: number;
}

const WeatherTab = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}&feedtype=json&ver=1.0`
        );
        const data = res.data;
        const solKeys: string[] = data.sol_keys;
        const latestSol = solKeys[solKeys.length - 1];
        const latestData: SolData = data[latestSol];

        setWeatherData({
          maxTemp: latestData.AT?.mx ?? "N/A",
          minTemp: latestData.AT?.mn ?? "N/A",
          avgTemp: latestData.AT?.av ?? "N/A",
          windSpeed: latestData.HWS?.av ?? "N/A",
          pressure: latestData.PRE?.av ?? "N/A",
          pressureMin: latestData.PRE?.mn ?? "N/A",
          pressureMax: latestData.PRE?.mx ?? "N/A",
          season: latestData.Season ?? "Unknown",
          windDirection: latestData.WD?.most_common?.compass_point ?? "N/A",
          firstUTC: latestData.First_UTC ?? "N/A",
          lastUTC: latestData.Last_UTC ?? "N/A",
        });

        const history: TelemetryEntry[] = solKeys.map((sol) => {
          const solData: SolData = data[sol];
          return {
            time: `Sol ${sol}`,
            temperature: solData.AT?.av ?? 0,
            pressure: solData.PRE?.av ?? 0,
            windSpeed: solData.HWS?.av ?? 0,
          };
        });

        setTelemetryData(history);
        setLoading(false);
      } catch (err) {
        console.error("NASA weather fetch error:", err);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-red-400 text-center py-8">
        Failed to load weather data.
      </div>
    );
  }

  const { maxTemp, minTemp, windSpeed, pressure } = weatherData;

  const lineChartData = {
    labels: telemetryData.map((d) => d.time),
    datasets: [
      {
        label: "Avg Temp (°C)",
        data: telemetryData.map((d) => d.temperature),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.3,
      },
      {
        label: "Pressure (mbar)",
        data: telemetryData.map((d) => d.pressure),
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.3,
      },
      {
        label: "Wind Speed (m/s)",
        data: telemetryData.map((d) => d.windSpeed),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const doughnutData = {
    labels: ["Atmospheric Pressure"],
    datasets: [
      {
        data: [Number(pressure), 1200 - Number(pressure)],
        backgroundColor: ["#3b82f6", "#1e293b"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Main Info Cards */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Mars Weather Station</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <Sun className="w-8 h-8 mx-auto mb-1 text-yellow-300" />
            <p className="text-sm">High</p>
            <p className="text-xl font-bold">{maxTemp}°C</p>
          </div>
          <div className="text-center">
            <Thermometer className="w-8 h-8 mx-auto mb-1 text-blue-300" />
            <p className="text-sm">Low</p>
            <p className="text-xl font-bold">{minTemp}°C</p>
          </div>
          <div className="text-center">
            <Wind className="w-8 h-8 mx-auto mb-1 text-green-300" />
            <p className="text-sm">Wind</p>
            <p className="text-xl font-bold">{windSpeed} m/s</p>
          </div>
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-1 text-purple-300" />
            <p className="text-sm">Pressure</p>
            <p className="text-xl font-bold">{pressure} mbar</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-xl shadow-md">
        <h3 className="text-white text-lg font-bold mb-4">
          Sol Weather History
        </h3>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: "#f3f4f6",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "#334155" },
              },
              y: {
                ticks: { color: "#cbd5e1" },
                grid: { color: "#334155" },
              },
            },
          }}
        />
      </div>

      {/* Chart Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Doughnut Pressure */}
        <div className="bg-slate-900/50 p-6 rounded-xl shadow-md">
          <h3 className="text-white text-lg font-bold mb-4">
            Atmospheric Pressure
          </h3>
          <Doughnut
            data={doughnutData}
            options={{
              cutout: "70%",
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `${tooltipItem.dataset.data?.[0] ?? "--"} mbar`,
                  },
                },
              },
            }}
          />
          <div className="text-center mt-4 text-white text-lg font-semibold">
            {pressure} mbar
          </div>
        </div>

        {/* Line Chart */}
      </div>
    </div>
  );
};

export default WeatherTab;
