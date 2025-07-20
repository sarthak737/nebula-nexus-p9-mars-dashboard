"use client";
import { Thermometer, Wind, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const LiveData = () => {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);

  useEffect(() => {
    const fetchMarsWeather = async () => {
      try {
        const res = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}&feedtype=json&ver=1.0`
        );
        const data = await res.json();
        const latestSol = data.sol_keys?.at(-1);
        if (!latestSol) return;

        const latestData = data[latestSol];
        setCurrentTemp(latestData?.AT?.av ?? null);
        setWindSpeed(latestData?.HWS?.av ?? null);
        setPressure(latestData?.PRE?.av ?? null);
      } catch (err) {
        console.error("Failed to fetch Mars weather:", err);
      }
    };

    fetchMarsWeather();
    const interval = setInterval(fetchMarsWeather, 3600 * 1000);
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({
    icon,
    label,
    value,
    unit,
    source,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    unit: string;
    source: string;
  }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        {icon}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{label}</h3>
      <p className="text-2xl sm:text-3xl font-bold">
        {value !== "—" ? `${value} ${unit}` : "—"}
      </p>
      <p className="text-xs text-gray-500 mt-2">{source}</p>
    </div>
  );

  return (
    <section className="relative z-10 px-4 sm:px-6 py-12 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={
              <Thermometer className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            }
            label="Surface Temperature"
            value={currentTemp !== null ? currentTemp.toFixed(1) : "—"}
            unit="°C"
            source="Gale Crater • Now"
          />
          <MetricCard
            icon={<Wind className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />}
            label="Wind Speed"
            value={windSpeed !== null ? windSpeed.toFixed(1) : "—"}
            unit="m/s"
            source="Perseverance • Live"
          />
          <MetricCard
            icon={
              <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            }
            label="Atmospheric Pressure"
            value={pressure !== null ? pressure.toFixed(0) : "—"}
            unit="Pa"
            source="InSight • Sol Latest"
          />
        </div>
      </div>
    </section>
  );
};

export default LiveData;
