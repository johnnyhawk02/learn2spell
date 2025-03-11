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
  const [isHovered, setIsHovered] = useState(false)
  
  // Function to handle pronunciation
  const handlePronounce = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isSpeaking) return // Don't allow multiple clicks
    
    try {
      setIsSpeaking(true)
      // Using Alice's voice at normal speed
      await pronounceWord(word.word)
    } catch (error) {
      console.error('Error pronouncing word:', error)
    } finally {
      setIsSpeaking(false)
    }
  }
  
  return (
    <button 
      onClick={handlePronounce}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isSpeaking}
      className={`
        w-full text-left bg-white rounded-lg shadow p-4
        transform transition-all duration-200
        ${isHovered && !isSpeaking ? 'bg-purple-50' : ''}
        ${isSpeaking ? 'bg-purple-100' : 'hover:bg-purple-50'}
        cursor-pointer border-2 border-transparent
        ${isHovered ? 'border-purple-200' : ''}
        focus:outline-none focus:border-purple-300
      `}
      aria-label={`Pronounce the word ${word.word}`}
      title="Click to hear pronunciation"
    >
      <div className="flex items-center justify-between mb-2 relative">
        <h3 className="text-xl font-bold">{highlightedWord}</h3>
        
        {/* Sound icon indicator */}
        <div className="relative">
          <div className={`
            p-2 rounded-full relative
            ${isSpeaking ? 'bg-purple-200' : ''}
            group
          `}>
            {/* Ripple animation when speaking */}
            {isSpeaking && (
              <>
                <span className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping-slow"></span>
                <span className="absolute inset-0 rounded-full bg-purple-300 opacity-40"></span>
              </>
            )}
            
            {isSpeaking ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m1-13h-5m-1 0H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 group-hover:text-purple-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      
      {/* Minimal definition */}
      <p className="text-gray-600 text-sm">{word.definition}</p>
      
      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes ping-slow {
            0% {
              transform: scale(0.95);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.5;
            }
          }
          .animate-ping-slow {
            animation: ping-slow 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </button>
  )
}

export default WordCard 