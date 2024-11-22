import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed sm:bottom-8 sm:right-8 bottom-6 right-6 z-50
                    sm:p-4 p-3 rounded-xl
                    bg-white/80 dark:bg-gray-800/80 
                    backdrop-blur-md
                    border border-gray-200/50 dark:border-gray-700/50
                    shadow-lg hover:shadow-xl
                    transform hover:-translate-y-1
                    transition-all duration-300 ease-out
                    group"
          aria-label="Scroll to top"
        >
          <FiArrowUp 
            className={`sm:w-5 sm:h-5 w-4 h-4 transition-all duration-300
                     ${isHovered 
                       ? 'text-light-accent dark:text-blue-400 transform -translate-y-0.5' 
                       : 'text-light-text-primary dark:text-gray-300'}`}
          />
          
          {/* Subtle gradient hover effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t 
                       from-light-accent/5 via-transparent to-transparent
                       dark:from-blue-500/5 
                       opacity-0 group-hover:opacity-100 
                       transition-opacity duration-300" />
        </button>
      )}
    </>
  );
}; 