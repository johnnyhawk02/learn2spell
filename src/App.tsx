import React, { useState, useEffect } from 'react'
import SpellingGame from './components/SpellingGame.tsx'
import WordList from './components/WordList.tsx'
import Header from './components/Header.tsx'
import AddWordSetDialog from './components/AddWordSetDialog.tsx'
import { v4 as uuidv4 } from 'uuid'

// Type for a word set
type WordSet = {
  id: string
  title: string
  description: string
  words: Array<{
    word: string
    definition: string
    rule: string
    difficulty: number
    phonetic?: string  // Adding phonetic breakdown field
  }>
}

// Default word set with words containing the /I/ sound spelled with 'y'
const DEFAULT_WORD_SET: WordSet = {
  id: uuidv4(),
  title: "Words with 'y' as /I/ Sound",
  description: "Learn to spell words where the letter 'y' makes the /I/ sound",
  words: [
    {
      word: "oxygen",
      definition: "A colorless, odorless gas that is essential for life.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 2,
      phonetic: "ox·y·gen"
    },
    {
      word: "lyric",
      definition: "The words of a song or poem.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 1,
      phonetic: "lyr·ic"
    },
    {
      word: "system",
      definition: "A set of connected things that work together as a whole.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 1,
      phonetic: "sys·tem"
    },
    {
      word: "syrup",
      definition: "A sweet, thick liquid made from sugar and water.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 2,
      phonetic: "syr·up"
    },
    {
      word: "physical",
      definition: "Relating to the body or to things that can be touched.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 3,
      phonetic: "phys·i·cal"
    },
    {
      word: "crypt",
      definition: "An underground room or vault, especially one beneath a church that is used as a burial place.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 3,
      phonetic: "crypt"
    },
    {
      word: "crystal",
      definition: "A solid material with a regular geometric pattern.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 2,
      phonetic: "crys·tal"
    },
    {
      word: "cymbal",
      definition: "A round, metal plate that makes a crashing sound when hit.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 3,
      phonetic: "cym·bal"
    },
    {
      word: "typical",
      definition: "Having the usual qualities or characteristics of a particular type of person or thing.",
      rule: "When 'y' appears in the middle of a word, it often makes the /I/ sound.",
      difficulty: 2,
      phonetic: "typ·i·cal"
    }
  ]
};

// Local storage key for saving word sets
const STORAGE_KEY = 'learn2spell_word_sets';
const CURRENT_SET_KEY = 'learn2spell_current_set';

function App() {
  // State for current view (learn or practice)
  const [currentView, setCurrentView] = useState<'learn' | 'practice'>('learn');
  
  // State for word sets - loads from localStorage if available
  const [wordSets, setWordSets] = useState<Record<string, WordSet>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsedSets = saved ? JSON.parse(saved) : {};
      
      // If no saved word sets, initialize with the default set
      if (Object.keys(parsedSets).length === 0) {
        return { [DEFAULT_WORD_SET.id]: DEFAULT_WORD_SET };
      }
      
      return parsedSets;
    } catch (error) {
      console.error('Error loading word sets from local storage:', error);
      // On error, return the default set
      return { [DEFAULT_WORD_SET.id]: DEFAULT_WORD_SET };
    }
  });
  
  // State for the current word set - also load from localStorage
  const [currentWordSetId, setCurrentWordSetId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(CURRENT_SET_KEY);
      // If no saved ID or it doesn't exist in our sets, use the default set
      if (!savedId || !wordSets[savedId]) {
        return DEFAULT_WORD_SET.id;
      }
      return savedId;
    } catch (error) {
      return DEFAULT_WORD_SET.id;
    }
  });
  
  // State for dialog visibility - only show automatically if no custom word sets
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Empty state message
  const [emptyStateMessage, setEmptyStateMessage] = useState<string>('Add your first word set to get started!');
  
  // Check if we have any word sets
  const hasWordSets = Object.keys(wordSets).length > 0;
  
  // Effect to set the current word set ID when a new set is added
  useEffect(() => {
    const wordSetIds = Object.keys(wordSets);
    if (wordSetIds.length > 0 && !currentWordSetId) {
      const newCurrentId = wordSetIds[0];
      setCurrentWordSetId(newCurrentId);
      
      // Save to localStorage
      localStorage.setItem(CURRENT_SET_KEY, newCurrentId);
    }
  }, [wordSets, currentWordSetId]);
  
  // Effect to save word sets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wordSets));
    } catch (error) {
      console.error('Error saving word sets to local storage:', error);
    }
  }, [wordSets]);
  
  // Effect to save current word set ID to localStorage whenever it changes
  useEffect(() => {
    if (currentWordSetId) {
      try {
        localStorage.setItem(CURRENT_SET_KEY, currentWordSetId);
      } catch (error) {
        console.error('Error saving current word set ID to local storage:', error);
      }
    }
  }, [currentWordSetId]);
  
  // Get the current word set (may be undefined)
  const currentWordSet = currentWordSetId ? wordSets[currentWordSetId] : undefined;

  // Handler for adding a new word set
  const handleAddWordSet = (newWordSet: WordSet) => {
    setWordSets(prev => ({
      ...prev,
      [newWordSet.id]: newWordSet
    }));
    
    // Switch to the new word set
    setCurrentWordSetId(newWordSet.id);
    
    // Close the dialog
    setIsAddDialogOpen(false);
  };

  // Handler to delete a word set
  const handleDeleteWordSet = (id: string) => {
    if (confirm('Are you sure you want to delete this word set?')) {
      setWordSets(prev => {
        const newWordSets = { ...prev };
        delete newWordSets[id];
        return newWordSets;
      });
      
      // If we deleted the current set, select another one if available
      if (id === currentWordSetId) {
        const remainingIds = Object.keys(wordSets).filter(setId => setId !== id);
        if (remainingIds.length > 0) {
          setCurrentWordSetId(remainingIds[0]);
        } else {
          setCurrentWordSetId('');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Header 
        setCurrentView={setCurrentView} 
        currentView={currentView}
        wordSets={Object.values(wordSets)}
        currentWordSetId={currentWordSetId}
        setCurrentWordSetId={setCurrentWordSetId}
        onAddWordSetClick={() => setIsAddDialogOpen(true)}
        onDeleteWordSet={handleDeleteWordSet}
      />
      
      <main className="container mx-auto px-4 py-8">
        {hasWordSets && currentWordSet ? (
          <>
            {currentView === 'learn' ? (
              <WordList words={currentWordSet.words} />
            ) : (
              <SpellingGame words={currentWordSet.words} />
            )}
          </>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center h-64 mt-8">
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Words
            </button>
          </div>
        )}
      </main>
      
      {/* Add Word Set Dialog */}
      <AddWordSetDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddWordSet}
      />
      
      <footer className="bg-white py-4 text-center text-sm text-gray-500">
        <p>Learn2Spell</p>
      </footer>
    </div>
  )
}

export default App
