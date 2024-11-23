import { FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface HelpButtonProps {
  onStartTour: () => void;
}

export const HelpButton = ({ onStartTour }: HelpButtonProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onClick={onStartTour}
      className="fixed bottom-8 left-8 p-3 rounded-full 
                bg-white/80 dark:bg-gray-800/80 
                backdrop-blur-lg backdrop-saturate-150
                border border-gray-200/50 dark:border-gray-700/50
                shadow-lg hover:shadow-xl
                text-light-text-primary dark:text-gray-300
                hover:text-light-accent dark:hover:text-blue-400
                transform hover:-translate-y-1 hover:scale-110
                transition-all duration-300 ease-out
                group z-[50]
                env(safe-area-inset-bottom, 24px)
                env(safe-area-inset-left, 24px)"
      aria-label="Show help tour"
    >
      <FiHelpCircle className="w-5 h-5 transition-transform duration-300 
                            group-hover:rotate-12" />
      
      {/* Hover effect */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r 
                    from-light-accent/10 to-transparent dark:from-blue-500/10 
                    opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}; 