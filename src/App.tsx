import { useState, useEffect } from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { SearchBar } from './components/SearchBar';
import { StockList } from './components/StockList';
import { SplashScreen } from './components/SplashScreen';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ScrollToTop } from './components/ScrollToTop';
import { LiveMarket } from './components/LiveMarket';
import { motion } from 'framer-motion';
import { ModalProvider } from './context/ModalContext';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryProvider>
      <ModalProvider>
        <div className="min-h-screen bg-gradient-to-br from-light-primary via-white to-light-primary 
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          {/* Background Patterns */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05] bg-repeat" />
            <div className="absolute inset-0 bg-gradient-to-br from-light-accent/[0.02] via-transparent to-transparent 
                         dark:from-blue-500/[0.02] dark:via-transparent dark:to-transparent" />
          </div>

          {/* Enhanced Topbar */}
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed w-full top-0 z-50 transition-all duration-500
                     ${isScrolled 
                       ? 'bg-white/90 dark:bg-gray-800/90 shadow-lg shadow-black/[0.03] dark:shadow-black/[0.2]' 
                       : 'bg-transparent'}
                     backdrop-blur-xl backdrop-saturate-150`}
          >
            {/* Enhanced Animated Border Bottom */}
            <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500
                          bg-gradient-to-r from-transparent via-light-accent/30 to-transparent
                          dark:via-blue-500/30 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16 sm:h-20">
                {/* Logo and Live Market Section */}
                <div className="flex items-center space-x-4 sm:space-x-8">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute -inset-3 bg-gradient-to-r from-light-accent/10 via-light-accent/5 to-transparent 
                                 dark:from-blue-500/10 dark:via-blue-500/5 rounded-xl blur opacity-0 
                                 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative">
                      {/* Small Logo for Mobile */}
                      <img 
                        src="/NDAQ.png" 
                        alt="Nasdaq Logo" 
                        className="h-7 sm:hidden transition-all duration-300
                               dark:brightness-0 dark:invert dark:contrast-200
                               group-hover:brightness-110 dark:group-hover:brightness-200"
                      />
                      {/* Large Logo for Desktop */}
                      <img 
                        src="/NDAQ_BIG.png" 
                        alt="Nasdaq Logo" 
                        className="h-9 hidden sm:block transition-all duration-300
                               dark:brightness-0 dark:invert dark:contrast-200
                               group-hover:brightness-110 dark:group-hover:brightness-200"
                      />
                    </div>
                  </motion.div>

                  {/* Enhanced Live Market Component */}
                  <LiveMarket />
                </div>

                {/* Enhanced Search Section with adjusted width */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 max-w-3xl mx-4 sm:mx-6"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-light-accent/5 via-light-accent/10 to-light-accent/5 
                                 dark:from-blue-500/5 dark:via-blue-500/10 dark:to-blue-500/5 
                                 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <SearchBar onSearch={setSearchQuery} />
                  </div>
                </motion.div>

                {/* Enhanced Theme Toggle */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative group ml-2"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-light-accent/10 via-light-accent/5 to-transparent 
                               dark:from-blue-500/10 dark:via-blue-500/5 rounded-xl blur opacity-0 
                               group-hover:opacity-100 transition-opacity" />
                  <DarkModeToggle />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto pt-20"
          >
            <StockList searchQuery={searchQuery} />
          </motion.div>

          <ScrollToTop />
        </div>
      </ModalProvider>
    </QueryProvider>
  );
}

export default App;
