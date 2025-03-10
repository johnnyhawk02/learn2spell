import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { generateTextFromImage } from '../utils/gemini';

export default function GeminiImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe what you see in this image');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Extract base64 data from the data URL
      const base64Data = image.split(',')[1];
      
      // Use the Gemini Vision API to analyze the image
      const response = await generateTextFromImage(prompt, base64Data);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the image');
      console.error('Error analyzing image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setPrompt('Describe what you see in this image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gemini Image Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Upload an image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        {image && (
          <div className="mt-4">
            <img src={image} alt="Uploaded" className="max-h-60 mx-auto rounded-lg" />
          </div>
        )}
        
        <div>
          <label className="block text-gray-700 mb-2">Prompt (what to ask about the image):</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="E.g., 'Describe what you see' or 'What objects are in this image?'"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={!image || isLoading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Analyze Image'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Reset
          </button>
        </div>
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
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Analysis Result:</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
      
      <p className="mt-4 text-xs text-gray-500">
        Powered by Google's Gemini AI. Responses are generated and may not always be accurate.
      </p>
    </div>
  );
} 