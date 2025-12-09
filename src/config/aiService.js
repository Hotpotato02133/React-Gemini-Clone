// Universal AI Service - handles multiple model providers
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { API_CONFIG } from './models';

// Get API keys from environment
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";

// Gemini-specific function
async function runGeminiChat(prompt, modelId = 'gemini') {
  if (!GEMINI_API_KEY) {
    return "⚠️ Gemini API key not configured. Please add your VITE_GEMINI_API_KEY to .env file. Get one free at https://makersuite.google.com/app/apikey";
  }
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const config = API_CONFIG[modelId];
    const model = genAI.getGenerativeModel({ model: config.modelName });

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
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

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini Error: ${error.message}`);
  }
}

// Groq API function
async function runGroqChat(prompt, modelId) {
  if (!GROQ_API_KEY) {
    return "⚠️ Groq API key not configured. Please add your GROQ_API_KEY to use Llama/Mixtral models. Get one free at https://console.groq.com";
  }

  try {
    const config = API_CONFIG[modelId];
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.modelName,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Groq Error: ${error.message}`);
  }
}

// HuggingFace API function
async function runHuggingFaceChat(prompt) {
  if (!HUGGINGFACE_API_KEY) {
    return "⚠️ HuggingFace API key not configured. Please add your HUGGINGFACE_API_KEY. Get one free at https://huggingface.co/settings/tokens";
  }

  try {
    const config = API_CONFIG['huggingface'];
    const response = await fetch(`${config.baseUrl}/models/${config.modelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].generated_text;
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    throw new Error(`HuggingFace Error: ${error.message}`);
  }
}

// Main AI Service function - routes to appropriate provider
export async function runAIChat(prompt, modelId = 'gemini') {
  try {
    switch (modelId) {
      case 'gemini':
      case 'gemini-flash':
        return await runGeminiChat(prompt, modelId);
      
      case 'groq-llama':
      case 'groq-mixtral':
        return await runGroqChat(prompt, modelId);
      
      case 'huggingface':
        return await runHuggingFaceChat(prompt);
      
      default:
        return await runGeminiChat(prompt, 'gemini');
    }
  } catch (error) {
    console.error('AI Service Error:', error);
    return `❌ Error: ${error.message}\n\nPlease check your API configuration or try a different model.`;
  }
}

export default runAIChat;
