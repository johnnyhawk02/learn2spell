# Vite + React + Tailwind CSS v4 Starter

![Vite](https://img.shields.io/badge/Vite-v6.2.1-blue)
![React](https://img.shields.io/badge/React-v19.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0.12-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.2-blue)

A modern, ready-to-use starter template featuring the latest versions of Vite, React, and Tailwind CSS v4.

## ✨ Features

- ⚡️ **Vite 6** - Super-fast development and build
- 🔄 **React 19** - The latest React features
- 🎨 **Tailwind CSS v4** - With proper PostCSS plugin setup
- 📝 **TypeScript** - Type-safe code
- 🧹 **ESLint** - Code quality tools
- 🔧 **Configuration Files** - Pre-configured for immediate use
- 🎯 **React Fast Refresh** - Instant feedback during development
- 📦 **Production Optimizations** - Minification and tree-shaking

## 🚀 Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm v7.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/vite-react-tailwind-starter.git my-project
cd my-project
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npx vite
```

> ⚠️ **Note:** Using `npx vite` directly is recommended over `npm run dev` to avoid potential module loading issues.

Your app will be available at http://localhost:5173/

### Build for Production

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🧩 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and other assets
│   ├── App.tsx          # Main App component
│   ├── index.css        # CSS with Tailwind directives
│   └── main.tsx         # Entry point
├── docs/                # Documentation files
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration (includes @tailwindcss/postcss)
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## ⚙️ Configuration

### Tailwind CSS v4

This template uses Tailwind CSS v4, which has a significant change in how it integrates with PostCSS. The PostCSS plugin is now in a separate package:

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // New package for Tailwind CSS v4
    autoprefixer: {},
  },
}
```

### Custom Animations

The template includes a custom slow-spin animation for the React logo in the `tailwind.config.js`:

```javascript
theme: {
  extend: {
    animation: {
      'spin-slow': 'spin 20s linear infinite',
    },
  },
},
```

## 🔍 Troubleshooting

### Running the Development Server

If you encounter issues with `npm run dev`, such as:

```
SyntaxError: Cannot use import statement outside a module
```

Use `npx vite` directly instead. This is due to how Vite's ES modules are loaded.

### Tailwind CSS Classes Not Applying

If Tailwind classes aren't working:

1. Make sure your `postcss.config.js` is using `@tailwindcss/postcss` (not `tailwindcss`)
2. Verify your `index.css` includes the proper Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📚 Documentation

This project includes:

1. **Basic documentation** in the README
2. **Detailed guides** in the [`/docs`](./docs) directory
3. **Component examples** in the source code

For more comprehensive documentation, you can set up a documentation website:

### Setting Up VitePress Documentation

```bash
# Install VitePress
npm install -D vitepress

# Create docs directory
mkdir -p docs-site

# Initialize VitePress
npx vitepress init
```

Follow the prompts to set up your documentation site, then update your package.json:

```json
"scripts": {
  // ... existing scripts
  "docs:dev": "vitepress dev docs-site",
  "docs:build": "vitepress build docs-site",
  "docs:preview": "vitepress preview docs-site"
}
```

Run the documentation site:

```bash
npm run docs:dev
```

### Alternative: Using Docusaurus

```bash
# Install Docusaurus
npx create-docusaurus@latest docs-site classic

# Start the documentation site
cd docs-site
npm start
```

## 🛠️ Extending This Starter

### Adding New Dependencies

```bash
npm install package-name
```

### Adding New Pages

Create new components in the `src` directory and import them in your app:

```jsx
// src/pages/About.tsx
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Page</h1>
      <p>This is the about page content.</p>
    </div>
  );
}
```

### Setting Up Routing

Install React Router:

```bash
npm install react-router-dom
```

Configure routes in your `App.tsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

Made with ❤️ by [Your Name]
