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
    <div className="mt-3 mb-1 select-none">
      {/* Render each row of keys */}
      {keyboardRows.map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className={`flex justify-center mb-1 ${rowIndex === 1 ? 'ml-2' : rowIndex === 2 ? 'ml-6' : ''}`}
        >
          {row.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                w-8 h-8 mx-[2px] rounded-md font-medium text-base
                focus:outline-none focus:ring-1 focus:ring-purple-500
                transition-colors duration-150
                ${disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
                }
                sm:w-9 sm:h-9 sm:mx-1
                md:w-10 md:h-10
                lg:w-11 lg:h-11
                xl:text-lg
              `}
              aria-label={key}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      
      {/* Add a spacebar and backspace row */}
      <div className="flex justify-center mb-1">
        <button
          type="button"
          onClick={() => handleKeyPress('Backspace')}
          disabled={disabled}
          className={`
            w-14 mx-1 rounded-md font-medium text-sm h-8
            focus:outline-none focus:ring-1 focus:ring-purple-500
            transition-colors duration-150
            ${disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
            }
            sm:w-16 sm:h-9
            md:w-20 md:h-10
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
            w-24 mx-1 rounded-md font-medium text-sm h-8
            focus:outline-none focus:ring-1 focus:ring-purple-500
            transition-colors duration-150
            ${disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200'
            }
            sm:w-28 sm:h-9
            md:w-36 md:h-10
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