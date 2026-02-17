
import { GoogleGenAI, Type } from "@google/genai";
import { QuizModule, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAssessment = async (module: QuizModule): Promise<Question[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a list of 5 high-quality multiple-choice questions for an AI proficiency assessment in the domain of ${module}. 
    Ensure the questions vary in difficulty. Provide a detailed context/explanation for each correct answer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            text: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["id", "text"]
              }
            },
            correctOptionId: { type: Type.STRING },
            explanation: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["id", "text", "options", "correctOptionId", "explanation", "category"]
        }
      }
    }
  });

  try {
    const questions = JSON.parse(response.text);
    return questions;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not generate assessment questions.");
  }
};

export const generateQualitativeAnalysis = async (
  module: QuizModule,
  score: number,
  total: number
): Promise<string> => {
  const percentage = (score / total) * 100;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a professional, encouraging, and detailed one-paragraph qualitative analysis for a student who scored ${score}/${total} (${percentage}%) in a ${module} proficiency assessment. 
    Use a sophisticated yet accessible tone suitable for a high-end educational platform like 'Clean Focus'.`,
  });

  return response.text.trim();
};
