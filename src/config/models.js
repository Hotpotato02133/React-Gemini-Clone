// Multi-model configuration for ScholarAI
// Supporting various free and accessible AI models

export const AI_MODELS = {
  GEMINI: {
    id: 'gemini',
    name: 'Gemini 1.5 Pro',
    description: 'Advanced reasoning and long context',
    provider: 'Google',
    free: true,
    features: ['text', 'image', 'code'],
    icon: '🔷',
  },
  GEMINI_FLASH: {
    id: 'gemini-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast responses with good quality',
    provider: 'Google',
    free: true,
    features: ['text', 'code'],
    icon: '⚡',
  },
  GROQ_LLAMA: {
    id: 'groq-llama',
    name: 'Llama 3.3 70B (Groq)',
    description: 'Ultra-fast inference via Groq',
    provider: 'Groq',
    free: true,
    features: ['text', 'code'],
    icon: '🦙',
  },
  GROQ_MIXTRAL: {
    id: 'groq-mixtral',
    name: 'Mixtral 8x7B (Groq)',
    description: 'Efficient mixture of experts',
    provider: 'Groq',
    free: true,
    features: ['text', 'code'],
    icon: '🎯',
  },
  HUGGINGFACE: {
    id: 'huggingface',
    name: 'Mistral 7B (HuggingFace)',
    description: 'Fast open-source model',
    provider: 'HuggingFace',
    free: true,
    features: ['text'],
    icon: '🤗',
  },
};

export const DEFAULT_MODEL = AI_MODELS.GEMINI;

// API endpoints configuration
export const API_CONFIG = {
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com',
    modelName: 'gemini-1.5-pro',
  },
  'gemini-flash': {
    baseUrl: 'https://generativelanguage.googleapis.com',
    modelName: 'gemini-1.5-flash',
  },
  'groq-llama': {
    baseUrl: 'https://api.groq.com/openai/v1',
    modelName: 'llama-3.3-70b-versatile',
  },
  'groq-mixtral': {
    baseUrl: 'https://api.groq.com/openai/v1',
    modelName: 'mixtral-8x7b-32768',
  },
  huggingface: {
    baseUrl: 'https://api-inference.huggingface.co',
    modelName: 'mistralai/Mistral-7B-Instruct-v0.2',
  },
};

// Model-specific generation configs
export const GENERATION_CONFIGS = {
  default: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  creative: {
    temperature: 1.0,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  },
  precise: {
    temperature: 0.3,
    topK: 20,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
};
