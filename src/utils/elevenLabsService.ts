// Initialize the ElevenLabs API
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

// Verify if API key is available
const hasValidApiKey = () => {
  return !!API_KEY && API_KEY.length > 0 && !API_KEY.includes('your_key_here');
};

// Alice's voice ID - the ONLY voice we'll use
const ALICE_VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";

// Voice settings configuration - ONLY normal speed
const VOICE_SETTINGS = {
  normal: {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0,
    use_speaker_boost: true
  }
};

// Cache for audio to avoid repeated API calls for the same word
const audioCache = new Map<string, string>();

// Types for ElevenLabs API responses
export type ElevenLabsVoice = {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
  labels?: Record<string, string>;
  accent?: string;
  age?: string;
  gender?: string;
  use_case?: string;
  sample_seconds?: number;
}

export type GetVoicesResponse = {
  voices: ElevenLabsVoice[];
}

/**
 * Fetch all available voices from the ElevenLabs API
 * @returns Promise resolving to an array of available voices
 */
export async function getAllVoices(): Promise<ElevenLabsVoice[]> {
  try {
    // Check if API key is valid
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': API_KEY
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    
    const data = await response.json() as GetVoicesResponse;
    return data.voices;
  } catch (error) {
    console.error('Error fetching voices from ElevenLabs:', error);
    throw error;
  }
}

/**
 * Generate speech for a word using Alice's voice at normal speed
 * 
 * @param word The word to generate speech for
 * @returns Promise resolving to the URL of the audio
 */
export async function generateSpeech(word: string): Promise<string> {
  try {
    // Check if API key is valid
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if we already have this word in cache
    const cacheKey = `${word}-${ALICE_VOICE_ID}-normal`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }
    
    // Prepare the request
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ALICE_VOICE_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: word,
        model_id: 'eleven_monolingual_v1',
        voice_settings: VOICE_SETTINGS.normal
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    
    // Get the audio data and create a URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Cache the result
    audioCache.set(cacheKey, audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    throw error;
  }
}

/**
 * Play audio for a word using Alice's voice at normal speed
 * 
 * @param word The word to pronounce
 */
export async function pronounceWord(word: string): Promise<void> {
  try {
    const audioUrl = await generateSpeech(word);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error pronouncing word:', error);
    throw error;
  }
}

/**
 * Pronounce a phonetic breakdown with pauses between each sound
 * Using Alice's voice at normal speed with added pauses
 * 
 * @param phoneticBreakdown The phonetic breakdown to pronounce
 * @returns Promise that resolves when audio finishes
 */
export async function pronouncePhoneticBreakdown(phoneticBreakdown: string): Promise<void> {
  try {
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if phoneticBreakdown is empty or undefined
    if (!phoneticBreakdown || phoneticBreakdown.trim() === '') {
      console.error('Error: Empty phonetic breakdown provided');
      throw new Error('No phonetic breakdown provided');
    }
    
    // Format the phonetic breakdown for clearer pronunciation
    // Add more space and periods to force deliberate speech
    let formattedBreakdown = phoneticBreakdown
      .replace(/-/g, '. ') // Replace hyphens with period and space
      .replace(/\s+/g, '. '); // Replace spaces with period and space
    
    // Add more deliberate pauses between sounds
    formattedBreakdown = formattedBreakdown + '.';
    
    // Use Alice's voice at normal speed with the formatted text
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ALICE_VOICE_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: formattedBreakdown,
        model_id: 'eleven_monolingual_v1',
        voice_settings: VOICE_SETTINGS.normal
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status}`, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    
    // Play the audio
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error pronouncing phonetic breakdown:', error);
    throw error;
  }
}

/**
 * Pronounce a word letter-by-letter with pauses between each letter
 * Using Alice's voice at normal speed with added pauses
 * 
 * @param word The word to pronounce letter-by-letter
 * @returns Promise that resolves when audio finishes
 */
export async function pronounceLetterByLetter(word: string): Promise<void> {
  try {
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if word is empty or undefined
    if (!word || word.trim() === '') {
      console.error('Error: Empty word provided');
      throw new Error('No word provided');
    }
    
    // Simple approach: just add spaces and pauses between each letter
    const letters = word.split('');
    // Add space and pause after each letter
    const simpleSpellOut = letters.join(' . ');
    
    // Use Alice's voice at normal speed with the formatted text
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ALICE_VOICE_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: simpleSpellOut,
        model_id: 'eleven_monolingual_v1',
        voice_settings: VOICE_SETTINGS.normal
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status}`, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    
    // Play the audio
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
  } catch (error) {
    console.error('Error pronouncing word letter-by-letter:', error);
    throw error;
  }
} 