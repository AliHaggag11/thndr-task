import { useState, useEffect, useRef } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

export const DarkModeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    
    const savedTheme = localStorage.getItem('theme') as Theme;
    const isDarkClass = document.documentElement.classList.contains('dark');
    
    if (!savedTheme) {
      return isDarkClass ? 'dark' : 'light';
    }
    
    if (savedTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return savedTheme;
  });

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (!savedTheme) {
      setTheme(isDarkClass ? 'dark' : 'light');
      localStorage.setItem('theme', isDarkClass ? 'dark' : 'light');
    } else if (savedTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark !== isDarkClass) {
        isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
      }
      setTheme('system');
    } else {
      if ((savedTheme === 'dark') !== isDarkClass) {
        savedTheme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
      }
      setTheme(savedTheme);
    }
  }, []);

  const updateTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    } else {
      localStorage.setItem('theme', newTheme);
      newTheme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    }
    setTheme(newTheme);
    setIsOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return <FiSun className="w-[18px] h-[18px]" />;
      case 'dark':
        return <FiMoon className="w-[18px] h-[18px]" />;
      case 'system':
        return <FiMonitor className="w-[18px] h-[18px]" />;
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl
                bg-light-secondary/30 dark:bg-gray-700/50
                hover:bg-light-secondary/50 dark:hover:bg-gray-700/80
                border border-gray-200/50 dark:border-gray-600/50
                group transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-light-accent/30 dark:focus:ring-blue-500/30"
        aria-label="Toggle theme"
      >
        <div className={`transition-colors duration-200
                      ${theme === 'light' 
                        ? 'text-amber-500' 
                        : theme === 'dark' 
                          ? 'text-blue-400'
                          : 'text-light-text-primary dark:text-gray-300'}`}
        >
          {getCurrentIcon()}
        </div>
        
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-light-accent/10 to-transparent 
                      dark:from-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 p-1 w-40 rounded-xl
                    bg-white/90 dark:bg-gray-800/90
                    shadow-lg border border-gray-200/50 dark:border-gray-700/50
                    backdrop-blur-xl backdrop-saturate-150"
          >
            {[
              { value: 'dark', icon: FiMoon, label: 'Dark' },
              { value: 'light', icon: FiSun, label: 'Light' },
              { value: 'system', icon: FiMonitor, label: 'System' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateTheme(value as Theme)}
                className={`w-full flex items-center px-3 py-2 rounded-lg gap-3
                         transition-colors duration-200
                         ${theme === value 
                           ? 'bg-light-accent/10 dark:bg-blue-500/10 text-light-accent dark:text-blue-400' 
                           : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-light-text-primary dark:text-gray-300'}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 