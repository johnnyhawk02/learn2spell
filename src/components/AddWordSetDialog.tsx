import React, { useState } from 'react'
import { generateDefinitionsForWords, WordDefinition } from '../utils/geminiService'
import { v4 as uuidv4 } from 'uuid'

// Word type matches our existing Word interface
type Word = {
  word: string
  definition: string
  rule: string
  difficulty: number
  phonetic?: string  // Adding phonetic breakdown field
}

// WordSet type matches our existing WordSet interface
type WordSet = {
  id: string
  title: string
  description: string
  words: Word[]
}

type AddWordSetDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (wordSet: WordSet) => void
}

const AddWordSetDialog: React.FC<AddWordSetDialogProps> = ({ isOpen, onClose, onSave }) => {
  const [wordInput, setWordInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Function to get formatted date for the word set name
  const getFormattedDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  // Function to handle word list generation
  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setErrorMessage('')
      
      // Parse the comma-separated word list
      const words = wordInput.split(',')
        .map(word => word.trim())
        .filter(word => word.length > 0)
      
      if (words.length === 0) {
        setErrorMessage('Please enter at least one word (comma-separated)')
        setIsGenerating(false)
        return
      }
      
      // Generate definitions for all words
      const generatedData = await generateDefinitionsForWords(words)
      
      // Create word objects with definitions and metadata
      const newWords = generatedData.map((item: WordDefinition, index: number) => ({
        word: words[index],
        definition: item.definition,
        rule: item.rule || "Words with the /I/ Sound Spelled with 'y'",
        difficulty: item.difficulty || 1,
        phonetic: item.phonetic || '' // Including the phonetic breakdown
      }))
      
      // Create title from the first 20 characters of the word list
      const titleWords = words.join(', ')
      const titlePrefix = titleWords.length > 20 
        ? titleWords.substring(0, 20) + '...' 
        : titleWords
      
      // Create a new word set with title from words
      const newWordSet: WordSet = {
        id: uuidv4(),
        title: titlePrefix,
        description: `A collection of ${words.length} words auto-generated with AI.`,
        words: newWords
      }
      
      // Save the word set
      onSave(newWordSet)
      
      // Reset form
      setWordInput('')
      setErrorMessage('')
      
    } catch (error) {
      console.error('Error generating word set:', error)
      
      if (error instanceof Error) {
        setErrorMessage(`Generation failed: ${error.message}`)
      } else {
        setErrorMessage('An unexpected error occurred during generation.')
      }
    } finally {
      setIsGenerating(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-purple-800">
              Add Words
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Enter a list of words separated by commas. Our AI will automatically generate British English definitions (without using the word itself), and create a word set with the title derived from your word list.
          </p>
          
          <div className="mb-6">
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter words separated by commas, e.g.: system, crystal, myth, symbol, oxygen"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
            />
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !wordInput.trim()}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                isGenerating || !wordInput.trim()
                  ? 'bg-purple-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : 'Generate Word Set'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddWordSetDialog 