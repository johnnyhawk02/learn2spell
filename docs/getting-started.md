# Getting Started with Vite + React + Tailwind CSS v4

This guide will walk you through the basic setup and usage of this starter template.

## Installation

Make sure you have Node.js v18.0.0 or higher and npm v7.0.0 or higher installed.

1. Clone the repository:
```bash
git clone https://github.com/your-username/vite-react-tailwind-starter.git my-project
cd my-project
```

2. Install dependencies:
```bash
npm install
```

## Development Workflow

### Starting the Development Server

Use the following command to start the development server:
```bash
npx vite
```

This will start the development server at http://localhost:5173/ (or another port if 5173 is already in use).

### Making Changes

1. **Edit React Components**: Modify files in the `src` directory
2. **Add Styling**: Use Tailwind CSS classes directly in your JSX
3. **See Changes Live**: The development server includes hot module replacement

### Building for Production

When you're ready to deploy your application:
```bash
npm run build
```

This creates optimized files in the `dist` directory, which you can then deploy to any static hosting service.

## Project Organization

### Key Files and Directories

- **src/App.tsx**: The main React component
- **src/index.css**: Contains Tailwind directives
- **tailwind.config.js**: Configure Tailwind settings
- **postcss.config.js**: PostCSS configuration
- **index.html**: HTML template

### Adding New Components

Create new component files in the `src` directory:

```jsx
// src/components/Button.tsx
export default function Button({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}
```

Import and use in your app:

```jsx
import Button from './components/Button';

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
    </div>
  );
}
```

## Next Steps

- Add routing with [React Router](https://reactrouter.com/)
- Integrate a state management solution
- Set up testing with Vitest or Jest
- Add form handling with libraries like Formik or React Hook Form 