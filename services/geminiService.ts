import { GoogleGenAI, Type } from "@google/genai";
import { EssayAnalysis } from '../types';
import { calculateVocabularyStats } from './nlpService';

export const analyzeEssay = async (essay: string, prompt: string): Promise<EssayAnalysis> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // 1. Run Local NLP for Statistical Precision (Vocabulary/Structure)
    const statsVocabScore = calculateVocabularyStats(essay);

    // 2. Run Gemini AI for Semantic Understanding (Relevance, Context, Sentiment)
    const systemInstruction = `
      You are an expert scholarship essay evaluator.
      Your goal is to evaluate student essays based on Relevance, Tone, and Quality.
      
      You must return a strictly formatted JSON object.
      
      Tasks:
      1. Check if the essay ACTUALLY answers the prompt. If it is gibberish or unrelated, give a very low Relevance score (< 20).
      2. Analyze the sentiment: Is it confident/optimistic?
      3. Provide constructive feedback.
      
      Input:
      Prompt: "${prompt}"
      Essay: "${essay}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Analyze this essay.",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiRelevanceScore: { type: Type.NUMBER, description: "0-100 score based on how well it answers the specific prompt." },
            aiSentimentScore: { type: Type.NUMBER, description: "0-100 score on confidence and positivity." },
            tone: { type: Type.STRING, description: "1-2 words describing the tone." },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["aiRelevanceScore", "aiSentimentScore", "tone", "feedback", "strengths", "improvements"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    const aiResult = JSON.parse(resultText);

    // 3. Hybrid Merging
    // Vocabulary: Average of AI's qualitative feel (implied) and NLP's statistical count. 
    // Since AI didn't return vocab score specifically to save tokens/complexity, we rely heavily on NLP stats here, 
    // but we can adjust it based on relevance (if relevance is 0, vocab doesn't matter much).
    
    let finalVocabScore = statsVocabScore;
    
    // Safety check: If AI says it's irrelevant gibberish, cap the vocab score.
    if (aiResult.aiRelevanceScore < 30) {
      finalVocabScore = Math.min(finalVocabScore, 40);
    }

    // Weighted Overall Score
    // Relevance (40%), Vocab (30%), Sentiment (30%)
    const overallScore = Math.round(
      (aiResult.aiRelevanceScore * 0.45) + 
      (finalVocabScore * 0.25) + 
      (aiResult.aiSentimentScore * 0.30)
    );

    return {
      overallScore: overallScore,
      relevanceScore: aiResult.aiRelevanceScore,
      vocabularyScore: finalVocabScore,
      sentimentScore: aiResult.aiSentimentScore,
      tone: aiResult.tone,
      feedback: aiResult.feedback,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements
    };

  } catch (error) {
    console.error("Error analyzing essay:", error);
    // Fallback or re-throw
    throw new Error("AI Service Unavailable. Please check your connection or API Key.");
  }
};