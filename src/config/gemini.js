import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function runChat(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error in runChat:', error);
    return 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';
  }
}

export default runChat;
