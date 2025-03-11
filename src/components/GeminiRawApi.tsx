import { useState } from 'react';
import { rawGeminiApiCall } from '../utils/gemini';

export default function GeminiRawApi() {
  const [prompt, setPrompt] = useState('Explain quantum computing in simple terms');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelType, setModelType] = useState('gemini-pro');
  const [rawResponse, setRawResponse] = useState<Record<string, any> | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setRawResponse(null);

    try {
      // Create the API payload
      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      // Make the raw API call
      const response = await rawGeminiApiCall('generateContent', modelType, payload);
      setRawResponse(response);

      // Extract the generated text from the response
      const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text found';
      setResult(generatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating content');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gemini Raw API Demo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Model</label>
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="gemini-pro">gemini-pro (Standard)</option>
            <option value="gemini-pro-vision">gemini-pro-vision (Vision)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your prompt..."
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Generate Content'
          )}
        </button>
      </form>
      
      {/* Error Display */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Result Display */}
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Generated Content:</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap">
            {result}
          </div>
          
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {showRaw ? 'Hide Raw Response' : 'Show Raw Response'}
          </button>
          
          {showRaw && rawResponse && (
            <div className="mt-2 overflow-auto max-h-60">
              <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-xs">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      <p className="mt-4 text-xs text-gray-500">
        This demo uses direct API calls to the Gemini endpoints instead of the SDK.
      </p>
    </div>
  );
} 