import React, { useState } from 'react';
import { PROGRAMMES, YEARS } from './constants';
import { checkEligibility } from './services/scholarshipService';
import { UserProfile, EligibilityResult } from './types';
import { InputSlider } from './components/InputSlider';
import { ScholarshipCard } from './components/ScholarshipCard';
import { Navbar } from './components/Navbar';
import { EssayEvaluator } from './components/EssayEvaluator';
import { CoCuCalculator } from './components/CoCuCalculator';

const App: React.FC = () => {
  // --- Navigation State ---
  const [activeView, setActiveView] = useState<'home' | 'essay' | 'calculator'>('home');

  // --- State for Eligibility ---
  const [profile, setProfile] = useState<UserProfile>({
    cgpa: 3.50,
    income: 3000,
    programme: PROGRAMMES[0],
    year: YEARS[0],
    cocu: 7,
    isMalaysian: true,
  });

  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // --- Handlers ---
  const handleProfileChange = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckEligibility = () => {
    setIsChecking(true);
    // Simulate a brief calculation delay for UX feel
    setTimeout(() => {
      const newResults = checkEligibility(profile);
      // Sort: Eligible first (by matchScore desc), then Ineligible
      newResults.sort((a, b) => {
        if (a.isEligible && !b.isEligible) return -1;
        if (!a.isEligible && b.isEligible) return 1;
        return b.matchScore - a.matchScore;
      });
      
      setResults(newResults);
      setHasSearched(true);
      setIsChecking(false);
    }, 500);
  };

  const eligibleResults = results.filter(r => r.isEligible);
  const ineligibleResults = results.filter(r => !r.isEligible);

  return (
    <div className="min-h-screen p-4 md:p-8 selection:bg-teal-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 text-center relative z-10">
        <div className="inline-block p-2 px-4 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-4 animate-fade-in">
           <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">University Technology Petronas</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200 tracking-tight mb-4 drop-shadow-lg animate-slide-up">
          Scholarship Eligibility
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          Check your eligibility, calculate your merit points, and perfect your essay.
        </p>
      </header>

      {/* Navigation */}
      <Navbar activeView={activeView} onChangeView={setActiveView} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto relative z-10">
        
        {/* VIEW 1: HOME / ELIGIBILITY CHECK */}
        {activeView === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
            
            {/* LEFT COLUMN: Input Form */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700"></div>
                
                <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Your Profile
                </h2>

                <div className="space-y-6">
                  <InputSlider 
                    label="CGPA" 
                    value={profile.cgpa} 
                    min={0.0} max={4.0} step={0.01} 
                    formatValue={(v) => v.toFixed(2)}
                    onChange={(v) => handleProfileChange('cgpa', v)} 
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2 tracking-wide">Household Income (RM)</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">RM</span>
                       <input 
                        type="number" 
                        value={profile.income}
                        onChange={(e) => handleProfileChange('income', Number(e.target.value))}
                        className="w-full bg-slate-800/50 text-white rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 border border-slate-700 focus:border-teal-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 tracking-wide">Programme</label>
                      <div className="relative">
                        <select 
                          value={profile.programme}
                          onChange={(e) => handleProfileChange('programme', e.target.value)}
                          className="w-full bg-slate-800/50 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 border border-slate-700 appearance-none cursor-pointer text-sm"
                        >
                          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2 tracking-wide">Year</label>
                      <div className="relative">
                        <select 
                          value={profile.year}
                          onChange={(e) => handleProfileChange('year', e.target.value)}
                          className="w-full bg-slate-800/50 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/50 border border-slate-700 appearance-none cursor-pointer text-sm"
                        >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex justify-end mb-1">
                       <button 
                         onClick={() => setActiveView('calculator')}
                         className="text-xs text-teal-400 hover:text-teal-300 font-medium underline decoration-dotted flex items-center gap-1"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0 1 1 0 002 0zm2-4a1 1 0 110-2 1 1 0 010 2zm-2-4a1 1 0 10-2 0 1 1 0 002 0zm-2 8a1 1 0 100-2 1 1 0 000 2zm6 4a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
                         </svg>
                         Open Calculator
                       </button>
                    </div>
                    <InputSlider 
                      label="Co-Curricular Score" 
                      value={profile.cocu} 
                      min={0} max={10} 
                      onChange={(v) => handleProfileChange('cocu', v)} 
                    />
                  </div>

                  <label className="flex items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={profile.isMalaysian}
                        onChange={(e) => handleProfileChange('isMalaysian', e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-500 bg-slate-800/50 checked:border-teal-500 checked:bg-teal-500 transition-all"
                      />
                       <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-slate-300">
                      I am a Malaysian Citizen
                    </span>
                  </label>

                  <button 
                    onClick={handleCheckEligibility}
                    disabled={isChecking}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/20 transform active:scale-95 transition-all duration-200 flex justify-center items-center group"
                  >
                    {isChecking ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        Check Eligibility
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Results */}
            <div className="lg:col-span-8">
              <section className="min-h-[300px]">
                {!hasSearched ? (
                  <div className="h-full bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center p-10">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-300">Waiting for Input</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">Fill in your details on the left and click "Check Eligibility" to see which scholarships match your profile.</p>
                  </div>
                ) : (
                  <div className="animate-fade-in space-y-8">
                    
                    {/* Eligible List */}
                    {eligibleResults.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="h-px flex-1 bg-slate-800"></div>
                           <h2 className="text-xl font-bold text-teal-400 uppercase tracking-widest">Eligible Scholarships</h2>
                           <div className="h-px flex-1 bg-slate-800"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {eligibleResults.map((result) => (
                            <ScholarshipCard key={result.scholarship.id} result={result} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ineligible List */}
                    {ineligibleResults.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4 mt-2">
                           <div className="h-px flex-1 bg-slate-800"></div>
                           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Not Eligible</h2>
                           <div className="h-px flex-1 bg-slate-800"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 opacity-80">
                          {ineligibleResults.map((result) => (
                            <ScholarshipCard key={result.scholarship.id} result={result} />
                          ))}
                        </div>
                      </div>
                    )}

                    {results.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No scholarships found.
                        </div>
                    )}

                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* VIEW 2: ESSAY EVALUATOR */}
        {activeView === 'essay' && (
          <EssayEvaluator />
        )}

        {/* VIEW 3: CO-CU CALCULATOR */}
        {activeView === 'calculator' && (
          <CoCuCalculator 
            currentScore={profile.cocu}
            onApplyScore={(score) => {
              handleProfileChange('cocu', score);
              setActiveView('home'); // Go back to profile after applying
            }}
          />
        )}

      </main>
    </div>
  );
};

export default App;