import { EssayAnalysis } from '../types';

// ==========================================
// 1. CONSTANTS & DICTIONARIES
// ==========================================

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 
  'will', 'with', 'i', 'my', 'me', 'am', 'this', 'but', 'or', 'so', 'if'
]);

const ACADEMIC_WORDS = new Set([
  'analyze', 'analysis', 'approach', 'assessment', 'assume', 'authority', 
  'available', 'benefit', 'concept', 'consistent', 'constitutional', 'context', 
  'contract', 'create', 'data', 'definition', 'derived', 'distribution', 
  'economic', 'environment', 'established', 'estimate', 'evidence', 'factors', 
  'financial', 'formula', 'function', 'identified', 'income', 'indicate', 
  'individual', 'interpretation', 'involved', 'issues', 'labour', 'legal', 
  'legislation', 'major', 'method', 'occur', 'percent', 'period', 'policy', 
  'principle', 'procedure', 'process', 'required', 'research', 'response', 
  'role', 'section', 'sector', 'significant', 'similar', 'source', 'specific', 
  'structure', 'theory', 'variables'
]);

// ==========================================
// 2. HELPER FUNCTIONS (Exported)
// ==========================================

export const cleanText = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
};

export const getTokens = (text: string, removeStopWords = true): string[] => {
  const words = cleanText(text).split(' ');
  if (removeStopWords) {
    return words.filter(w => !STOP_WORDS.has(w) && w.length > 1);
  }
  return words;
};

// ==========================================
// 3. STATISTICAL METRICS (Exported)
// ==========================================

export const calculateVocabularyStats = (essay: string): number => {
  const tokens = getTokens(essay, false); 
  if (tokens.length === 0) return 0;

  const uniqueWords = new Set(tokens);
  
  // Type-Token Ratio (Variety)
  const ttr = uniqueWords.size / tokens.length;
  
  // Complexity (Average word length)
  const totalChars = tokens.reduce((acc, word) => acc + word.length, 0);
  const avgWordLength = totalChars / tokens.length;

  // Academic usage
  let academicCount = 0;
  tokens.forEach(w => {
    if (ACADEMIC_WORDS.has(w) || w.length > 7) academicCount++;
  });
  const academicDensity = academicCount / tokens.length;

  // Weighted Score
  // TTR target: 0.5+, AvgLength target: 5.0+
  const score = (ttr * 40) + (avgWordLength * 8) + (academicDensity * 200);
  
  return Math.min(Math.round(score * 1.2), 100); 
};

// Legacy pure local analysis (optional fallback)
export const analyzeEssayLocal = async (essay: string, prompt: string): Promise<EssayAnalysis> => {
  // Simple Placeholder if ever needed directly
  const vocab = calculateVocabularyStats(essay);
  return {
    overallScore: 75,
    relevanceScore: 70,
    vocabularyScore: vocab,
    sentimentScore: 80,
    tone: "Neutral",
    feedback: ["Local NLP fallback used."],
    strengths: [],
    improvements: []
  };
};