import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const LiveMarket = () => {
  const [marketState, setMarketState] = useState<{
    isOpen: boolean;
    status: string;
    nextEvent: string;
    timeUntil: string;
    statusColor: {
      bg: string;
      text: string;
      border: string;
      dot: string;
    };
  }>({
    isOpen: false,
    status: 'Checking market status...',
    nextEvent: '',
    timeUntil: '',
    statusColor: {
      bg: 'from-gray-400/10 to-gray-500/5 dark:from-gray-500/10 dark:to-gray-400/5',
      text: 'from-gray-600 to-gray-500 dark:from-gray-400 dark:to-gray-500',
      border: 'border-gray-400/20 dark:border-gray-500/20',
      dot: 'bg-gray-400 dark:bg-gray-500'
    }
  });

  useEffect(() => {
    const getMarketState = () => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const day = nyTime.getDay();
      const hours = nyTime.getHours();
      const minutes = nyTime.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      // Market hours
      const preMarketStart = 4 * 60;  // 4:00 AM
      const marketOpen = 9 * 60 + 30; // 9:30 AM
      const marketClose = 16 * 60;    // 4:00 PM
      const afterHoursEnd = 20 * 60;  // 8:00 PM

      const isWeekday = day >= 1 && day <= 5;
      let state = {
        isOpen: false,
        status: 'Market Closed',
        nextEvent: '',
        timeUntil: '',
        statusColor: {
          bg: 'from-red-400/10 to-red-500/5 dark:from-red-500/10 dark:to-red-400/5',
          text: 'from-red-600 to-red-500 dark:from-red-400 dark:to-red-500',
          border: 'border-red-400/20 dark:border-red-500/20',
          dot: 'bg-red-400 dark:bg-red-500'
        }
      };

      if (!isWeekday) {
        const daysUntilMonday = 1 + (7 - day) % 7;
        state = {
          ...state,
          status: 'Weekend',
          nextEvent: 'Market Opens',
          timeUntil: `in ${daysUntilMonday} day${daysUntilMonday > 1 ? 's' : ''}`,
          statusColor: {
            bg: 'from-purple-400/10 to-purple-500/5 dark:from-purple-500/10 dark:to-purple-400/5',
            text: 'from-purple-600 to-purple-500 dark:from-purple-400 dark:to-purple-500',
            border: 'border-purple-400/20 dark:border-purple-500/20',
            dot: 'bg-purple-400 dark:bg-purple-500'
          }
        };
      } else if (timeInMinutes < preMarketStart) {
        const minutesUntil = preMarketStart - timeInMinutes;
        state = {
          ...state,
          status: 'Pre-market Soon',
          nextEvent: 'Pre-market',
          timeUntil: formatTimeUntil(minutesUntil),
          statusColor: {
            bg: 'from-blue-400/10 to-blue-500/5 dark:from-blue-500/10 dark:to-blue-400/5',
            text: 'from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-500',
            border: 'border-blue-400/20 dark:border-blue-500/20',
            dot: 'bg-blue-400 dark:bg-blue-500'
          }
        };
      } else if (timeInMinutes < marketOpen) {
        const minutesUntil = marketOpen - timeInMinutes;
        state = {
          ...state,
          status: 'Pre-market',
          nextEvent: 'Market Opens',
          timeUntil: formatTimeUntil(minutesUntil),
          statusColor: {
            bg: 'from-amber-400/10 to-amber-500/5 dark:from-amber-500/10 dark:to-amber-400/5',
            text: 'from-amber-600 to-amber-500 dark:from-amber-400 dark:to-amber-500',
            border: 'border-amber-400/20 dark:border-amber-500/20',
            dot: 'bg-amber-400 dark:bg-amber-500'
          }
        };
      } else if (timeInMinutes < marketClose) {
        const minutesUntil = marketClose - timeInMinutes;
        state = {
          isOpen: true,
          status: 'Market Open',
          nextEvent: 'Market Closes',
          timeUntil: formatTimeUntil(minutesUntil),
          statusColor: {
            bg: 'from-green-400/10 to-green-500/5 dark:from-green-500/10 dark:to-green-400/5',
            text: 'from-green-600 to-green-500 dark:from-green-400 dark:to-green-500',
            border: 'border-green-400/20 dark:border-green-500/20',
            dot: 'bg-green-400 dark:bg-green-500'
          }
        };
      } else if (timeInMinutes < afterHoursEnd) {
        const minutesUntil = afterHoursEnd - timeInMinutes;
        state = {
          ...state,
          status: 'After Hours',
          nextEvent: 'Trading Ends',
          timeUntil: formatTimeUntil(minutesUntil),
          statusColor: {
            bg: 'from-orange-400/10 to-orange-500/5 dark:from-orange-500/10 dark:to-orange-400/5',
            text: 'from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-500',
            border: 'border-orange-400/20 dark:border-orange-500/20',
            dot: 'bg-orange-400 dark:bg-orange-500'
          }
        };
      } else {
        const minutesUntil = (24 * 60) - timeInMinutes + preMarketStart;
        state = {
          ...state,
          nextEvent: 'Pre-market',
          timeUntil: formatTimeUntil(minutesUntil),
          statusColor: {
            bg: 'from-red-400/10 to-red-500/5 dark:from-red-500/10 dark:to-red-400/5',
            text: 'from-red-600 to-red-500 dark:from-red-400 dark:to-red-500',
            border: 'border-red-400/20 dark:border-red-500/20',
            dot: 'bg-red-400 dark:bg-red-500'
          }
        };
      }

      setMarketState(state);
    };

    const formatTimeUntil = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `in ${hours}h ${mins}m`;
      }
      return `in ${mins}m`;
    };

    // Update immediately and then every minute
    getMarketState();
    const interval = setInterval(getMarketState, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="hidden sm:block"
    >
      <div className={`px-3 py-1.5 bg-gradient-to-r ${marketState.statusColor.bg}
                    rounded-full border ${marketState.statusColor.border}
                    flex items-center space-x-2 group transition-all duration-300
                    hover:border-opacity-30 hover:shadow-sm`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${marketState.statusColor.dot}
                      shadow-lg animate-pulse group-hover:scale-110 transition-transform`} 
        />
        <div className="flex flex-col">
          <span className={`text-xs font-medium leading-none bg-gradient-to-r ${marketState.statusColor.text} 
                        bg-clip-text text-transparent`}
          >
            {marketState.status}
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            {marketState.nextEvent} {marketState.timeUntil}
          </span>
        </div>
      </div>
    </motion.div>
  );
}; 