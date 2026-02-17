
import { GoogleGenAI } from "@google/genai";
import { QuizModule, Question } from "../types";

// Initialize with the exact SDK requirement
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let cachedQuestions: Record<string, Question[]> | null = null;

/**
 * Fetches assessment questions from the local configuration file.
 * Implements a simple cache to avoid redundant network requests.
 */
export const getAssessment = async (module: QuizModule): Promise<Question[]> => {
  try {
    if (!cachedQuestions) {
      const response = await fetch('./questions.json');
      if (!response.ok) throw new Error("Failed to load questions data.");
      cachedQuestions = await response.json();
    }
    
    const questions = cachedQuestions ? cachedQuestions[module] : [];
    
    if (!questions || questions.length === 0) {
      throw new Error(`No questions found for module: ${module}`);
    }
    
    // Shuffle questions to provide variety each time and return a new array reference
    return [...questions].sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw error;
  }
};

/**
 * Uses Gemini to generate a qualitative review of the user's performance.
 */
export const generateQualitativeAnalysis = async (
  module: QuizModule,
  score: number,
  total: number
): Promise<string> => {
  const percentage = (score / total) * 100;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a professional, encouraging, and detailed one-paragraph qualitative analysis for a student who scored ${score}/${total} (${percentage}%) in a ${module} proficiency assessment. 
    Focus on what this score indicates about their proficiency level. Use a sophisticated yet accessible tone suitable for a high-end educational platform like 'Clean Focus'.`,
  });

  return response.text.trim();
};
