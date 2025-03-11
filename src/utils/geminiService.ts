import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
// In a real application, get this from environment variables
// For demo, we'll use a placeholder that can be replaced before deployment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''; 
// Get model name from environment variables or use default model
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
export const genAI = new GoogleGenerativeAI(API_KEY);

export type GeneratedContent = {
  sentences: string[];
  memoryTips: string[];
  etymology?: string;
}

export type WordDefinition = {
  word: string;
  definition: string;
  difficulty: number;
  rule?: string;
  phonetic?: string; // UK English phonetic breakdown like "kuh ah tuh" for "cat"
}

/**
 * Generate example sentences and memory tips for a spelling word
 * 
 * @param word The word to generate content for
 * @param rule The spelling rule that applies to this word
 * @returns Object containing sentences, tips, and optional etymology
 */
export async function generateSpellingHelp(word: string, rule: string): Promise<GeneratedContent> {
  try {
    // Check if API key is valid for making real calls
    if (!API_KEY) {
      throw new Error("No Gemini API key provided. Set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    // Make a real API call
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      I need help teaching children how to spell the word "${word}".
      This word follows the spelling rule: "${rule}".
      
      Please provide:
      1. Three simple, child-friendly sentences using this word.
      2. Two memory tips to help remember the spelling.
      3. A brief, simple etymology of the word if relevant.
      
      Format your response as JSON with these keys:
      {
        "sentences": ["sentence1", "sentence2", "sentence3"],
        "memoryTips": ["tip1", "tip2"],
        "etymology": "brief etymology if available"
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      return JSON.parse(jsonString) as GeneratedContent;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse Gemini API response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating spelling help with Gemini:', error);
    throw error;
  }
}

/**
 * Generate definitions for multiple words
 * 
 * @param words Array of words to generate definitions for
 * @param rule The spelling rule these words follow
 * @returns Array of word objects with definitions
 */
export async function generateWordDefinitions(
  words: string[], 
  rule: string
): Promise<WordDefinition[]> {
  try {
    // Check if API key is valid for making real calls
    if (!API_KEY) {
      throw new Error("No Gemini API key provided. Set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    // Make a real API call
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      I need child-friendly definitions for the following words that follow the spelling rule: "${rule}".
      Words: ${words.join(', ')}
      
      For each word, provide:
      1. A simple definition suitable for elementary school children (3rd-5th grade level)
      2. A difficulty rating (1 for easier words, 2 for more challenging words)
      
      Format your response as JSON with this structure:
      [
        {
          "word": "word1",
          "definition": "simple definition",
          "difficulty": 1
        },
        // more words...
      ]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      return JSON.parse(jsonString) as WordDefinition[];
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse Gemini API response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating definitions with Gemini:', error);
    throw error;
  }
}

/**
 * Generate a complete learning lesson for a set of words
 * 
 * @param words Array of words that follow a common spelling rule
 * @param rule The spelling rule these words follow
 * @returns A structured lesson with examples and activities
 */
export async function generateLesson(words: string[], rule: string): Promise<string> {
  try {
    // Check if API key is valid for making real calls
    if (!API_KEY) {
      throw new Error("No Gemini API key provided. Set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    // Make a real API call
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      Create a short, engaging lesson for elementary school children about the spelling rule:
      "${rule}"
      
      Use these example words: ${words.join(', ')}
      
      Include:
      1. A child-friendly explanation of the rule
      2. Memory tips for remembering the spelling pattern
      3. A simple activity idea
      
      Format as markdown and keep it brief, positive and encouraging.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating lesson with Gemini:', error);
    throw error;
  }
}

/**
 * Generate definitions and metadata for a list of words
 * Specifically designed for quick word set generation with date in name
 * 
 * @param words Array of words to generate definitions for
 * @returns Array of word objects with definitions, rules, and difficulty
 */
export async function generateDefinitionsForWords(
  words: string[]
): Promise<WordDefinition[]> {
  try {
    // Check if API key is valid for making real calls
    if (!API_KEY) {
      throw new Error("No Gemini API key provided. Set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    // Make a real API call
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      I need child-friendly definitions and UK English phonetic breakdowns for these words: ${words.join(', ')}
      
      For each word, provide:
      1. A simple definition suitable for elementary school children (ages 7-11) in British English.
         IMPORTANT: Do NOT include the word itself in the definition - define it without using the actual word.
      2. A difficulty rating (1 for easier words, 2 for medium, 3 for challenging)
      3. A phonetic breakdown that spells out each sound in the word using UK English pronunciation
         (e.g., "cat" would be "k-a-t" or similar, using UK English sounds)
      4. If the word contains the letter 'y' that makes the short 'i' sound (/I/), note this in the rule field
      
      Use British English spelling conventions and pronunciation in all your responses.
      
      Format your response as JSON with this structure:
      [
        {
          "word": "word1",
          "definition": "simple definition using British English WITHOUT using the word itself",
          "difficulty": 1,
          "phonetic": "British English phonetic breakdown of sounds",
          "rule": "This word has the /I/ sound spelled with 'y'" (only if applicable)
        },
        // more words...
      ]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      return JSON.parse(jsonString) as WordDefinition[];
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse Gemini API response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating definitions with Gemini:', error);
    throw error;
  }
} 