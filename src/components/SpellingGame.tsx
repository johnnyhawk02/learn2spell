import React, { useState, useEffect } from 'react'
import { pronounceWord, pronounceSpelling } from '../utils/elevenLabsService'
import AlphaKeyboard from './AlphaKeyboard'

type Word = {
  word: string
  definition: string
  rule: string
  difficulty: number
}

type SpellingGameProps = {
  words: Word[]
  onGameComplete?: () => void // Add callback for game completion
}

const SpellingGame: React.FC<SpellingGameProps> = ({ 
  words,
  onGameComplete = () => {} // Default no-op function
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect'>('playing')
  const [hints, setHints] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [nextWordCountdown, setNextWordCountdown] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [isWrongToast, setIsWrongToast] = useState(false)

  // Reset hints when moving to a new word
  useEffect(() => {
    if (words[currentWordIndex]) {
      const wordLength = words[currentWordIndex].word.length
      setHints(Array(wordLength).fill(false))
      
      // Pronounce the word automatically when a new word is loaded
      pronounceWord(words[currentWordIndex].word)
    }
  }, [currentWordIndex, words])

  // Countdown timer effect
  useEffect(() => {
    if (nextWordCountdown !== null && nextWordCountdown > 0) {
      const timer = setTimeout(() => {
        setNextWordCountdown(nextWordCountdown - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
    
    if (nextWordCountdown === 0) {
      setNextWordCountdown(null)
      moveToNextWord()
    }
  }, [nextWordCountdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState === 'playing') {
      setUserInput(e.target.value.toLowerCase())
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameState !== 'playing') {
      // If an answer was given and a key is pressed, move to next word (for incorrect answers)
      if (gameState === 'incorrect') {
        moveToNextWord()
        return
      }
      return
    }

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
  
  // Function to speak encouraging messages
  const speakFeedback = async (isCorrect: boolean) => {
    try {
      // Reduced delay before speaking feedback
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const currentWord = words[currentWordIndex].word
      
      if (isCorrect) {
        // 20 different congratulatory messages for Chloe
        const messages = [
          `Well done, Chloe!`,
          `Great job, Chloe!`,
          `Perfect, Chloe!`,
          `Excellent, Chloe!`,
          `That's right, Chloe!`,
          `Amazing spelling, Chloe!`,
          `Wonderful job, Chloe!`,
          `You're doing great, Chloe!`,
          `Fantastic spelling, Chloe!`,
          `Brilliant work, Chloe!`,
          `Super job, Chloe!`,
          `You're a spelling star, Chloe!`,
          `Magnificent, Chloe!`,
          `Spectacular spelling, Chloe!`,
          `You've got it, Chloe!`,
          `You're so clever, Chloe!`,
          `Terrific job, Chloe!`,
          `You're getting so good at this, Chloe!`,
          `Keep up the great work, Chloe!`,
          `You're making wonderful progress, Chloe!`
        ]
        const message = messages[Math.floor(Math.random() * messages.length)]
        // Simply call pronounceWord which will use Alice's voice
        await pronounceWord(message)
        
        // Move to next word after a short delay to hear the feedback
        setTimeout(() => {
          moveToNextWord()
        }, 1500)
      } else {
        // Variety of encouraging messages for incorrect answers
        const messages = [
          `Try again Chloe`,
          `Not quite Chloe`,
          `Almost Chloe`,
          `Keep trying Chloe`,
          `Don't worry Chloe`,
          `That was a tricky one Chloe`,
          `Nice effort Chloe`,
          `Let's try another one Chloe`,
          `You'll get it next time Chloe`,
          `Let me help you Chloe`
        ]
        
        // Use two separate pronounceWord calls - first for the feedback message,
        // then for the correct spelling after a short pause
        const message = messages[Math.floor(Math.random() * messages.length)]
        await pronounceWord(message)
        
        // Add a small pause before saying the correct word
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Now pronounce the correct spelling using the dedicated function
        await pronounceSpelling(currentWord)
      }
    } catch (error) {
      console.error('Error with voice feedback:', error)
    }
  }

  const checkAnswer = () => {
    const currentWord = words[currentWordIndex].word.toLowerCase()
    const isCorrect = userInput.toLowerCase() === currentWord

    if (isCorrect) {
      playSuccessSound()
      setConfetti(true)
      setScore(prev => prev + 1)
      setGameState('correct')
      setShowToast(true)
      setIsWrongToast(false)
      
      // Provide voice feedback for correct answer
      // moveToNextWord call is now handled in speakFeedback for correct answers
      speakFeedback(true)
      
      // Hide confetti after a few seconds
      setTimeout(() => {
        setConfetti(false)
      }, 2000)
    } else {
      playErrorSound()
      setGameState('incorrect')
      setShowToast(true)
      setIsWrongToast(true)
      
      // Provide voice feedback for incorrect answer
      speakFeedback(false)
      
      // Hide toast after 3 seconds - shorter duration
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gameState === 'playing' && userInput.trim()) {
      checkAnswer()
    } else if (gameState === 'incorrect') {
      moveToNextWord()
    }
  }

  const moveToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1)
      setUserInput('')
      setGameState('playing')
      setShowToast(false)
      setIsWrongToast(false)
      
      // Word will be pronounced by the useEffect that triggers on currentWordIndex change
    } else {
      setGameCompleted(true)
      // If game is completed and we have a callback function, call it
      // This will allow the parent to navigate back to the main screen
      setTimeout(() => {
        onGameComplete()
      }, 3000) // Give time to show the completion screen before returning
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
      <div className="p-2 bg-white bg-opacity-90 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative flex flex-col items-center">
            {/* User input display with large centered text and flashing cursor */}
            <div className="w-full h-20 flex items-center justify-center relative bg-blue-50 rounded-xl overflow-hidden">
              <div className="text-4xl md:text-5xl font-bold text-blue-700 tracking-wide uppercase">
                {userInput}
                <span className={`inline-block w-1 h-[27px] md:h-[35px] bg-blue-500 ml-1 mt-[3px] ${gameState === 'playing' ? 'animate-cursor-blink' : 'opacity-0'}`}></span>
              </div>
            </div>
            
            {/* Hidden input for mobile keyboard support */}
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="sr-only"
              autoComplete="off"
              spellCheck="false"
              autoCapitalize="off"
            />
          </div>
          
          {/* Toast notification for correct/incorrect answers */}
          {showToast && (
            <div className="absolute left-0 right-0 top-1/3 flex justify-center items-center z-50 pointer-events-none">
              {!isWrongToast ? (
                <div className="animate-float-in-up bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg border-2 border-green-400">
                  <div className="text-2xl font-bold text-center">🎉 CORRECT! 🎉</div>
                  <div className="text-center text-sm">Press any key</div>
                </div>
              ) : (
                <div className="animate-float-in-up bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg border-2 border-red-400">
                  <div className="text-2xl font-bold text-center">TRY AGAIN</div>
                  <div className="text-center text-sm">The word is <span className="font-bold uppercase">{currentWord.word}</span></div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      
      {/* Keyboard area - using flex-1 to take remaining space */}
      <div className="flex-1 p-1">
        <AlphaKeyboard 
          onKeyPress={handleKeyPress} 
          disabled={gameState !== 'playing' && !(gameState === 'correct' || gameState === 'incorrect')} 
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
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .animate-cursor-blink {
            animation: blink 1s step-end infinite;
          }
          @keyframes float-in-up {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-float-in-up {
            animation: float-in-up 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  )
}

export default SpellingGame 