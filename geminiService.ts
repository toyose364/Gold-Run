import { GoogleGenAI } from "@google/genai";
import { UserData, InvestmentPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateInvestmentAdvice = async (
  query: string, 
  userContext?: UserData,
  marketContext?: InvestmentPlan[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your configuration.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a context-aware prompt
    let systemInstruction = `You are an expert financial advisor for Lumina Invest, a simulation platform. 
    Your goal is to educate users on financial literacy, analyze their (simulated) portfolio, and explain investment concepts.
    Keep answers concise, professional, yet encouraging.
    The currency used is Nigerian Naira (₦).
    If the user asks for financial advice, always include a disclaimer that this is a simulation and not real financial advice.
    `;

    if (userContext) {
      systemInstruction += `\nUser Context: Balance ₦${userContext.balance}, Total Invested ₦${userContext.totalInvested}.`;
    }
    
    if (marketContext) {
      const plans = marketContext.map(p => `${p.name} (${p.category}, ${p.roi}% ROI)`).join(', ');
      systemInstruction += `\nAvailable Market Plans: ${plans}.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the market data right now. Please try again later.";
  }
};