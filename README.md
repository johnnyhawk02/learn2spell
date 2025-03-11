# Learn2Spell

A modern, interactive web application designed to help children learn spelling rules through engaging activities and visual aids.

## About Learn2Spell

Learn2Spell is a kid-friendly web application that helps children master spelling rules through interactive learning and practice. The app focuses on teaching specific spelling patterns with visual cues, memory tips, example sentences, and fun practice activities.

### Current Focus

The current version focuses on teaching words with the **/I/ sound spelled with 'y'** (not at the end of words), including:

- oxygen
- lyric
- system
- syrup
- physical
- crypt
- crystal
- cymbal
- typical

## Features

- **Word Learning Mode**: Interactive cards that break down each word, highlighting key spelling patterns
- **Memory Tips**: AI-generated memory aids to help remember spelling patterns
- **Example Sentences**: Contextual examples showing how each word is used
- **Pronunciation**: Audio playback of each word
- **Practice Mode**: Interactive spelling game with hints and feedback
- **Visual Cues**: Color-coded letters to highlight spelling patterns
- **Responsive Design**: Works on desktops, tablets, and mobile devices

## Technical Details

This project is built with modern web technologies:

- **React**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **Vite**: For fast development and building
- **Google's Generative AI (Gemini)**: For generating example sentences and memory tips

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/learn2spell.git
   cd learn2spell
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Add your Google Generative AI API key if you want to use Gemini features

4. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Future Enhancements

- Add more spelling rules and word sets
- Implement user accounts to track progress
- Add more interactive games and exercises
- Incorporate spaced repetition for better retention
- Add animations and sound effects for more engagement
- Implement difficulty levels for different age groups

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to teachers and educational experts for guidance on effective spelling instruction
- Thanks to the React and TypeScript communities for excellent documentation and tools
