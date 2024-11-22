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
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Light mode colors - much softer, more muted palette
        light: {
          primary: '#f0f1f5',    // Even softer blue-gray
          secondary: '#e5e7eb',  // Muted gray
          accent: '#4f46e5',     // Indigo that works in both modes
          surface: '#f5f6f9',    // Very subtle blue-gray tint
          card: 'rgba(248,249,252,0.7)', // More muted translucent card
        },
        // Text colors for light mode - softer contrast
        'light-text': {
          primary: '#374151',    // Softer dark blue-gray
          secondary: '#6b7280',  // Very muted text
        },
        // Dark mode colors - maintaining existing scheme
        dark: {
          primary: '#0f172a',    // Slate-900
          secondary: '#1e293b',  // Slate-800
          accent: '#4f46e5',     // Matching indigo
          surface: '#1e293b',    // Slate-800
          card: 'rgba(30, 41, 59, 0.7)', // Translucent slate
        },
        // Shared gradient colors - more muted
        gradient: {
          start: '#4f46e5',      // Indigo
          middle: '#6366f1',     // Lighter indigo
          end: '#818cf8',        // Even lighter indigo
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-light': 'linear-gradient(180deg, rgba(248, 249, 252, 0.06) 0%, rgba(248, 249, 252, 0) 100%)',
        'glass-dark': 'linear-gradient(180deg, rgba(30, 41, 59, 0.08) 0%, rgba(30, 41, 59, 0) 100%)',
      },
      boxShadow: {
        'glass-light': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'glass-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
      opacity: {
        '15': '0.15',
        '85': '0.85',
      }
    },
  },
  plugins: [],
}

