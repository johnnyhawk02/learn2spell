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
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState(false)

  // Reset hints when moving to a new word
  useEffect(() => {
    if (words[currentWordIndex]) {
      const wordLength = words[currentWordIndex].word.length
      setHints(Array(wordLength).fill(false))
      
      // Pronounce the word automatically when a new word is loaded
      pronounceWord(words[currentWordIndex].word)
    }
  }, [currentWordIndex, words])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'playing') {
      setUserInput(e.target.value.toLowerCase())
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameState !== 'playing') return

    if (key === 'Backspace') {
      setUserInput(prev => prev.slice(0, -1))
    } else if (key === 'Enter') {
      handleSubmit(new Event('submit') as unknown as React.FormEvent)
    } else {
      setUserInput(prev => prev + key)
    }
  }

  const handlePronounce = async () => {
    if (words[currentWordIndex]) {
      await pronounceWord(words[currentWordIndex].word)
    }
  }

  const checkAnswer = () => {
    const currentWord = words[currentWordIndex].word.toLowerCase()
    const isCorrect = userInput.toLowerCase() === currentWord

    if (isCorrect) {
      playSuccessSound()
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3000)
      setScore(prev => prev + 1)
      setGameState('correct')
      
      // Automatically move to the next word after showing "Correct!" message
      setTimeout(() => {
        moveToNextWord()
      }, 1500) // 1.5 seconds delay before moving to next word
    } else {
      playErrorSound()
      setGameState('incorrect')
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameState === 'playing' && userInput.trim()) {
      checkAnswer()
    } else if (gameState !== 'playing') {
      moveToNextWord()
    }
  }

  const moveToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
      setUserInput('')
      setGameState('playing')
      
      // Word will be pronounced by the useEffect that triggers on currentWordIndex change
    } else {
      setGameCompleted(true)
    }
  }

  const restartGame = () => {
    setCurrentWordIndex(0)
    setUserInput('')
    setGameState('playing')
    setScore(0)
    setGameCompleted(false)
    if (words[0]) {
      const wordLength = words[0].word.length
      setHints(Array(wordLength).fill(false))
      
      // Pronounce the first word when game restarts
      pronounceWord(words[0].word)
    }
  }

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create a success sound (major chord)
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const oscillator3 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator1.type = 'sine'
      oscillator2.type = 'sine'
      oscillator3.type = 'sine'
      
      oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime) // E5
      oscillator3.frequency.setValueAtTime(783.99, audioContext.currentTime) // G5
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
      
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      oscillator3.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator1.start()
      oscillator2.start()
      oscillator3.start()
      
      oscillator1.stop(audioContext.currentTime + 0.5)
      oscillator2.stop(audioContext.currentTime + 0.5)
      oscillator3.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Error playing success sound:', error)
    }
  }

  const playErrorSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create an error sound (minor second interval)
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator1.type = 'sine'
      oscillator2.type = 'sine'
      
      oscillator1.frequency.setValueAtTime(440, audioContext.currentTime) // A4
      oscillator2.frequency.setValueAtTime(466.16, audioContext.currentTime) // A#4/Bb4
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
      
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator1.start()
      oscillator2.start()
      
      oscillator1.stop(audioContext.currentTime + 0.3)
      oscillator2.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.error('Error playing error sound:', error)
    }
  }

  const renderConfetti = () => {
    if (!confetti) return null
    
    // Simple confetti effect
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 10 + 5
          const left = Math.random() * 100
          const animationDuration = Math.random() * 2 + 1
          const delay = Math.random()
          const color = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500'
          ][Math.floor(Math.random() * 7)]
          
          return (
            <div
              key={i}
              className={`absolute rounded-full ${color}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}vw`,
                top: '-10px',
                animation: `fall ${animationDuration}s ease-in forwards ${delay}s`
              }}
            />
          )
        })}
        
        <style>
          {`
            @keyframes fall {
              from {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
              }
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}
        </style>
      </div>
    )
  }

  if (!words || words.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Spelling Game</h2>
        <p className="text-xl text-center text-blue-700">
          No words available! Please add some words first.
        </p>
      </div>
    )
  }

  const currentWord = words[currentWordIndex]
  
  if (gameCompleted) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-100 to-blue-100 rounded-xl">
        <h2 className="text-4xl font-bold text-purple-600 mb-6">Game Completed!</h2>
        <div className="text-3xl text-center mb-8">
          <span className="font-bold text-blue-600">Your score: </span>
          <span className="text-purple-700 font-bold">{score}</span>
          <span className="text-blue-600 font-bold"> out of {words.length}</span>
        </div>
        
        <div className="relative">
          <button
            onClick={restartGame}
            className="px-8 py-4 text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none"
          >
            Play Again! 🎮
          </button>
          {/* Decoration */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-300 rounded-full animate-bounce" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col divide-y bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl">
      {/* Header with compact score and progress */}
      <div className="flex justify-between items-center p-2 bg-white bg-opacity-80 rounded-t-xl shadow-sm sticky top-0 z-10">
        <div className="flex flex-col text-sm">
          <div className="flex items-center">
            <span className="font-bold text-purple-700">Score:</span>
            <span className="ml-1 text-blue-600 font-bold">{score}/{words.length}</span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-purple-700">Word:</span>
            <span className="ml-1 text-blue-600 font-bold">{currentWordIndex + 1}/{words.length}</span>
          </div>
        </div>
        
        <div className="flex-1 mx-4 px-4 py-2 bg-yellow-50 rounded-lg border-2 border-yellow-200 shadow-inner flex items-center justify-between">
          <p className="text-sm text-yellow-800 italic flex-1">{currentWord.definition}</p>
          <button
            type="button"
            onClick={handlePronounce}
            className="ml-2 p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg border-2 border-blue-300 shadow flex items-center justify-center transition-colors h-8 w-8 flex-shrink-0"
            aria-label="Hear Word"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Input area - make it sticky and more visible */}
      <div className="p-3 bg-white bg-opacity-90 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-3 text-xl font-bold rounded-xl border-2
                ${gameState === 'playing' 
                  ? 'border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                  : gameState === 'correct'
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }
                focus:outline-none transition-colors
                shadow-inner
              `}
              placeholder="Type your answer..."
              readOnly={gameState !== 'playing'}
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
            />
            
            {/* Animated bounce indicator when typing */}
            <div 
              className={`
                absolute top-1/2 right-3 transform -translate-y-1/2
                w-3 h-3 rounded-full
                ${userInput.length > 0 && gameState === 'playing' ? 'bg-blue-500 animate-ping' : 'hidden'}
              `}
            ></div>
          </div>
          
          {/* Feedback message area with fixed height to prevent layout shifts */}
          <div className="h-12 flex items-center justify-center">
            {gameState !== 'playing' ? (
              <div className={`
                w-full text-center text-lg font-bold rounded-lg p-2
                ${gameState === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                animate-pop
              `}>
                {gameState === 'correct' 
                  ? '🎉 Correct! Great job!' 
                  : `💫 Not quite. The word is "${currentWord.word}"`}
              </div>
            ) : null}
          </div>
        </form>
      </div>
      
      {/* Keyboard area - using flex-1 to take remaining space */}
      <div className="flex-1 p-1">
        <AlphaKeyboard 
          onKeyPress={handleKeyPress} 
          disabled={gameState !== 'playing'} 
        />
      </div>
      
      {renderConfetti()}
      
      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-pop {
            animation: pop 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  )
}

export default SpellingGame 