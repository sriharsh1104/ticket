
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const extractJson = (text: string) => {
  try {
    // Attempt to find JSON block if model wraps it in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI JSON:", e);
    return null;
  }
};

export const generateTaskDetails = async (prompt: string, type: string, projectKey: string) => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. AI features disabled.");
    return null;
  }

  try {
    const systemInstruction = `You are a professional Jira ticket generator. You only output valid JSON.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional Jira issue in JSON for project ${projectKey}.
      Type: ${type}
      Idea: ${prompt}
      
      Requirements:
      - summary: brief title
      - description: detailed markdown description
      - priority: one of (Highest, High, Medium, Low, Lowest)
      - If Bug: include stepsToReproduce
      - If Story: include acceptanceCriteria`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { type: Type.STRING },
            acceptanceCriteria: { type: Type.STRING },
            stepsToReproduce: { type: Type.STRING }
          },
          required: ["summary", "description", "priority"]
        },
        temperature: 0.1,
      }
    });
    
    return extractJson(response.text);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};

export const summarizeTask = async (taskData: any) => {
  if (!process.env.API_KEY) return "AI Summary unavailable.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this Jira ticket as a professional status update: ${JSON.stringify(taskData)}`,
      config: { temperature: 0 }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "Could not generate summary.";
  }
};
