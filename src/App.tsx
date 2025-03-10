import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import GeminiChat from './components/GeminiChat'
import GeminiImageAnalysis from './components/GeminiImageAnalysis'
import GeminiRawApi from './components/GeminiRawApi'

function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'counter' | 'chat' | 'image' | 'raw-api'>('counter')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="h-24 w-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Vite + React + Tailwind + Gemini</h1>
      
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => setActiveTab('counter')}
          className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'counter' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
        >
          Counter Demo
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'chat' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
        >
          Gemini Chat
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'image' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
        >
          Image Analysis
        </button>
        <button 
          onClick={() => setActiveTab('raw-api')}
          className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'raw-api' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
        >
          Raw API Demo
        </button>
      </div>

      {activeTab === 'counter' && (
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 w-full max-w-md">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md mb-4 transition-colors"
          >
            Count is {count}
          </button>
          <p className="text-gray-600 text-center">
            Edit <code className="bg-gray-100 text-indigo-600 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      )}
      
      {activeTab === 'chat' && <GeminiChat />}
      
      {activeTab === 'image' && <GeminiImageAnalysis />}
      
      {activeTab === 'raw-api' && <GeminiRawApi />}

      <p className="text-gray-500 text-sm mt-8">
        {activeTab === 'counter' 
          ? 'Click on the Vite and React logos to learn more' 
          : 'Note: You need to add a valid Gemini API key to use the AI functionality'}
      </p>
    </div>
  )
}

export default App
