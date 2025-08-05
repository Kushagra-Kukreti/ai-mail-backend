// groqClient.js
import 'dotenv/config';
import Groq from "groq-sdk";

// Create Groq client with API key from environment
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
