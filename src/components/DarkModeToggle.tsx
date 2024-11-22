import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2.5 rounded-xl bg-light-secondary/30 dark:bg-gray-700/50
                hover:bg-light-secondary/50 dark:hover:bg-gray-700/80
                border border-gray-200/50 dark:border-gray-600/50
                group transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-blue-500/30"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <FiSun className="w-5 h-5 text-amber-400 transform transition-transform 
                         group-hover:rotate-90 group-hover:scale-110" />
      ) : (
        <FiMoon className="w-5 h-5 text-light-text-primary dark:text-gray-300 transform transition-transform 
                          group-hover:-rotate-12 group-hover:scale-110" />
      )}
      
      {/* Hover effect */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-light-accent/10 to-transparent 
                    dark:from-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}; 