// Initialize the ElevenLabs API
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

// Verify if API key is available
const hasValidApiKey = () => {
  return !!API_KEY && API_KEY.length > 0 && !API_KEY.includes('your_key_here');
};

// Voice IDs - using Alice as the default voice
export const VOICE_IDS = {
  alice: "Xb7hH8MSUJpSbSDYk0k2", // Alice - voice that user requested
  dorothy: "ThT5KcBeYPX3keUQqHPh", // Dorothy - UK English female voice
  defaultVoice: "Xb7hH8MSUJpSbSDYk0k2" // Alice is now the default voice
};

// Voice settings configurations
const VOICE_SETTINGS = {
  normal: {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0,
    use_speaker_boost: true
  },
  slow: {
    stability: 0.85, // Higher stability for clearer speech
    similarity_boost: 0.65,
    style: 0,
    use_speaker_boost: true,
    speed: 0.7 // Slower speed (70% of normal)
  },
  very_slow: {
    stability: 0.95, // Very high stability for clearest speech
    similarity_boost: 0.65,
    style: 0,
    use_speaker_boost: true,
    speed: 0.5 // Very slow (50% of normal speed)
  }
};

// Default to slow speech
const DEFAULT_VOICE_SETTINGS = VOICE_SETTINGS.slow;

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
 * Generate speech for a word
 * 
 * @param word The word to generate speech for
 * @param slow Whether to use slow speech (true by default)
 * @returns Promise resolving to the URL of the audio
 */
export async function generateSpeech(
  word: string, 
  slow: boolean = true
): Promise<string> {
  try {
    // Check if API key is valid
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if we already have this word in cache
    const cacheKey = `${word}-${VOICE_IDS.defaultVoice}-${slow ? 'slow' : 'normal'}`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }
    
    // Prepare the request
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS.defaultVoice}`;
    
    const voiceSettings = slow ? VOICE_SETTINGS.slow : VOICE_SETTINGS.normal;
    
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
        voice_settings: voiceSettings
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
 * Play audio for a word
 * 
 * @param word The word to pronounce
 * @param slow Whether to use slow speech (true by default)
 */
export async function pronounceWord(
  word: string, 
  slow: boolean = true
): Promise<void> {
  try {
    const audioUrl = await generateSpeech(word, slow);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error pronouncing word:', error);
    throw error;
  }
}

/**
 * Get available voice options (simplified to only Dorothy)
 * 
 * @returns Object containing voice IDs
 */
export function getVoiceOptions() {
  return VOICE_IDS;
}

/**
 * Pronounce a phonetic breakdown with pauses between each sound
 * 
 * @param phoneticBreakdown The phonetic breakdown to pronounce
 * @returns Promise that resolves when audio finishes
 */
export async function pronouncePhoneticBreakdown(
  phoneticBreakdown: string
): Promise<void> {
  try {
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if phoneticBreakdown is empty or undefined
    if (!phoneticBreakdown || phoneticBreakdown.trim() === '') {
      console.error('Error: Empty phonetic breakdown provided');
      throw new Error('No phonetic breakdown provided');
    }
    
    console.log('Pronouncing phonetic breakdown:', phoneticBreakdown);
    
    // Format the phonetic breakdown for clearer pronunciation
    // Add more space and periods to force slower, more deliberate speech
    let formattedBreakdown = phoneticBreakdown
      .replace(/-/g, '. ') // Replace hyphens with period and space
      .replace(/\s+/g, '. '); // Replace spaces with period and space
    
    // Add more deliberate pauses between sounds
    formattedBreakdown = formattedBreakdown + '.';
    
    console.log('Formatted for pronunciation:', formattedBreakdown);
    
    // Use the default voice (Alice) with very slow voice settings
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS.defaultVoice}`;
    
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
        voice_settings: VOICE_SETTINGS.very_slow
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
 * 
 * @param word The word to pronounce letter-by-letter
 * @returns Promise that resolves when audio finishes
 */
export async function pronounceLetterByLetter(
  word: string
): Promise<void> {
  try {
    if (!hasValidApiKey()) {
      throw new Error("No ElevenLabs API key provided. Set VITE_ELEVENLABS_API_KEY in your .env file.");
    }
    
    // Check if word is empty or undefined
    if (!word || word.trim() === '') {
      console.error('Error: Empty word provided');
      throw new Error('No word provided');
    }
    
    console.log('Pronouncing word letter-by-letter:', word);
    
    // Simple approach: just add spaces and pauses between each letter
    const letters = word.split('');
    // Add space and pause after each letter
    const simpleSpellOut = letters.join(' . ');
    
    console.log('Formatted for letter-by-letter pronunciation:', simpleSpellOut);
    
    // Use the very slow voice settings for clearest pronunciation
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS.defaultVoice}`;
    
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
        voice_settings: VOICE_SETTINGS.very_slow // Use very_slow for clearer letter sounds
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