import React, { useState } from 'react';
import { PROGRAMMES, YEARS } from './constants';
import { checkEligibility } from './services/scholarshipService';
import { analyzeEssay } from './services/geminiService';
import { UserProfile, EligibilityResult, EssayAnalysis } from './types';
import { InputSlider } from './components/InputSlider';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ScoreBar } from './components/ScoreBar';

const App: React.FC = () => {
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

  // --- State for Essay Checker ---
  const [essayPrompt, setEssayPrompt] = useState("Why do you deserve this scholarship?");
  const [essayText, setEssayText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim() || !essayPrompt.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysis(null);

    try {
      const result = await analyzeEssay(essayText, essayPrompt);
      setAnalysis(result);
    } catch (err) {
      setAnalysisError("Failed to analyze essay. Please check your text and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const eligibleResults = results.filter(r => r.isEligible);
  const ineligibleResults = results.filter(r => !r.isEligible);

  return (
    <div className="min-h-screen p-4 md:p-8 selection:bg-teal-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 text-center relative z-10">
        <div className="inline-block p-2 px-4 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md mb-4 animate-fade-in">
           <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">University Technology Petronas</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200 tracking-tight mb-4 drop-shadow-lg animate-slide-up">
          Scholarship Eligibility
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          Check your eligibility instantly and polish your scholarship essay with Hybrid AI + NLP.
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-4 space-y-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
            {/* Decorative gradient blob inside card */}
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
              {/* CGPA Slider */}
              <InputSlider 
                label="CGPA" 
                value={profile.cgpa} 
                min={0.0} max={4.0} step={0.01} 
                formatValue={(v) => v.toFixed(2)}
                onChange={(v) => handleProfileChange('cgpa', v)} 
              />

              {/* Income Input */}
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
                {/* Programme Select */}
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

                {/* Year Select */}
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

              {/* Co-Cu Slider */}
              <InputSlider 
                label="Co-Curricular Score" 
                value={profile.cocu} 
                min={0} max={10} 
                onChange={(v) => handleProfileChange('cocu', v)} 
              />

              {/* Malaysian Checkbox */}
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

        {/* RIGHT COLUMN: Results & Essay */}
        <div className="lg:col-span-8 space-y-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
          
          {/* Eligibility Results Section */}
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

          {/* Essay Checker Section */}
          <section className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
             {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    AI Essay Evaluator
                  </h2>
                  <p className="text-purple-300/70 text-sm mt-1 ml-11">Powered by Gemini AI + Hybrid NLP</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 tracking-wide">Essay Prompt</label>
                  <input 
                    type="text"
                    value={essayPrompt}
                    onChange={(e) => setEssayPrompt(e.target.value)}
                    placeholder="e.g., Why do you deserve this scholarship?"
                    className="w-full bg-slate-950/50 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700 focus:border-purple-500/50 placeholder-slate-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2 tracking-wide">Your Essay</label>
                  <div className="relative">
                    <textarea 
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      placeholder="Paste your essay here..."
                      className="w-full h-64 bg-slate-950/50 text-slate-200 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700 focus:border-purple-500/50 resize-y leading-relaxed placeholder-slate-600"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
                      {essayText.split(/\s+/).filter(w => w.length > 0).length} words
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAnalyzeEssay}
                    disabled={isAnalyzing || !essayText}
                    className={`
                      px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center space-x-2 transition-all duration-300
                      ${isAnalyzing || !essayText 
                        ? 'bg-slate-700 cursor-not-allowed opacity-50 text-slate-400' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-900/30 hover:-translate-y-0.5'}
                    `}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span>Analyze Essay</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {analysisError && (
                  <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-lg text-sm animate-fade-in">
                    {analysisError}
                  </div>
                )}

                {/* Analysis Results */}
                {analysis && (
                  <div className="mt-8 animate-slide-up">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="col-span-1 md:col-span-2 mb-2">
                         <h3 className="text-lg font-bold text-white mb-4">Scoring Breakdown</h3>
                         <ScoreBar 
                           score={analysis.overallScore} 
                           label="Overall Quality" 
                           colorClass={analysis.overallScore > 80 ? "bg-teal-400" : analysis.overallScore > 60 ? "bg-yellow-400" : "bg-red-400"} 
                         />
                      </div>
                      
                      <ScoreBar score={analysis.relevanceScore} label="Semantic Relevance (AI)" colorClass="bg-blue-400" />
                      <ScoreBar score={analysis.vocabularyScore} label="Vocabulary Stats (NLP)" colorClass="bg-purple-400" />
                      <ScoreBar score={analysis.sentimentScore} label="Sentiment Confidence (AI)" colorClass="bg-pink-400" />
                    </div>

                    <div className="bg-slate-950/40 rounded-2xl p-6 border border-slate-800">
                      <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Detailed Report</h3>
                      <div className="space-y-6">
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Detected Tone</span>
                          <span className="px-3 py-1 rounded-full bg-slate-800 text-purple-300 text-sm font-medium capitalize border border-slate-700">
                            {analysis.tone}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs uppercase tracking-wider text-green-400 font-bold">Strengths</span>
                              </div>
                              <ul className="space-y-3">
                                {analysis.strengths.map((s, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs uppercase tracking-wider text-yellow-400 font-bold">Improvements</span>
                              </div>
                              <ul className="space-y-3">
                                {analysis.improvements.map((s, i) => (
                                  <li key={i} className="text-sm text-slate-300 flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                                    <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    {s}
                                  </li>
                                ))}
                              </ul>
                           </div>
                        </div>

                        <div className="border-t border-slate-800 pt-5 mt-2">
                           <span className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 block">AI Feedback</span>
                           <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                             <ul className="space-y-2">
                                {analysis.feedback.map((f, i) => (
                                  <li key={i} className="text-sm text-slate-400 italic">"{f}"</li>
                                ))}
                             </ul>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;