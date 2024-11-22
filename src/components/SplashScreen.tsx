import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const SplashScreen = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 3000);

    return () => {
      clearTimeout(initTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 
                    flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_70%)]" 
        />
        {/* Secondary Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_70%)]"
        />
        {/* Animated Dots Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
      </div>

      {/* Main content container - Added padding bottom for mobile */}
      <div className="flex flex-col items-center justify-between w-full h-full 
                    py-12 sm:py-0 relative">
        {/* Logo and content section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center relative z-10"
          >
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="relative"
            >
              {/* Enhanced Glowing Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.2, 0.3] 
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-blue-500/20
                         rounded-full blur-2xl transform scale-150"
              />
              
              {/* Secondary Glow */}
              <motion.div
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.3, 0.2] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10
                         rounded-full blur-3xl transform scale-150"
              />

              {/* Logo */}
              <img 
                src="/NDAQ_BIG.png" 
                alt="Nasdaq Logo" 
                className="w-48 sm:w-64 relative brightness-0 invert 
                         drop-shadow-2xl transition-all duration-700
                         filter contrast-150"
              />
            </motion.div>

            {/* Enhanced Loading Bar */}
            <motion.div
              initial={{ width: "4rem", opacity: 0 }}
              animate={{ width: "12rem", opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              className="relative h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent 
                       rounded-full mt-12 overflow-hidden backdrop-blur-sm"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent
                         opacity-75"
              />
            </motion.div>

            {/* Enhanced Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 text-center backdrop-blur-sm"
            >
              <p className="text-gray-200 font-light tracking-wider text-sm">
                Exploring Markets Together
              </p>
              <p className="text-blue-400 text-xs mt-1 font-medium">
                Real-time market data at your fingertips
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom section - Adjusted positioning for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center space-y-3 mt-auto 
                   pb-8 sm:pb-12 px-4 w-full"
        >
          {/* Status Indicator */}
          <motion.div 
            className="flex items-center space-x-2 px-4 py-2
                     bg-gray-800/50 rounded-full 
                     backdrop-blur-sm border border-gray-700/50
                     shadow-lg shadow-black/20"
          >
            {!isInitialized ? (
              <>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-150" />
                </div>
                <span className="text-xs font-medium text-gray-300">
                  Initializing Market Data
                </span>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-300">
                  Market Data Initialized
                </span>
              </motion.div>
            )}
          </motion.div>
          
          {/* Developer Credit */}
          <div className="px-4 py-1.5 rounded-full bg-gray-800/30 backdrop-blur-sm">
            <p className="text-gray-400 text-sm font-light">
              Developed by{' '}
              <span className="text-blue-400 font-medium">
                Ali Haggag
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 