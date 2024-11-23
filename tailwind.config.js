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
        light: {
          primary: '#f3f4f8',    
          secondary: '#e8eaf2',  
          accent: '#4f46e5',     
          surface: '#eef0f5',    
          card: 'rgba(243,244,248,0.7)', 
        },
        'light-text': {
          primary: '#2c3242',    
          secondary: '#5a6377',  
        },
        dark: {
          primary: '#0f172a',    
          secondary: '#1e293b',  
          accent: '#4f46e5',     
          surface: '#1e293b',    
          card: 'rgba(30, 41, 59, 0.7)', 
        },
        gradient: {
          start: '#4f46e5',      
          middle: '#6366f1',     
          end: '#818cf8',        
        }
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      let allColors = {};
      const colors = theme('colors');
      
      // Manually flatten the color palette
      Object.entries(colors).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, color]) => {
            allColors[`${key}-${subKey}`] = color;
          });
        } else {
          allColors[key] = value;
        }
      });

      const colorVariables = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
      );

      addBase({
        ':root': colorVariables,
      });
    },
  ],
};

