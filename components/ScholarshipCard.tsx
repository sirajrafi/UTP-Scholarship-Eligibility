
import React, { useState } from 'react';
import { EligibilityResult } from '../types';

interface ScholarshipCardProps {
  result: EligibilityResult;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  const { scholarship, isEligible, reasons, matchScore } = result;

  if (!isEligible) {
    // --- INELIGIBLE CARD STYLE ---
    return (
      <div className="relative p-5 rounded-2xl border border-slate-800 bg-slate-900/30 opacity-80 hover:opacity-100 transition-all duration-300 group flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-slate-300 group-hover:text-white transition-colors">
            {scholarship.name}
          </h3>
          <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
            Not Eligible
          </span>
        </div>
        
        <div className="flex gap-3 text-xs text-slate-500 mb-4">
           <span>Min CGPA: {scholarship.minCgpa}</span>
           <span>•</span>
           <span>Min Co-Cu: {scholarship.minCocu}</span>
        </div>

        <div className="bg-red-950/20 rounded-lg border border-red-900/20 p-3 mb-4 flex-grow">
          <div className="text-xs text-red-300 font-medium mb-2 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
             Missing Requirements:
          </div>
          <ul className="space-y-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="text-[11px] text-red-200/60 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <a 
          href={scholarship.applicationLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-slate-500 hover:text-slate-300 underline text-center block w-full py-1"
        >
          Visit Official Website
        </a>
      </div>
    );
  }

  // --- ELIGIBLE CARD STYLE ---
  // Determine strength color
  let barColor = "bg-teal-400";
  let textColor = "text-teal-400";
  
  if (matchScore >= 90) {
    barColor = "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]";
    textColor = "text-emerald-400";
  } else if (matchScore >= 75) {
    barColor = "bg-teal-400";
    textColor = "text-teal-400";
  } else {
    barColor = "bg-blue-400";
    textColor = "text-blue-400";
  }

  return (
    <div className="relative p-6 rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/10 to-slate-900/50 hover:border-teal-500/40 hover:shadow-lg transition-all duration-300 animate-slide-up group flex flex-col h-full">
      
      <div className="absolute -top-3 -right-3 bg-teal-500 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-teal-500/20">
        ELIGIBLE
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-xl text-white mb-1 group-hover:text-teal-200 transition-colors">
            {scholarship.name}
          </h3>
          <div className="flex gap-3 text-xs text-slate-400">
             <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">CGPA {scholarship.minCgpa}+</span>
             {scholarship.maxIncome && (
               <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Inc &lt; RM{scholarship.maxIncome}</span>
             )}
          </div>
        </div>
      </div>

      {/* Strength Bar */}
      <div className="mb-6 flex-grow">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Strength</span>
          <span className={`text-sm font-bold ${textColor}`}>{matchScore}/100</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
            style={{ width: `${matchScore}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500">
          You meet all the criteria for this scholarship.
        </p>
      </div>

      <a 
        href={scholarship.applicationLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-auto w-full py-3 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:scale-[1.02] transition-all duration-300 group/btn"
      >
        <span>Apply Now</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

    </div>
  );
};
