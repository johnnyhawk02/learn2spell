# Vite + React + Tailwind CSS

This project is a modern web application built with:
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

## Features

- ⚡️ Lightning fast development with Vite
- 🔥 Hot Module Replacement
- 📦 Optimized production build
- 🎨 Tailwind CSS for rapid UI development
- 💪 TypeScript support

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v7.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-name>
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173/

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customizing Tailwind

You can customize Tailwind by editing the `tailwind.config.js` file. Refer to the [Tailwind documentation](https://tailwindcss.com/docs/configuration) for more details.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Project assets (images, fonts, etc.)
│   ├── App.tsx          # Main App component
│   ├── index.css        # CSS with Tailwind directives
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```
