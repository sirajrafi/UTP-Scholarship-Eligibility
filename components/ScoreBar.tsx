import React from 'react';

interface ScoreBarProps {
  score: number;
  label: string;
  colorClass?: string;
  bgClass?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ 
  score, 
  label, 
  colorClass = "bg-teal-400",
  bgClass = "bg-slate-800" 
}) => {
  // Extract text color from bg class roughly (assuming tailwind convention) for the percentage text
  const textColor = colorClass.replace('bg-', 'text-');

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-slate-300 tracking-wide">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{Math.round(score)}%</span>
      </div>
      <div className={`w-full h-4 ${bgClass} rounded-full overflow-hidden relative`}>
        {/* Grid lines for bar chart feel */}
        <div className="absolute inset-0 w-full h-full z-10 flex justify-between px-[20%] opacity-10 pointer-events-none">
            <div className="h-full w-px bg-white"></div>
            <div className="h-full w-px bg-white"></div>
            <div className="h-full w-px bg-white"></div>
            <div className="h-full w-px bg-white"></div>
        </div>
        
        {/* Animated Bar */}
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out relative z-0 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
          style={{ width: `${score}%` }}
        >
            {/* Shine effect on bar */}
            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};