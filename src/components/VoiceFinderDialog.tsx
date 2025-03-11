import React from 'react'
import { pronounceWord } from '../utils/elevenLabsService'

type VoiceInfoDialogProps = {
  isOpen: boolean
  onClose: () => void
}

const VoiceInfoDialog: React.FC<VoiceInfoDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handlePlayVoiceSample = async () => {
    try {
      await pronounceWord("Hello, I'm Alice, your spelling guide.");
    } catch (error) {
      console.error('Error playing voice sample:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="bg-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Voice Information</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-purple-700 mb-2">Meet Alice - Your Spelling Voice</h3>
            <p className="text-gray-700">
              Alice is a clear, friendly UK English voice that will help you learn to spell. 
              All words in this app are pronounced by Alice at a normal, easy-to-understand pace.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <div className="flex items-center mb-2">
              <span className="font-bold text-purple-700 mr-2">Voice:</span>
              <span className="text-purple-900">Alice</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-bold text-purple-700 mr-2">Accent:</span>
              <span className="text-purple-900">UK English</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="font-bold text-purple-700 mr-2">Speed:</span>
              <span className="text-purple-900">Normal</span>
            </div>
            
            <button 
              onClick={handlePlayVoiceSample}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              Hear Alice's Voice
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceInfoDialog 