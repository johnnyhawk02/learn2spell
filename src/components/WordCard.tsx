import React, { useState } from 'react'
import { pronounceWord } from '../utils/elevenLabsService'

type Word = {
  word: string
  definition: string
  rule: string
  difficulty: number
  phonetic?: string  // This will be used for syllable breakdown instead
}

type WordCardProps = {
  word: Word
  highlightedWord: React.ReactNode
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  highlightedWord
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // Function to handle pronunciation
  const handlePronounce = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isSpeaking) return // Don't allow multiple clicks
    
    try {
      setIsSpeaking(true)
      // Using Alice's voice
      await pronounceWord(word.word, true)
    } catch (error) {
      console.error('Error pronouncing word:', error)
    } finally {
      setIsSpeaking(false)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Word with pronunciation button */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold">{highlightedWord}</h3>
        <div>
          {/* Word pronunciation */}
          <button 
            onClick={handlePronounce} 
            disabled={isSpeaking}
            className={`p-1 rounded ${isSpeaking ? 'text-purple-700' : 'text-purple-600 hover:text-purple-700'}`}
            title="Listen to pronunciation"
          >
            {isSpeaking ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m1-13h-5m-1 0H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Minimal definition */}
      <p className="text-gray-600 text-sm">{word.definition}</p>
    </div>
  )
}

export default WordCard 