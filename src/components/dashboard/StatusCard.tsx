import { LucideIcon } from "lucide-react";

type StatusCardProps = {
  title: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  status?: "critical" | "warning" | "good" | "normal";
  change?: number;
};

const StatusCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  change,
}: StatusCardProps) => {
  const statusColor =
    status === "critical"
      ? "text-red-400"
      : status === "warning"
      ? "text-yellow-400"
      : status === "good"
      ? "text-green-400"
      : "text-blue-400";

  const changeBadge =
    typeof change === "number" ? (
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          change > 0
            ? "bg-green-900/50 text-green-400"
            : "bg-red-900/50 text-red-400"
        }`}
      >
        {change > 0 ? "+" : ""}
        {change}%
      </span>
    ) : null;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-300 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${statusColor}`} />
          <span className="text-slate-300 text-sm font-medium">{title}</span>
        </div>
        {changeBadge}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-slate-400 text-sm">{unit}</span>}
      </div>
    </div>
  );
};

export default StatusCard;
