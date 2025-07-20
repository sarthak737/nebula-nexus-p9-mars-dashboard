"use client";
import { useEffect, useState } from "react";

const MetricCard = ({
  value,
  label,
  description,
  gradient,
}: {
  value: string;
  label: string;
  description: string;
  gradient: string;
}) => (
  <div className="space-y-4">
    <div
      className={`text-5xl font-bold bg-clip-text text-transparent ${gradient}`}
    >
      {value}
    </div>
    <h3 className="text-xl font-semibold">{label}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const Metrics = () => {
  const [data, setData] = useState({
    missions: "0",
    datapoints: "0",
    uptime: "0%",
    monitoring: "0/0",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData({
        missions: "15+",
        datapoints: "2.8M",
        uptime: "99.7%",
        monitoring: "24/7",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative z-10 px-6 py-20 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Mission Success Metrics</h2>
        <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
          Real-time statistics from our ongoing Mars exploration missions and
          data collection efforts.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12">
          <MetricCard
            value={data.missions}
            label="Active Missions"
            description="Rovers and orbiters currently operating"
            gradient="bg-gradient-to-r from-orange-400 to-red-500"
          />
          <MetricCard
            value={data.datapoints}
            label="Data Points"
            description="Collected daily from surface instruments"
            gradient="bg-gradient-to-r from-blue-400 to-purple-500"
          />
          <MetricCard
            value={data.uptime}
            label="Uptime"
            description="Dashboard availability and data accuracy"
            gradient="bg-gradient-to-r from-green-400 to-cyan-500"
          />
          <MetricCard
            value={data.monitoring}
            label="Monitoring"
            description="Continuous mission oversight and analysis"
            gradient="bg-gradient-to-r from-purple-400 to-pink-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Metrics;
