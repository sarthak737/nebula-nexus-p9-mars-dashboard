import { Shield, Zap, TrendingUp } from "lucide-react";

const ToolCard = ({
  icon,
  title,
  desc,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}) => (
  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300">
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 ${gradient} rounded-2xl flex items-center justify-center mb-5 sm:mb-6`}
    >
      {icon}
    </div>
    <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{desc}</p>
  </div>
);

const ToolsSection = () => (
  <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 text-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-14 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Advanced Mission Control
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Comprehensive tools for monitoring, analyzing, and managing Mars
          exploration missions with real-time data visualization.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <ToolCard
          title="Real-Time Analytics"
          desc="Advanced data processing and visualization of telemetry streams from multiple Mars missions simultaneously."
          icon={<TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="bg-gradient-to-r from-orange-500 to-red-600"
        />
        <ToolCard
          title="Mission Security"
          desc="Enterprise-grade security protocols ensuring safe and reliable communication with Mars-based assets."
          icon={<Shield className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="bg-gradient-to-r from-blue-500 to-purple-600"
        />
        <ToolCard
          title="Instant Alerts"
          desc="Automated monitoring systems with intelligent alerting for critical mission events and anomalies."
          icon={<Zap className="w-6 h-6 sm:w-8 sm:h-8" />}
          gradient="bg-gradient-to-r from-green-500 to-cyan-600"
        />
      </div>
    </div>
  </section>
);

export default ToolsSection;
