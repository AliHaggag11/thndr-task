/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Light mode colors - matching dark theme's blue aesthetic
        light: {
          primary: '#f8fafc',    // Very light blue-gray
          secondary: '#f1f5f9',  // Light blue-gray
          accent: '#3b82f6',     // Same blue as dark mode
          surface: '#ffffff',    // Pure white for cards
        },
        // Text colors for light mode - maintaining contrast while being gentle
        'light-text': {
          primary: '#1e293b',    // Slate-800 - deeper blue-gray
          secondary: '#64748b',  // Slate-500 - medium blue-gray
        },
        // Dark mode specific colors for consistency
        dark: {
          primary: '#0f172a',    // Slate-900
          secondary: '#1e293b',  // Slate-800
          accent: '#3b82f6',     // Blue-500
          surface: '#1e293b',    // Slate-800
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

