import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

async function runChat(prompt) {
  try {
    if (!API_KEY) {
      throw new Error("API key is missing. Please check your environment variables.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.75,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = await model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log("Response: ", response);
    return response.text();
  } catch (error) {
    console.error("Error in runChat function: ", error);
    throw error;
  }
}

export default runChat;
