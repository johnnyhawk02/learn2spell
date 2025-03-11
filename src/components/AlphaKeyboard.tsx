import React from 'react'

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

  // Handle keyboard button press
  const handleKeyPress = (key: string) => {
    if (!disabled) {
      onKeyPress(key)
    }
  }

  return (
    <div className="w-full select-none">
      {/* Render each row of keys */}
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className={`flex justify-center mb-1 ${rowIndex === 1 ? 'ml-[2%]' : rowIndex === 2 ? 'ml-[5%]' : ''}`}
        >
          {row.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                flex-1 aspect-square max-w-[9%] m-[0.25%] rounded-md font-medium text-base
                flex items-center justify-center
                focus:outline-none focus:ring-1 focus:ring-purple-500
                transition-colors duration-150
                ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
                }
                md:text-lg
              `}
              aria-label={key}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      
      {/* Add spacebar and backspace row */}
      <div className="flex justify-center mb-1">
        <button
          type="button"
          onClick={() => handleKeyPress('Backspace')}
          disabled={disabled}
          className={`
            w-[20%] mx-[0.5%] rounded-md font-medium text-sm h-10
            flex items-center justify-center
            focus:outline-none focus:ring-1 focus:ring-purple-500
            transition-colors duration-150
            ${disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
            }
            sm:h-11
            md:h-12
          `}
          aria-label="backspace"
        >
          Delete
        </button>
        
        <button
          type="button"
          onClick={() => handleKeyPress(' ')}
          disabled={disabled}
          className={`
            w-[40%] mx-[0.5%] rounded-md font-medium text-sm h-10
            flex items-center justify-center
            focus:outline-none focus:ring-1 focus:ring-purple-500
            transition-colors duration-150
            ${disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
            }
            sm:h-11
            md:h-12
          `}
          aria-label="space"
        >
          Space
        </button>
      </div>
    </div>
  )
}

export default AlphaKeyboard 