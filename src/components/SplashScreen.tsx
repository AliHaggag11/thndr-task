import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { fetchStocks } from '../services/api';

export const SplashScreen = () => {
  const [initializationState, setInitializationState] = useState<{
    isInitialized: boolean;
    message: string;
    error: boolean;
  }>({
    isInitialized: false,
    message: 'Connecting to Market Data...',
    error: false
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        // First connection attempt
        setInitializationState(prev => ({
          ...prev,
          message: 'Establishing Connection...'
        }));
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test API connection
        setInitializationState(prev => ({
          ...prev,
          message: 'Connecting to Market Data...'
        }));
        await fetchStocks('', undefined);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Initialize cache
        setInitializationState(prev => ({
          ...prev,
          message: 'Initializing Market Data...'
        }));
        await new Promise(resolve => setTimeout(resolve, 700));

        // Show initialization message for a moment before completing
        await new Promise(resolve => setTimeout(resolve, 500));

        // Success state
        setInitializationState({
          isInitialized: true,
          message: 'Market Data Initialized',
          error: false
        });

        // Extended delay to ensure the success state is visible
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        setInitializationState({
          isInitialized: false,
          message: 'Failed to Initialize Market Data',
          error: true
        });
        // Add delay even for error state
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    initializeData();
  }, []);

  // Signal to parent component that initialization is complete
  useEffect(() => {
    if (initializationState.isInitialized) {
      // Notify parent after the success state has been shown
      const timer = setTimeout(() => {
        // You could emit an event or call a callback here if needed
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [initializationState.isInitialized]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 
                    flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.13),transparent_70%)]" 
        />
        {/* Secondary Gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.13),transparent_70%)]"
        />
        {/* Animated Grid with Fade Effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
        </motion.div>
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center justify-between min-h-screen w-full 
                    py-8 sm:py-0 relative">
        {/* Logo and content section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full -mt-16 sm:-mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center relative z-10"
          >
            {/* Logo Container with Enhanced Effects */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="relative"
            >
              {/* Primary Glow Effect */}
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
              
              {/* Secondary Glow with Different Animation */}
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

              {/* Tertiary Ambient Glow */}
              <motion.div
                animate={{ 
                  opacity: [0.1, 0.15, 0.1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10
                         rounded-full blur-3xl transform scale-[2]"
              />

              {/* Logo with Enhanced Shadow */}
              <img 
                src="/NDAQ_BIG.png" 
                alt="Nasdaq Logo" 
                className="w-48 sm:w-64 relative brightness-0 invert 
                         drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]
                         transition-all duration-700
                         filter contrast-150"
              />
            </motion.div>

            {/* Enhanced Loading Bar */}
            <motion.div
              initial={{ width: "4rem", opacity: 0 }}
              animate={{ width: "12rem", opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              className="relative h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent 
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

            {/* Enhanced Tagline with Gradient Text */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 text-center backdrop-blur-sm"
            >
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 
                         font-light tracking-wider text-sm">
                Exploring Markets Together
              </p>
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 
                         text-xs mt-2 font-medium">
                Real-time market data at your fingertips
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom section with Enhanced Styling */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center space-y-4 pb-16 sm:pb-20 px-4 w-full"
        >
          {/* Dynamic Status Indicator */}
          <motion.div 
            className={`flex items-center space-x-2 px-4 py-2
                     bg-gray-800/50 rounded-full 
                     backdrop-blur-xl backdrop-saturate-150
                     border ${initializationState.error 
                       ? 'border-red-500/50' 
                       : initializationState.isInitialized 
                         ? 'border-green-500/50' 
                         : 'border-gray-700/50'}
                     shadow-lg shadow-black/20
                     hover:bg-gray-800/60 transition-all duration-300`}
          >
            {!initializationState.isInitialized ? (
              <>
                <div className="flex space-x-1.5">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`w-1 h-1 rounded-full ${
                      initializationState.error ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className={`w-1 h-1 rounded-full ${
                      initializationState.error ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className={`w-1 h-1 rounded-full ${
                      initializationState.error ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium pl-1 ${
                  initializationState.error ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {initializationState.message}
                </span>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/20" 
                />
                <span className="text-xs font-medium text-green-400">
                  {initializationState.message}
                </span>
              </motion.div>
            )}
          </motion.div>
          
          {/* Developer Credit with Gradient Text */}
          <div className="px-4 py-1.5 rounded-full bg-gray-800/30 backdrop-blur-xl
                       hover:bg-gray-800/40 transition-colors duration-300">
            <p className="text-gray-400 text-sm font-light">
              Developed by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 font-medium">
                Ali Haggag
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 