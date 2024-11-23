import { useCallback, useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-bar relative flex items-center w-full">
      {/* Enhanced Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? 0.7 : 0 }}
        className="absolute -inset-0.5 bg-gradient-to-r from-light-accent/20 via-light-accent/10 to-transparent 
                dark:from-blue-500/20 dark:via-blue-500/10 dark:to-transparent 
                rounded-xl blur-md transition-opacity duration-300"
      />

      {/* Main Container */}
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <div className="absolute left-3 sm:left-4 z-10">
          <FiSearch 
            className={`w-4 h-4 transition-all duration-300
                     ${isFocused 
                       ? 'text-light-accent dark:text-blue-400 transform scale-110' 
                       : 'text-light-text-secondary dark:text-gray-400'}`}
          />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          placeholder="Search stocks..."
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-9 sm:pl-11 pr-16 sm:pr-20 py-2.5 
                  bg-white/80 dark:bg-gray-900/50
                  backdrop-blur-md backdrop-saturate-150
                  border border-gray-200/50 dark:border-gray-700/50 
                  rounded-xl
                  text-sm sm:text-base
                  text-light-text-primary dark:text-white 
                  placeholder:text-light-text-secondary/70 dark:placeholder:text-gray-400/70
                  focus:outline-none focus:border-light-accent/30 dark:focus:border-blue-500/30
                  group-hover:border-light-accent/20 dark:group-hover:border-blue-500/20
                  transition-all duration-300
                  group-hover:bg-white/90 dark:group-hover:bg-gray-900/70
                  shadow-sm hover:shadow-md"
        />

        {/* Clear Button with Enhanced Animation */}
        <AnimatePresence>
          {searchValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearSearch}
              className="absolute right-10 sm:right-12 p-1.5 rounded-full
                      bg-gray-100/80 dark:bg-gray-800/80
                      hover:bg-light-accent/10 dark:hover:bg-blue-500/10
                      text-light-text-secondary dark:text-gray-400
                      hover:text-light-accent dark:hover:text-blue-400
                      transition-all duration-300
                      backdrop-blur-sm"
            >
              <FiX className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcut Hint */}
        <div className="absolute right-3 flex items-center space-x-1 pointer-events-none">
          <kbd className={`hidden sm:flex items-center space-x-1 px-1.5 py-0.5 text-[10px] rounded border
                      ${isFocused ? 'opacity-0' : 'opacity-40 group-hover:opacity-60'}
                      bg-gray-100/50 dark:bg-gray-800/50
                      border-gray-200/50 dark:border-gray-700/50
                      text-light-text-secondary/70 dark:text-gray-400/70
                      transition-opacity duration-300`}>
            <span className="font-sans">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</span>
            <span className="font-sans">K</span>
          </kbd>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-2 right-2 h-[2px] overflow-hidden rounded-full">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-transparent via-light-accent/50 to-transparent
                    dark:via-blue-500/50 transform origin-left"
          />
        </div>
      </div>
    </div>
  );
}; 