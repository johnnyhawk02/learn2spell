import React, { useState, useEffect } from 'react';
import { getAllVoices, ElevenLabsVoice, pronounceWord } from '../utils/elevenLabsService';

type VoiceFinderDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onVoiceSelect: (voiceId: string) => void;
}

const VoiceFinderDialog: React.FC<VoiceFinderDialogProps> = ({ isOpen, onClose, onVoiceSelect }) => {
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<ElevenLabsVoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterAccent, setFilterAccent] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [currentPreviewId, setCurrentPreviewId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);

  // Fetch voices when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchVoices();
    }
  }, [isOpen]);

  // Apply filters when voices, search term, or filters change
  useEffect(() => {
    if (voices.length > 0) {
      filterVoices();
    }
  }, [voices, searchTerm, filterAccent, filterGender]);

  // Fetch all available voices from the API
  const fetchVoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allVoices = await getAllVoices();
      setVoices(allVoices);
      setFilteredVoices(allVoices);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch voices';
      setError(errorMessage);
      console.error('Error fetching voices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter voices based on search term and filters
  const filterVoices = () => {
    let result = [...voices];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(voice => 
        voice.name.toLowerCase().includes(term) || 
        (voice.description && voice.description.toLowerCase().includes(term))
      );
    }
    
    // Apply accent filter
    if (filterAccent !== 'all') {
      result = result.filter(voice => 
        voice.labels?.accent?.toLowerCase() === filterAccent.toLowerCase()
      );
    }
    
    // Apply gender filter
    if (filterGender !== 'all') {
      result = result.filter(voice => 
        voice.labels?.gender?.toLowerCase() === filterGender.toLowerCase()
      );
    }
    
    setFilteredVoices(result);
  };

  // Play a sample of the voice
  const playVoiceSample = async (voice: ElevenLabsVoice) => {
    if (currentPreviewId) return; // Don't allow multiple playbacks
    
    setCurrentPreviewId(voice.voice_id);
    
    try {
      // If there's a preview URL, use it
      if (voice.preview_url) {
        const audio = new Audio(voice.preview_url);
        audio.addEventListener('ended', () => setCurrentPreviewId(null));
        await audio.play();
      } else {
        // Otherwise use our TTS function
        await pronounceWord(voice.name, true);
        setCurrentPreviewId(null);
      }
    } catch (error) {
      console.error('Error playing voice sample:', error);
      setCurrentPreviewId(null);
    }
  };

  // Handle voice selection
  const handleSelectVoice = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    onVoiceSelect(voiceId);
  };

  // Get unique accents and genders for filtering
  const getUniqueAccents = () => {
    const accents = new Set<string>();
    voices.forEach(voice => {
      if (voice.labels?.accent) {
        accents.add(voice.labels.accent);
      }
    });
    return Array.from(accents);
  };

  const getUniqueGenders = () => {
    const genders = new Set<string>();
    voices.forEach(voice => {
      if (voice.labels?.gender) {
        genders.add(voice.labels.gender);
      }
    });
    return Array.from(genders);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">ElevenLabs Voice Finder</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Display a prominent error message if API key is missing */}
        {error && error.includes('API key') ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-8 rounded-lg max-w-2xl mx-auto mb-6 text-center">
              <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-bold text-xl mb-2">ElevenLabs API Key Required</h3>
              <p className="mb-4">
                To use voice features, you need to add your ElevenLabs API key to the <code className="bg-red-100 px-1 py-0.5 rounded text-red-800 font-mono">.env</code> file.
              </p>
              <ol className="text-left list-decimal pl-8 mb-4 space-y-2">
                <li>Sign up for an account at <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">elevenlabs.io</a></li>
                <li>Get your API key from the profile settings</li>
                <li>Add it to your <code className="bg-red-100 px-1 py-0.5 rounded text-red-800 font-mono">.env</code> file as <code className="bg-red-100 px-1 py-0.5 rounded text-red-800 font-mono">VITE_ELEVENLABS_API_KEY=your_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-md text-white"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Voices
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="accent" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Accent
                  </label>
                  <select
                    id="accent"
                    value={filterAccent}
                    onChange={(e) => setFilterAccent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Accents</option>
                    {getUniqueAccents().map(accent => (
                      <option key={accent} value={accent}>{accent}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Gender
                  </label>
                  <select
                    id="gender"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Genders</option>
                    {getUniqueGenders().map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              ) : filteredVoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No voices found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVoices.map(voice => (
                    <div 
                      key={voice.voice_id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedVoiceId === voice.voice_id 
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{voice.name}</h3>
                          {voice.labels && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {voice.labels.accent && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {voice.labels.accent}
                                </span>
                              )}
                              {voice.labels.gender && (
                                <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                                  {voice.labels.gender}
                                </span>
                              )}
                              {voice.labels.age && (
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Age: {voice.labels.age}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => playVoiceSample(voice)}
                          disabled={currentPreviewId !== null}
                          className={`p-2 rounded-full ${
                            currentPreviewId === voice.voice_id
                              ? 'bg-purple-200 text-purple-700'
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                          title="Listen to sample"
                        >
                          {currentPreviewId === voice.voice_id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m1-13h-5m-1 0H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {voice.description && (
                        <p className="text-sm text-gray-600 mb-3">{voice.description}</p>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          ID: {voice.voice_id.substring(0, 8)}...
                        </div>
                        <button
                          onClick={() => handleSelectVoice(voice.voice_id)}
                          className={`px-3 py-1 rounded-md ${
                            selectedVoiceId === voice.voice_id
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700'
                          }`}
                        >
                          {selectedVoiceId === voice.voice_id ? 'Selected' : 'Select Voice'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (selectedVoiceId) {
                    onVoiceSelect(selectedVoiceId);
                    onClose();
                  }
                }}
                disabled={!selectedVoiceId}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white disabled:bg-purple-300"
              >
                Use Selected Voice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceFinderDialog; 