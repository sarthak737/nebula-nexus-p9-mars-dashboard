"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Sun, Thermometer, Wind, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface WeatherData {
  maxTemp: number | string;
  minTemp: number | string;
  windSpeed: number | string;
  pressure: number | string;
  season: string;
  windDirection: string;
  uvIndex: string;
  visibility: string;
  dustStorm: boolean;
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
        const latestData = data[latestSol];

        setWeatherData({
          maxTemp: latestData.AT?.mx ?? "N/A",
          minTemp: latestData.AT?.mn ?? "N/A",
          windSpeed: latestData.HWS?.av ?? "N/A",
          pressure: latestData.PRE?.av ?? "N/A",
          season: latestData.Season ?? "Unknown",
          windDirection: latestData.WD?.most_common?.compass_point ?? "N/A",
          uvIndex: "Moderate",
          visibility: "High",
          dustStorm: false,
        });

        const history: TelemetryEntry[] = solKeys.map((sol) => ({
          time: `Sol ${sol}`,
          temperature: data[sol].AT?.av ?? 0,
          pressure: data[sol].PRE?.av ?? 0,
          windSpeed: data[sol].HWS?.av ?? 0,
        }));

        setTelemetryData(history);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NASA weather data:", err);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center py-8">Loading Mars Weather...</div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-red-400 text-center py-8">
        Failed to load weather data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Mars Weather Station</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
            <p className="text-sm opacity-90">High</p>
            <p className="text-xl font-bold">{weatherData.maxTemp}°C</p>
          </div>
          <div className="text-center">
            <Thermometer className="w-8 h-8 mx-auto mb-2 text-blue-300" />
            <p className="text-sm opacity-90">Low</p>
            <p className="text-xl font-bold">{weatherData.minTemp}°C</p>
          </div>
          <div className="text-center">
            <Wind className="w-8 h-8 mx-auto mb-2 text-green-300" />
            <p className="text-sm opacity-90">Wind</p>
            <p className="text-xl font-bold">{weatherData.windSpeed} m/s</p>
          </div>
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <p className="text-sm opacity-90">Pressure</p>
            <p className="text-xl font-bold">{weatherData.pressure} mbar</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white text-lg font-bold mb-4">
            Environmental Conditions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Season</span>
              <span className="text-white font-bold">{weatherData.season}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Wind Direction</span>
              <span className="text-white font-bold">
                {weatherData.windDirection}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">UV Index</span>
              <span className="text-red-400 font-bold">
                {weatherData.uvIndex}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Visibility</span>
              <span className="text-green-400 font-bold">
                {weatherData.visibility}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Dust Storm</span>
              <span
                className={`font-bold ${
                  weatherData.dustStorm ? "text-red-400" : "text-green-400"
                }`}
              >
                {weatherData.dustStorm ? "Active" : "Clear"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-white text-lg font-bold mb-4">
            Atmospheric Pressure
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={[
                {
                  name: "Pressure",
                  value: Number(weatherData.pressure),
                  fill: "#3b82f6",
                },
              ]}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="24"
                fontWeight="bold"
              >
                {weatherData.pressure}
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize="12"
              >
                mbar
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-white text-lg font-bold mb-4">
          24-Hour Weather History
        </h3>
        <ResponsiveContainer width="100%" height={300}>
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
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={3}
              name="Temperature (°C)"
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#10b981"
              strokeWidth={3}
              name="Pressure (mbar)"
            />
            <Line
              type="monotone"
              dataKey="windSpeed"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Wind Speed (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherTab;
