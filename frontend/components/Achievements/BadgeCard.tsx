import React from "react";
import { Lock, LucideIcon } from "lucide-react";

interface BadgeCardProps {
  name: string;
  earnedDate?: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  isLocked?: boolean;
}

export default function BadgeCard({ name, earnedDate, icon: Icon, bgColor, iconColor, isLocked }: BadgeCardProps) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${isLocked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 hover:shadow-md'}`}>
      <div className={`w-32 h-40 rounded-lg ${isLocked ? 'bg-gray-100' : bgColor} flex items-center justify-center mb-2`}>
        {isLocked ? (
          <Lock size={32} className="text-gray-300" />
        ) : (
          <Icon size={48} className={iconColor} />
        )}
      </div>
      <div className="text-center">
        <h3 className={`text-sm font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{name}</h3>
        <p className="text-xs text-gray-500">{isLocked ? 'Locked' : `Earned ${earnedDate}`}</p>
      </div>
    </div>
  );
}
