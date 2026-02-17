
import { GoogleGenAI } from "@google/genai";
import { QuizModule, Question } from "../types";

// Initialize the Gemini API client
// Always use the direct reference to process.env.API_KEY as per SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let cachedQuestions: Record<string, Question[]> | null = null;

/**
 * Fetches assessment questions from the local configuration file.
 * Shuffles questions to ensure a fresh experience on every restart.
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
    
    // Return a shuffled copy to ensure variety on Restart
    return [...questions].sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    throw error;
  }
};

/**
 * Uses Gemini (Flash) to generate a qualitative review based on the student's score.
 */
export const generateQualitativeAnalysis = async (
  module: QuizModule,
  score: number,
  total: number
): Promise<string> => {
  const percentage = (score / total) * 100;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a professional, encouraging, and detailed one-paragraph qualitative analysis for a student who scored ${score}/${total} (${percentage}%) in a ${module} proficiency assessment. 
      Focus on what this score indicates about their current proficiency level and potential next steps.`,
    });

    return response.text.trim();
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Great effort on completing the assessment! Your dedication to mastering these complex AI topics is evident. Continue practicing and exploring the advanced documentation to further solidify your expertise.";
  }
};
