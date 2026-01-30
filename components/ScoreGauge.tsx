import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  colorClass?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, colorClass = "text-teal-400" }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20 flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle
            className="text-slate-700"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className={`absolute text-lg font-bold ${colorClass}`}>{Math.round(score)}%</span>
      </div>
      <span className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
};
