import React from 'react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  colorClass: string; // e.g. bg-emerald-50 text-emerald-800 ...
  id: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendDirection = 'neutral',
  colorClass,
  id
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-6 bg-white shadow-xs border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 font-sans">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold font-display mt-2 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-500 font-sans block truncate max-w-[180px]">
          {description}
        </span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendDirection === 'up' 
              ? 'bg-emerald-50 text-emerald-700' 
              : trendDirection === 'down' 
              ? 'bg-rose-50 text-rose-700' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
