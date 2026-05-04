import React from "react";
import { LucideIcon } from "lucide-react";

interface MilestoneItemProps {
  title: string;
  description: string;
  progress: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  currentInfo?: string;
  isPending?: boolean;
}

export default function MilestoneItem({ title, description, progress, icon: Icon, iconBg, iconColor, currentInfo, isPending }: MilestoneItemProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
      <div className={`p-4 rounded-xl ${iconBg}`}>
        <Icon size={24} className={iconColor} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 font-medium">{description}</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {isPending ? 'Pending' : currentInfo || `${progress}% Done`}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isPending ? 'bg-gray-200' : 'bg-indigo-600'}`}
            style={{ width: `${isPending ? 0 : progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
