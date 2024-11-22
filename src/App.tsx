import { useState, useEffect } from 'react';
import { QueryProvider } from './providers/QueryProvider';
import { SearchBar } from './components/SearchBar';
import { StockList } from './components/StockList';
import { SplashScreen } from './components/SplashScreen';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ScrollToTop } from './components/ScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500);

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
                     ? 'bg-white/80 dark:bg-gray-800/80 shadow-lg shadow-black/[0.03] dark:shadow-black/[0.2]' 
                     : 'bg-transparent'}
                   backdrop-blur-lg backdrop-saturate-150`}
        >
          {/* Animated Border Bottom */}
          <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500
                        bg-gradient-to-r from-transparent via-light-accent/20 to-transparent
                        dark:via-blue-500/20 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Live Market Section */}
              <div className="flex items-center space-x-6">
                <motion.div 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { 
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-light-accent/10 to-transparent 
                              dark:from-white/10 rounded-lg blur opacity-0 group-hover:opacity-100 
                              transition duration-500" />
                  <div className="relative flex items-center">
                    <img 
                      src="/NDAQ_BIG.png" 
                      alt="Nasdaq Logo" 
                      className="h-8 transition-all duration-300
                              dark:brightness-0 dark:invert dark:contrast-200 dark:saturate-0
                              group-hover:brightness-110 dark:group-hover:brightness-200
                              group-active:brightness-90 dark:group-active:brightness-150"
                    />
                  </div>
                </motion.div>

                {/* Live Market Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden sm:block"
                >
                  <div className="px-3 py-1.5 bg-gradient-to-r from-green-400/10 to-green-500/5
                              dark:from-green-500/10 dark:to-green-400/5
                              rounded-full border border-green-400/20 dark:border-green-500/20
                              flex items-center space-x-2 group transition-all duration-300
                              hover:border-green-400/30 dark:hover:border-green-500/30
                              hover:scale-105 cursor-pointer">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500 
                                shadow-lg shadow-green-400/20 dark:shadow-green-500/20
                                animate-pulse group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium bg-gradient-to-r from-green-600 to-green-500 
                                 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent
                                 group-hover:from-green-500 group-hover:to-green-400">
                      Live Market
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Search Section */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 max-w-2xl mx-4"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-light-accent/5 via-light-accent/10 to-light-accent/5 
                              dark:from-blue-500/5 dark:via-blue-500/10 dark:to-blue-500/5 
                              rounded-lg blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
                  <SearchBar onSearch={setSearchQuery} />
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-light-accent/10 to-transparent 
                            dark:from-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 
                            transition duration-500" />
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
    </QueryProvider>
  );
}

export default App;
