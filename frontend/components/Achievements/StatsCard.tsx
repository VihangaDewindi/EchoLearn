import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatsCard({ label, value, unit, icon: Icon, iconBg, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1">
      <div className={`p-3 rounded-xl ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value} {unit && <span className="text-lg font-semibold text-gray-600">{unit}</span>}
        </p>
      </div>
    </div>
  );
}
