import React from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
}

export const InputSlider: React.FC<InputSliderProps> = ({ 
  label, value, min, max, step = 1, onChange, formatValue 
}) => {
  // Calculate percentage for gradient background of slider
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-end mb-3">
        <label className="text-sm font-medium text-slate-300 tracking-wide">{label}</label>
        <span className="text-lg font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-md border border-teal-400/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <div className="relative w-full h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
        />
        {/* Custom Track */}
        <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {/* Custom Thumb (Visual Only, follows percentage) */}
        <div 
          className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-teal-500 z-10 pointer-events-none transition-all duration-150 ease-out"
          style={{ 
            left: `calc(${percentage}% - 10px)` 
          }}
        ></div>
      </div>
    </div>
  );
};