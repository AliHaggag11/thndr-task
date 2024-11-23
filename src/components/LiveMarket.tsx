import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MarketState {
  status: string;
  nextEvent: string;
  timeUntil: string;
  statusColor: {
    bg: string;
    border: string;
    dot: string;
    text: string;
  };
}

export const LiveMarket = () => {
  const [marketState, setMarketState] = useState<MarketState>({
    status: 'Market Closed',
    nextEvent: 'Opens',
    timeUntil: '9:30 AM ET',
    statusColor: {
      bg: 'from-red-400/5 to-red-500/5 dark:from-red-500/5 dark:to-red-600/5',
      border: 'border-red-400/20 dark:border-red-500/20',
      dot: 'bg-red-500 dark:bg-red-400',
      text: 'from-red-500 to-red-400 dark:from-red-400 dark:to-red-300'
    }
  });

  const getNextMarketOpen = (nyTime: Date): Date => {
    const nextOpen = new Date(nyTime);
    nextOpen.setHours(9, 30, 0, 0);
    
    // If it's past market open time today, move to next day
    if (nyTime.getHours() >= 9 && nyTime.getMinutes() >= 30) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    // If it's weekend, move to Monday
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    return nextOpen;
  };

  const formatTimeUntil = (targetTime: Date, now: Date): string => {
    const diffMs = targetTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24);
      return `in ${days} ${days === 1 ? 'day' : 'days'}`;
    }
    
    if (diffHrs > 0) {
      return `in ${diffHrs}h ${diffMins}m`;
    }
    
    return `in ${diffMins}m`;
  };

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = nyTime.getDay();
      const hour = nyTime.getHours();
      const minutes = nyTime.getMinutes();
      const currentTime = hour * 60 + minutes;
      
      const marketOpen = 9 * 60 + 30;
      const marketClose = 16 * 60;
      const nextOpenTime = getNextMarketOpen(nyTime);

      // Holiday check (basic implementation - expand as needed)
      const isHoliday = false; // Add holiday check logic here

      if (isHoliday) {
        setMarketState({
          status: 'Holiday',
          nextEvent: 'Opens',
          timeUntil: formatTimeUntil(nextOpenTime, now),
          statusColor: {
            bg: 'from-rose-400/5 to-rose-500/5 dark:from-rose-500/5 dark:to-rose-600/5',
            border: 'border-rose-400/20 dark:border-rose-500/20',
            dot: 'bg-rose-500 dark:bg-rose-400',
            text: 'from-rose-500 to-rose-400 dark:from-rose-400 dark:to-rose-300'
          }
        });
      }
      // Weekend check
      else if (day === 0 || day === 6) {
        setMarketState({
          status: 'Weekend',
          nextEvent: 'Opens',
          timeUntil: formatTimeUntil(nextOpenTime, now),
          statusColor: {
            bg: 'from-indigo-400/5 to-indigo-500/5 dark:from-indigo-500/5 dark:to-indigo-600/5',
            border: 'border-indigo-400/20 dark:border-indigo-500/20',
            dot: 'bg-indigo-500 dark:bg-indigo-400',
            text: 'from-indigo-500 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300'
          }
        });
      }
      // Regular trading day checks
      else if (currentTime >= marketOpen && currentTime < marketClose) {
        const closeTime = new Date(nyTime);
        closeTime.setHours(16, 0, 0, 0);
        
        setMarketState({
          status: 'Market Open',
          nextEvent: 'Closes',
          timeUntil: formatTimeUntil(closeTime, now),
          statusColor: {
            bg: 'from-green-400/5 to-green-500/5 dark:from-green-500/5 dark:to-green-600/5',
            border: 'border-green-400/20 dark:border-green-500/20',
            dot: 'bg-green-500 dark:bg-green-400',
            text: 'from-green-500 to-green-400 dark:from-green-400 dark:to-green-300'
          }
        });
      } else if (currentTime < marketOpen) {
        setMarketState({
          status: 'Pre-Market',
          nextEvent: 'Opens',
          timeUntil: formatTimeUntil(nextOpenTime, now),
          statusColor: {
            bg: 'from-yellow-400/5 to-yellow-500/5 dark:from-yellow-500/5 dark:to-yellow-600/5',
            border: 'border-yellow-400/20 dark:border-yellow-500/20',
            dot: 'bg-yellow-500 dark:bg-yellow-400',
            text: 'from-yellow-500 to-yellow-400 dark:from-yellow-400 dark:to-yellow-300'
          }
        });
      } else {
        setMarketState({
          status: 'After Hours',
          nextEvent: 'Opens',
          timeUntil: formatTimeUntil(nextOpenTime, now),
          statusColor: {
            bg: 'from-purple-400/5 to-purple-500/5 dark:from-purple-500/5 dark:to-purple-600/5',
            border: 'border-purple-400/20 dark:border-purple-500/20',
            dot: 'bg-purple-500 dark:bg-purple-400',
            text: 'from-purple-500 to-purple-400 dark:from-purple-400 dark:to-purple-300'
          }
        });
      }
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="hidden sm:block relative group market-status"
    >
      <div className={`relative px-3 py-1.5 
                    bg-gradient-to-r ${marketState.statusColor.bg}
                    rounded-full border ${marketState.statusColor.border}
                    flex items-center space-x-2 
                    transition-all duration-300
                    hover:shadow-md hover:scale-[1.02]
                    cursor-help`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/[0.05] to-white/0 
                     dark:from-white/0 dark:via-white/[0.03] dark:to-white/0
                     opacity-0 group-hover:opacity-100 
                     blur-sm transition-opacity duration-500" />
        
        {/* Status Dot with Enhanced Animation */}
        <div className={`relative w-1.5 h-1.5 rounded-full ${marketState.statusColor.dot}
                      shadow-lg group-hover:shadow-xl
                      animate-pulse group-hover:animate-none
                      group-hover:scale-110 transition-all duration-300`} 
        >
          {/* Enhanced Dot Glow Effect */}
          <div className={`absolute inset-0 rounded-full ${marketState.statusColor.dot}
                        opacity-50 blur-sm group-hover:blur-md
                        transition-all duration-300
                        animate-ping`} />
        </div>

        {/* Text Content */}
        <div className="flex flex-col relative">
          <span className={`text-xs font-medium leading-none 
                        bg-gradient-to-r ${marketState.statusColor.text} 
                        bg-clip-text text-transparent
                        group-hover:scale-[1.02] transition-transform duration-300`}
          >
            {marketState.status}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium
                        group-hover:text-gray-600 dark:group-hover:text-gray-300
                        transition-colors duration-300">
            {marketState.nextEvent} {marketState.timeUntil}
          </span>
        </div>

        {/* Enhanced Tooltip */}
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2
                     pointer-events-none opacity-0 group-hover:opacity-100
                     transition-all duration-200 z-50">
          <motion.div
            initial={false}
            animate={{ y: [10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.2 }}
            className="relative px-3 py-2 rounded-lg text-xs
                    bg-white dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    shadow-lg"
          >
            <div className="text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium">
              Current NY Time: {new Date().toLocaleTimeString('en-US', { 
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
              })}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2
                         w-3 h-3 bg-white dark:bg-gray-800 
                         border-l border-t border-gray-200 dark:border-gray-700
                         transform -rotate-45" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 