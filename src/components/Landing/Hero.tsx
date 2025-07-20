"use client";
import { useEffect, useState } from "react";
import { Rocket, Satellite, Activity, Play } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const [sol, setSol] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.nasa.gov/insight_weather/?api_key=${process.env.NEXT_PUBLIC_NASA_KEY}&feedtype=json&ver=1.0`
        );
        const data = await res.json();
        const latestSol = data.sol_keys?.at(-1);
        if (latestSol) setSol(Number(latestSol));
      } catch (err) {
        console.error("Failed to fetch Mars data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 text-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>
                {sol !== null
                  ? `Live Mission Data • Sol ${sol}`
                  : "Fetching Live Mars Data..."}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Explore the{" "}
              <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Red Planet
              </span>{" "}
              in Real-Time
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed">
              Access live telemetry, weather data, and mission updates from Mars
              rovers and orbiters. Monitor atmospheric conditions and track
              exploration milestones.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer group bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span>View Live Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-white/10 text-white backdrop-blur-md border border-white/20 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explore Data</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="relative flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
            <div
              className="absolute inset-0 border border-purple-500/30 rounded-full animate-spin"
              style={{ animationDuration: "20s" }}
            />
            <div
              className="absolute inset-4 border border-orange-500/20 rounded-full animate-spin"
              style={{ animationDuration: "15s" }}
            />

            <div className="relative w-full h-full bg-gradient-to-br from-orange-600 via-red-700 to-red-900 rounded-full shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-full" />
              <div className="absolute top-8 left-12 w-6 h-6 sm:w-8 sm:h-8 bg-red-800 rounded-full opacity-60" />
              <div className="absolute bottom-16 right-8 w-5 h-5 sm:w-6 sm:h-6 bg-orange-800 rounded-full opacity-40" />
              <div className="absolute top-20 right-16 w-3 h-3 sm:w-4 sm:h-4 bg-red-900 rounded-full opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-2xl opacity-20 animate-pulse" />
            </div>

            <motion.div
              className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-3 rounded-lg">
                <Satellite className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 -left-5 sm:-bottom-6 sm:-left-6"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-3 rounded-lg">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
