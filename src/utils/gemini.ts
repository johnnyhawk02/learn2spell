import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Gemini API with your API key
// IMPORTANT: In production, use environment variables and proper key management
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Safety settings to filter out harmful content
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

/**
 * Generate text using Gemini Pro model
 * @param prompt The text prompt to send to Gemini
 * @returns The generated text response
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    throw error;
  }
}

/**
 * Generate text with image input using Gemini Pro Vision model
 * @param prompt The text prompt to send to Gemini
 * @param imageUrl The URL of the image to analyze
 * @returns The generated text response
 */
export async function generateTextFromImage(prompt: string, imageData: string): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    // For multimodal input (text + image), use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: imageData, mimeType: 'image/jpeg' } }
          ]
        }
      ],
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text from image with Gemini:', error);
    throw error;
  }
}

/**
 * Create a chat session with Gemini
 * @returns A chat session object
 */
export function createChatSession() {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    // Using gemini-pro for chat sessions
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    return model.startChat({
      safetySettings,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });
  } catch (error) {
    console.error('Error creating chat session with Gemini:', error);
    throw error;
  }
}

/**
 * Make a direct API call to Gemini without using the SDK
 * This is useful for more granular control or when you need features not available in the SDK
 * @param endpoint The Gemini API endpoint (e.g., 'generateContent', 'countTokens')
 * @param model The model name (e.g., 'gemini-2.0-flash', 'gemini-2.0-pro-vision')
 * @param payload The request payload
 * @returns The API response
 */
export async function rawGeminiApiCall(
  endpoint: string,
  model: string,
  payload: Record<string, any>
): Promise<any> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error making raw Gemini API call:', error);
    throw error;
  }
}

/**
 * List all available Gemini models
 * This is useful for debugging and finding the correct model names
 * @returns A promise that resolves to a list of available models
 */
export async function listGeminiModels(): Promise<any> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment variables.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing Gemini models:', error);
    throw error;
  }
} 