import React, { useCallback } from 'react'

type AlphaKeyboardProps = {
  onKeyPress: (key: string) => void
  disabled?: boolean
}

const AlphaKeyboard: React.FC<AlphaKeyboardProps> = ({ onKeyPress, disabled = false }) => {
  // Define rows of keys for a standard QWERTY layout
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]
  
  // Single color scheme for all letter keys
  const keyColor = 'bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200 active:bg-blue-300'

  // Create audio context for click sound
  const playClickSound = useCallback(() => {
    try {
      // Create a new AudioContext each time to avoid issues with suspended contexts
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a short beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure the sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Higher frequency for a crisp click
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Low volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // Quick fade out
      
      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1); // Stop after 100ms
    } catch (error) {
      console.error('Error playing click sound:', error);
    }
  }, []);

  // Handle keyboard button press
  const handleKeyPress = (key: string) => {
    if (!disabled) {
      playClickSound();
      onKeyPress(key);
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between select-none bg-gray-100 rounded-lg p-2">
      {/* Render each row of keys - more compact for iPad */}
      <div className="flex-1 flex flex-col justify-center space-y-1">
        {/* Keyboard layout with integrated special keys */}
        {/* First row with letters and delete */}
        <div className="flex justify-center">
          {keyboardRows[0].map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                flex-1 aspect-square max-w-[8%] m-[0.3%] rounded-xl text-2xl font-bold
                flex items-center justify-center
                focus:outline-none 
                transition-all duration-150 
                ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
                  : `${keyColor} border-2 active:transform active:scale-95 shadow-md`
                }
                uppercase
              `}
              aria-label={key}
            >
              {key}
            </button>
          ))}
          {/* Delete key - exact same size as letter keys */}
          <button
            type="button"
            onClick={() => handleKeyPress('Backspace')}
            disabled={disabled}
            className={`
              flex-1 aspect-square max-w-[8%] m-[0.3%] rounded-xl text-xl font-bold
              flex items-center justify-center
              focus:outline-none
              transition-all duration-150
              ${disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
                : 'bg-orange-100 border-2 border-orange-400 text-orange-800 hover:bg-orange-200 active:bg-orange-300 active:transform active:scale-95 shadow-md'
              }
            `}
            aria-label="backspace"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>
        
        {/* Second row with offset and CHECK IT! button */}
        <div className="flex justify-center ml-[2%]">
          {keyboardRows[1].map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                flex-1 aspect-square max-w-[8%] m-[0.3%] rounded-xl text-2xl font-bold
                flex items-center justify-center
                focus:outline-none 
                transition-all duration-150 
                ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
                  : `${keyColor} border-2 active:transform active:scale-95 shadow-md`
                }
                uppercase
              `}
              aria-label={key}
            >
              {key}
            </button>
          ))}
          
          {/* CHECK IT! button integrated at the end of second row */}
          <button
            type="button"
            onClick={() => handleKeyPress('Enter')}
            disabled={disabled}
            className={`
              flex-1 aspect-square max-w-[8%] m-[0.3%] rounded-xl text-xl font-bold
              flex flex-col items-center justify-center
              focus:outline-none 
              transition-all duration-150
              ${disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
                : 'bg-gradient-to-r from-green-400 to-teal-500 border-2 border-green-500 text-white hover:from-green-500 hover:to-teal-600 active:transform active:scale-95 shadow-md'
              }
              relative overflow-hidden
            `}
            aria-label="enter"
          >
            {!disabled && (
              <>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300 animate-ping"></span>
                <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-pink-300 animate-ping" style={{ animationDelay: '0.5s' }}></span>
              </>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">CHECK</span>
          </button>
        </div>
        
        {/* Third row with offset */}
        <div className="flex justify-center ml-[5%]">
          {keyboardRows[2].map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                flex-1 aspect-square max-w-[8%] m-[0.3%] rounded-xl text-2xl font-bold
                flex items-center justify-center
                focus:outline-none 
                transition-all duration-150 
                ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-inner'
                  : `${keyColor} border-2 active:transform active:scale-95 shadow-md`
                }
                uppercase
              `}
              aria-label={key}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AlphaKeyboard 