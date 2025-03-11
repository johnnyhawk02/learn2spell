import { useState, useEffect } from 'react';
import { listGeminiModels } from '../utils/gemini';

export default function GeminiModelList() {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await listGeminiModels();
      setModels(response.models || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
      console.error('Error fetching models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Gemini Models</h2>
      
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {models.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Model Name</th>
                <th className="py-2 px-4 border-b text-left">Display Name</th>
                <th className="py-2 px-4 border-b text-left">Supported Generation Methods</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model: any, index: number) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4 border-b font-mono text-sm">{model.name}</td>
                  <td className="py-2 px-4 border-b">{model.displayName}</td>
                  <td className="py-2 px-4 border-b font-mono text-sm">
                    {model.supportedGenerationMethods?.join(', ') || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading && !error ? (
        <p className="text-gray-500 text-center py-8">No models found.</p>
      ) : null}
      
      <div className="mt-4">
        <button
          onClick={fetchModels}
          disabled={isLoading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh Models List'}
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
        <p className="font-bold mb-2">Usage Notes:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Copy the model names exactly as shown above.</li>
          <li>Make sure to use models with the appropriate generation methods.</li>
          <li>For text generation, use models that support 'generateContent'.</li>
          <li>For image analysis, use models that support both 'generateContent' and can handle images.</li>
        </ol>
      </div>
    </div>
  );
} 