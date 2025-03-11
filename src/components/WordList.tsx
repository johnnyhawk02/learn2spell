import React from 'react'
import WordCard from './WordCard'

type Word = {
  word: string
  definition: string
  rule: string
  difficulty: number
  phonetic?: string  // Now used for syllable breakdown
}

type WordListProps = {
  words: Word[]
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  // The component no longer needs to manage expansion state
  // or example sentences/tips as those are not part of the simplified cards

  // Function to highlight the letter 'y' in words
  const highlightPatternInWord = (word: string) => {
    // Simple highlighting of the letter 'y'
    const lowerWord = word.toLowerCase();
    const parts = [];
    let lastIndex = 0;
    
    // Find all instances of 'y' and highlight them
    for (let i = 0; i < lowerWord.length; i++) {
      if (lowerWord[i] === 'y') {
        // Add text before the 'y'
        if (i > lastIndex) {
          parts.push(
            <span key={`${word}-${i}-before`}>
              {word.substring(lastIndex, i)}
            </span>
          );
        }
        
        // Add the highlighted 'y'
        parts.push(
          <span 
            key={`${word}-${i}-highlight`}
            className="bg-yellow-200 font-bold px-0.5 rounded"
          >
            {word[i]}
          </span>
        );
        
        lastIndex = i + 1;
      }
    }
    
    // Add any remaining text
    if (lastIndex < word.length) {
      parts.push(
        <span key={`${word}-end`}>
          {word.substring(lastIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : word;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Minimal header with no explanatory text */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {words.map((word) => (
          <WordCard 
            key={word.word} 
            word={word}
            highlightedWord={highlightPatternInWord(word.word)}
          />
        ))}
      </div>
    </div>
  )
}

export default WordList 