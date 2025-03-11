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

  // Function that no longer highlights any letters
  const highlightPatternInWord = (word: string) => {
    // Return the word as is without highlighting
    return word;
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