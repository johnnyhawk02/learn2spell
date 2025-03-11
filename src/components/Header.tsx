import React, { useState } from 'react'

type WordSet = {
  id: string
  title: string
  description: string
  words: Array<{
    word: string
    definition: string
    rule: string
    difficulty: number
  }>
}

type HeaderProps = {
  currentView: 'learn' | 'practice'
  onViewChange: (view: 'learn' | 'practice') => void
  wordSets: WordSet[]
  currentWordSetId: string
  onWordSetChange: (id: string) => void
  onAddNewClick: () => void
  onDeleteWordSet: (id: string) => void
}

const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onViewChange, 
  wordSets, 
  currentWordSetId, 
  onWordSetChange,
  onAddNewClick,
  onDeleteWordSet
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleWordSetChange = (id: string) => {
    onWordSetChange(id);
    setIsMenuOpen(false);
  };

  // Find the current word set
  const currentWordSet = wordSets.find(set => set.id === currentWordSetId) || wordSets[0];
  const hasWordSets = wordSets.length > 0;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-purple-600 tracking-wide">Learn2Spell</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
            {/* Word Set Menu - only show if we have word sets */}
            {hasWordSets && (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-1 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Word Set: </span>
                  <span className="font-medium">
                    {currentWordSet && currentWordSet.title ? 
                      (currentWordSet.title.length > 20 
                        ? currentWordSet.title.substring(0, 20) + '...' 
                        : currentWordSet.title)
                      : 'Select a set'
                    }
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Word set dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                    <ul className="py-2 max-h-72 overflow-y-auto">
                      {wordSets.map((set) => (
                        <li key={set.id} className="px-2">
                          <div className="flex items-center justify-between hover:bg-purple-50 rounded">
                            <button
                              onClick={() => handleWordSetChange(set.id)}
                              className={`flex-grow text-left px-3 py-2 ${
                                set.id === currentWordSetId ? 'font-medium text-purple-700 bg-purple-50 rounded-md' : ''
                              }`}
                            >
                              {set.title}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteWordSet(set.id);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                              title="Delete Word Set"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                      <li className="border-t border-gray-200 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onAddNewClick();
                          }}
                          className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 font-medium flex items-center"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Word Set
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Add Word Set Button (visible on larger screens) */}
            <button
              onClick={onAddNewClick}
              className="hidden md:flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Words
            </button>
            
            {/* View Toggle Buttons */}
            <nav className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg transition-colors shadow-sm font-medium ${
                  currentView === 'learn'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onViewChange('learn')}
              >
                Learn Words
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-colors shadow-sm font-medium ${
                  currentView === 'practice'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => onViewChange('practice')}
              >
                Practice Spelling
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 