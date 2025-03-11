// Initialize the ElevenLabs API
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

// Verify if API key is available
const hasValidApiKey = () => {
  return !!API_KEY && API_KEY.length > 0 && !API_KEY.includes('your_key_here');
};

// Alice's voice ID - the ONLY voice we'll use
const ALICE_VOICE_ID = import.meta.env.VITE_ALICE_VOICE_ID || "Xb7hH8MSUJpSbSDYk0k2";

// Voice settings configuration - ONLY normal speed
const VOICE_SETTINGS = {
  normal: {
    stability: 0.80,      // Slightly increased for more consistency
    similarity_boost: 0.7, // Slightly reduced for more natural sound
    style: 0.5,           // Add some style variation for better pronunciation
    use_speaker_boost: true
  }
};

// In-memory cache for audio during the current session
const sessionAudioCache = new Map<string, string>();

// IndexedDB for persistent storage
class AudioCache {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'learn2spell_audio_cache';
  private readonly STORE_NAME = 'audio_data';
  private readonly DB_VERSION = 1;
  private dbInitPromise: Promise<boolean>;

  constructor() {
    this.dbInitPromise = this.initDB();
  }

  private async initDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported. Audio will not be cached between sessions.');
        resolve(false);
        return;
      }

      const request = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB', event);
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async get(key: string): Promise<string | null> {
    // Wait for DB initialization
    const isInitialized = await this.dbInitPromise;
    if (!isInitialized || !this.db) return null;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.audioData);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          console.error('Error retrieving audio from cache', request.error);
          resolve(null);
        };
      } catch (error) {
        console.error('Error reading from IndexedDB:', error);
        resolve(null);
      }
    });
  }

  async set(key: string, audioBlob: Blob): Promise<boolean> {
    // Wait for DB initialization
    const isInitialized = await this.dbInitPromise;
    if (!isInitialized || !this.db) return false;

    return new Promise((resolve) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        
        reader.onloadend = () => {
          const base64data = reader.result as string;
          
          const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
          const store = transaction.objectStore(this.STORE_NAME);
          
          // Store the audio data
          const request = store.put({
            id: key,
            audioData: base64data,
            timestamp: Date.now()
          });
          
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('Error storing audio in cache', request.error);
            resolve(false);
          };
        };
      } catch (error) {
        console.error('Error writing to IndexedDB:', error);
        resolve(false);
      }
    });
  }

  async clearOldEntries(maxAgeMs: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    // Clear entries older than 30 days by default
    const isInitialized = await this.dbInitPromise;
    if (!isInitialized || !this.db) return;

    const cutoffTime = Date.now() - maxAgeMs;
    
    try {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.value.timestamp < cutoffTime) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('Error clearing old cache entries:', error);
    }
  }
}

// Create singleton instance
const audioCache = new AudioCache();

// Clean up old cache entries (older than 30 days) when the app starts
audioCache.clearOldEntries();

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
 * Format text to ensure consistent pronunciation
 * 
 * @param word The word or message to format
 * @returns Formatted text that will be pronounced consistently
 */
function formatForConsistentPronunciation(word: string): string {
  // Make sure punctuation is properly spaced and add quotation marks for consistent intonation
  return `"${word.replace(/([.,!?;:])/g, ' $1 ').replace(/\s+/g, ' ').trim()}."`;
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
    
    // Format the word for consistent pronunciation
    const formattedWord = formatForConsistentPronunciation(word);
    
    // Create a unique cache key
    const cacheKey = `${formattedWord}-${ALICE_VOICE_ID}-normal`;
    
    // Check session cache first (fastest)
    if (sessionAudioCache.has(cacheKey)) {
      return sessionAudioCache.get(cacheKey)!;
    }
    
    // Then check persistent cache
    const cachedAudio = await audioCache.get(cacheKey);
    if (cachedAudio) {
      // Store in session cache for faster access
      sessionAudioCache.set(cacheKey, cachedAudio);
      return cachedAudio;
    }
    
    // If not in cache, fetch from API
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${ALICE_VOICE_ID}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text: formattedWord,
        model_id: 'eleven_monolingual_v1',
        voice_settings: VOICE_SETTINGS.normal
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }
    
    // Get the audio data
    const audioBlob = await response.blob();
    
    // Create URL for session cache
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Store in session cache
    sessionAudioCache.set(cacheKey, audioUrl);
    
    // Store in persistent cache (don't await to not block)
    audioCache.set(cacheKey, audioBlob).catch(err => 
      console.warn('Failed to store audio in persistent cache:', err)
    );
    
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
 * Pronounce the spelling of a word with consistent voice (Alice)
 * This function is specifically optimized for spelling words out
 * 
 * @param word The word whose spelling to pronounce
 */
export async function pronounceSpelling(word: string): Promise<void> {
  try {
    // Format specifically for spelling pronunciation
    // This ensures consistent voice characteristics
    const formattedText = `The word is spelled ${word}`;
    
    const audioUrl = await generateSpeech(formattedText);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('Error pronouncing spelling:', error);
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
    formattedBreakdown = `"${formattedBreakdown}".`;
    
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
    
    // Format for consistent pronunciation
    const formattedSpellOut = `"${simpleSpellOut}".`;
    
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
        text: formattedSpellOut,
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