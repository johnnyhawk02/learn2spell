# Tailwind CSS v4 Usage Guide

This guide provides detailed information on using Tailwind CSS v4 in this starter project.

## Key Differences in Tailwind CSS v4

Tailwind CSS v4 introduces several changes from previous versions, including:

1. **Separate PostCSS Plugin**: The PostCSS plugin is now in a separate package (`@tailwindcss/postcss`)
2. **Updated API**: Some API changes in configuration and plugin usage
3. **Performance Improvements**: Faster build times and smaller bundle sizes
4. **New Features**: Including new utilities and configuration options

## Basic Usage

### Adding Classes

Tailwind is a utility-first CSS framework. You add classes directly to your HTML or JSX:

```jsx
<div className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
  <h2 className="text-xl font-bold text-gray-800">Card Title</h2>
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click Me
  </button>
</div>
```

### Responsive Design

Tailwind uses a mobile-first approach with responsive prefixes:

```jsx
<div className="text-center sm:text-left md:text-right">
  <!-- Mobile: centered, Small screens: left-aligned, Medium screens: right-aligned -->
</div>
```

Common breakpoints:
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### States and Variants

Tailwind provides prefixes for different states:

```jsx
<button className="bg-blue-500 hover:bg-blue-700 focus:ring focus:ring-blue-300 active:bg-blue-800">
  <!-- Different styles for hover, focus, and active states -->
</button>
```

## Customization

### Tailwind Configuration

The `tailwind.config.js` file is where you customize your Tailwind installation:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': '#ff0000',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Custom Utilities

You can create your own utilities by extending the configuration:

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      textShadow: {
        'default': '0 2px 5px rgba(0, 0, 0, 0.5)',
        'lg': '0 2px 10px rgba(0, 0, 0, 0.5)',
      },
    }
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: theme('textShadow.default'),
        },
        '.text-shadow-lg': {
          textShadow: theme('textShadow.lg'),
        },
      }
      addUtilities(newUtilities)
    }
  ]
}
```

## Best Practices

### Organization

1. **Component-Based Organization**: Keep related styles together with components
2. **Extract Components**: For repeated patterns, create reusable components
3. **Avoid Global CSS**: Use Tailwind's utility classes instead of global CSS when possible

### Performance

1. **Purge Unused CSS**: Tailwind automatically removes unused CSS in production builds
2. **Use the JIT Mode**: Just-in-Time mode is enabled by default in v4
3. **Avoid Large Custom Utilities**: Large custom utilities can increase bundle size

### Consistent Design

1. **Use Theme Variables**: Use values from your theme for consistency
2. **Create Design Tokens**: Define colors, spacing, etc. in the Tailwind config
3. **Document Your Patterns**: Keep a record of common UI patterns

## Learning Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Awesome Tailwind CSS](https://github.com/aniftyco/awesome-tailwindcss)
- [Tailwind UI](https://tailwindui.com/) (Premium components) 