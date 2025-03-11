import React, { useState, useEffect } from 'react'
import { pronounceWord } from '../utils/elevenLabsService'
import AlphaKeyboard from './AlphaKeyboard'

type Word = {
  word: string
  definition: string
  rule: string
  difficulty: number
}

type SpellingGameProps = {
  words: Word[]
}

const SpellingGame: React.FC<SpellingGameProps> = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing')
  const [hints, setHints] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [slowSpeed, setSlowSpeed] = useState<boolean>(true)
  const [inputFocused, setInputFocused] = useState(false)
  
  const currentWord = words[currentWordIndex]
  
  // Reset the game state when moving to a new word
  useEffect(() => {
    setUserInput('')
    setGameState('playing')
    setHints(Array(currentWord.word.length).fill(false))
  }, [currentWordIndex, currentWord.word.length])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'playing') {
      setUserInput(e.target.value)
    }
  }
  
  // Function to handle virtual keyboard input
  const handleKeyPress = (key: string) => {
    if (gameState !== 'playing') return
    
    if (key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1))
    } else {
      setUserInput(prev => prev + key)
    }
  }
  
  // Function to handle pronunciation
  const handlePronounce = async () => {
    if (isSpeaking) return // Don't allow multiple clicks
    
    try {
      setIsSpeaking(true)
      await pronounceWord(currentWord.word, slowSpeed)
    } catch (error) {
      console.error('Error pronouncing word:', error)
    } finally {
      setIsSpeaking(false)
    }
  }
  
  // Function to handle speed toggle
  const handleSpeedToggle = () => {
    setSlowSpeed(!slowSpeed)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (gameState !== 'playing') return
    
    const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase()
    
    if (isCorrect) {
      setGameState('correct')
      setScore(prev => prev + 10 - hints.filter(Boolean).length)
      
      // Automatically move to the next word after a delay
      setTimeout(() => {
        if (currentWordIndex >= words.length - 1) {
          setGameCompleted(true)
        } else {
          setCurrentWordIndex(currentWordIndex + 1)
        }
      }, 2000)
    } else {
      setGameState('incorrect')
    }
  }
  
  const revealHint = () => {
    // Find the next letter that hasn't been revealed yet
    const nextHintIndex = hints.findIndex(hint => !hint)
    
    if (nextHintIndex !== -1) {
      const newHints = [...hints]
      newHints[nextHintIndex] = true
      setHints(newHints)
    }
  }
  
  const restartGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setGameCompleted(false)
    setGameState('playing')
    setHints(Array(words[0].word.length).fill(false))
    setUserInput('')
  }
  
  return (
    <div className="h-[100vh] w-full flex flex-col bg-white">
      {gameCompleted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-3">Game Completed!</h2>
          <p className="text-lg md:text-xl mb-4">Your final score: <span className="font-bold text-purple-600">{score}</span></p>
          <button
            onClick={restartGame}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg text-lg hover:bg-purple-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Header area with score */}
          <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white z-10">
            <p className="text-sm md:text-base text-gray-600">
              Word {currentWordIndex + 1}/{words.length}
            </p>
            <div className="bg-purple-100 px-3 py-1 rounded-lg">
              <span className="text-purple-800 font-bold text-sm md:text-base">Score: {score}</span>
            </div>
          </div>
          
          {/* Main content area - set max height to ensure it doesn't overflow */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4" style={{ maxHeight: 'calc(100vh - 150px)' }}>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1 text-center">Spell the Word</h2>
            
            <div className="bg-purple-100 rounded-lg p-2 mb-2">
              <p className="text-sm md:text-base text-gray-700">Definition:</p>
              <p className="text-base md:text-lg italic">{currentWord.definition}</p>
            </div>
            
            <div className="flex flex-row items-center justify-center space-x-2 mb-2">
              <button
                onClick={handlePronounce}
                disabled={isSpeaking}
                className={`flex items-center px-3 py-1 rounded-md transition-colors text-sm ${
                  isSpeaking 
                    ? 'bg-purple-300 text-purple-800' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <svg className="animate-pulse h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m1-13h-5m-1 0H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2z" />
                    </svg>
                    Playing...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Hear
                  </>
                )}
              </button>
              
              <button
                onClick={handleSpeedToggle}
                className={`flex items-center px-2 py-1 rounded-md text-sm ${
                  slowSpeed 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={slowSpeed ? "Speaking slowly" : "Speaking at normal speed"}
              >
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {slowSpeed ? "Slow" : "Normal"}
              </button>
            </div>
            
            {gameState === 'correct' && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-2 flex items-center text-sm">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Correct! Good job!</span>
              </div>
            )}
            
            {gameState === 'incorrect' && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-2 flex items-center text-sm">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Not quite right. Try again!</span>
              </div>
            )}
            
            <div className="flex justify-center space-x-1 mb-2">
              {currentWord.word.split('').map((letter, index) => (
                <span 
                  key={index}
                  className={`
                    inline-block text-lg font-medium px-1
                    ${hints[index] 
                      ? 'text-green-600 font-bold' 
                      : 'text-gray-400'
                    }
                  `}
                >
                  {hints[index] ? letter : '_'}
                </span>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mb-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Type the word here..."
                  className={`w-full p-2 border-2 rounded-lg text-center text-base
                    ${gameState === 'correct' ? 'border-green-500 bg-green-50' : ''}
                    ${gameState === 'incorrect' ? 'border-red-500 bg-red-50' : ''}
                    ${inputFocused ? 'border-purple-500' : 'border-gray-300'}
                  `}
                  disabled={gameState !== 'playing'}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              
              <div className="flex justify-between mt-2 mb-1">
                <button
                  type="button"
                  onClick={revealHint}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                  disabled={gameState !== 'playing' || hints.every(Boolean)}
                >
                  Hint
                </button>
                
                {gameState === 'playing' ? (
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Check
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentWordIndex >= words.length - 1) {
                        setGameCompleted(true)
                      } else {
                        setCurrentWordIndex(currentWordIndex + 1)
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {currentWordIndex >= words.length - 1 ? 'Finish' : 'Next'}
                  </button>
                )}
              </div>
              
              <div className="bg-purple-50 rounded-lg p-2 text-center text-xs md:text-sm mb-2">
                <p className="text-purple-800">
                  Remember: In these words, the letter 'y' makes the short 'i' sound (/I/).
                </p>
              </div>
            </form>
          </div>
          
          {/* Keyboard area - fixed at bottom with specific height */}
          <div className="p-1 bg-gray-50 border-t border-gray-200 z-10" style={{ minHeight: '130px' }}>
            <AlphaKeyboard 
              onKeyPress={handleKeyPress} 
              disabled={gameState !== 'playing'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SpellingGame 