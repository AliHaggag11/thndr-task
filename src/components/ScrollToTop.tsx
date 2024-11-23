import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isModalOpen } = useModal();
 
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full 
                    bg-white/80 dark:bg-gray-800/80 
                    backdrop-blur-lg backdrop-saturate-150
                    border border-gray-200/50 dark:border-gray-700/50
                    shadow-lg hover:shadow-xl
                    text-light-text-primary dark:text-gray-300
                    hover:text-light-accent dark:hover:text-blue-400
                    transform hover:-translate-y-1 hover:scale-110
                    transition-all duration-300 ease-out
                    group z-50
                    ${isModalOpen ? 'filter blur-sm pointer-events-none' : ''}`}
          aria-label="Scroll to top"
          disabled={isModalOpen}
        >
          <FiArrowUp className="w-5 h-5 transition-transform duration-300 
                               group-hover:animate-bounce" />
          
          {/* Hover effect */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r 
                          from-light-accent/10 to-transparent dark:from-blue-500/10 
                          opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </>
  );
}; 