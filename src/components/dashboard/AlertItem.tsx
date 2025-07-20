"use client";

import { FC } from "react";
import { AlertTriangle, CheckCircle, Radio } from "lucide-react";

export type AlertType = "info" | "warning" | "error" | "success";

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  time: string;
}

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: FC<AlertItemProps> = ({ alert }) => {
  const getColors = (type: AlertType) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-900/20",
          border: "border-yellow-500",
          iconBg: "bg-yellow-500",
          icon: <AlertTriangle className="w-3 h-3 text-white" />,
        };
      case "error":
        return {
          bg: "bg-red-900/20",
          border: "border-red-500",
          iconBg: "bg-red-500",
          icon: <AlertTriangle className="w-3 h-3 text-white" />,
        };
      case "success":
        return {
          bg: "bg-green-900/20",
          border: "border-green-500",
          iconBg: "bg-green-500",
          icon: <CheckCircle className="w-3 h-3 text-white" />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-900/20",
          border: "border-blue-500",
          iconBg: "bg-blue-500",
          icon: <Radio className="w-3 h-3 text-white" />,
        };
    }
  };

  const { bg, border, iconBg, icon } = getColors(alert.type);

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-lg border-l-4 ${bg} ${border} w-full`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">{alert.message}</p>
        <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
      </div>
    </div>
  );
};

export default AlertItem;
