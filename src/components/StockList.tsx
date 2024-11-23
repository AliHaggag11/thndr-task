import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { fetchStocks } from '../services/api';
import { Stock, ApiResponse } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const CardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group relative bg-white/50 dark:bg-gray-800/30 rounded-2xl 
                backdrop-blur-sm backdrop-saturate-150
                border border-gray-100/50 dark:border-gray-700/30
                overflow-hidden"
  >
    <div className="relative p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-2 animate-pulse">
          {/* Ticker */}
          <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700/50 rounded-lg" />
          {/* Exchange */}
          <div className="h-4 w-32 bg-gray-200/50 dark:bg-gray-700/30 rounded-full" />
        </div>
      </div>

      {/* Company Name */}
      <div className="pb-4 border-b border-gray-100/50 dark:border-gray-700/30 animate-pulse">
        <div className="h-4 w-3/4 bg-gray-200/50 dark:bg-gray-700/30 rounded-lg" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200/30 dark:bg-gray-700/20 rounded-lg" />
          <div className="h-4 w-20 bg-gray-200/50 dark:bg-gray-700/30 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-gray-200/30 dark:bg-gray-700/20 rounded-lg" />
          <div className="h-4 w-20 bg-gray-200/50 dark:bg-gray-700/30 rounded-lg" />
        </div>
      </div>
    </div>
  </motion.div>
);

export const StockList = ({ searchQuery }: { searchQuery: string }) => {
  // Track if we're near the bottom to prevent multiple simultaneous requests
  const isNearBottom = useRef(false);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['stocks', searchQuery],
    queryFn: ({ pageParam }) => fetchStocks(searchQuery, pageParam as string),
    getNextPageParam: (lastPage: ApiResponse) => lastPage.next_url,
    initialPageParam: null as string | null,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep unused data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Create a more robust observer cleanup
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    if (!node || isFetchingNextPage || !hasNextPage) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isNearBottom.current) {
          isNearBottom.current = true;
          fetchNextPage().finally(() => {
            setTimeout(() => {
              isNearBottom.current = false;
            }, 1000);
          });
        }
      },
      {
        root: null,
        rootMargin: '300px', // Increased to load earlier
        threshold: 0.1
      }
    );

    observer.current.observe(node);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    const columnCount = window.innerWidth < 640 ? 1 : 
                       window.innerWidth < 1024 ? 2 : 
                       window.innerWidth < 1536 ? 3 : 4;
    
    const skeletonCount = columnCount * 3;
    
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 p-6"
      >
        <AnimatePresence>
          {[...Array(skeletonCount)].map((_, index) => (
            <CardSkeleton key={`skeleton-${index}`} />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }
  
  if (isError) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <div className="text-red-500 text-center max-w-md mx-auto p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        <p className="font-medium mb-2">Error</p>
        <p className="text-sm text-red-400">{(error as Error).message}</p>
      </div>
    </motion.div>
  );
  
  if (!data) return null;

  return (
    <div className="flex flex-col">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 p-6"
      >
        <AnimatePresence mode="wait">
          {data.pages.map((page: ApiResponse, pageIndex) =>
            page.results.map((stock: Stock, index: number) => {
              const isLastElement = pageIndex === data.pages.length - 1 && 
                                  index === page.results.length - 1;
              const uniqueKey = `${pageIndex}-${stock.ticker}`;
              
              return (
                <motion.div
                  key={uniqueKey}
                  ref={isLastElement ? lastElementRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: (index % 4) * 0.1 // Stagger effect
                  }}
                  className="group relative bg-white dark:bg-gray-800/50 rounded-2xl 
                            backdrop-blur-sm backdrop-saturate-150
                            hover:shadow-xl hover:shadow-light-accent/10 dark:hover:shadow-blue-500/10
                            hover:transform hover:-translate-y-1
                            transition-all duration-300 ease-out
                            border border-gray-100 dark:border-gray-700/50
                            overflow-hidden"
                >
                  {/* Gradient Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-light-accent/5 to-transparent 
                                dark:from-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative p-6">
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-clip-text text-transparent 
                                       bg-gradient-to-r from-light-text-primary to-light-text-primary/80
                                       dark:from-white dark:to-gray-300 mb-1 
                                       group-hover:from-light-accent group-hover:to-light-accent/80
                                       dark:group-hover:from-blue-400 dark:group-hover:to-blue-500 
                                       transition-all duration-300">
                          {stock.ticker}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-light-text-secondary dark:text-gray-400 font-medium">
                            {stock.primary_exchange}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-light-text-secondary/30 dark:bg-gray-500" />
                          <span className="text-xs px-2 py-0.5 bg-light-accent/10 dark:bg-blue-500/10 
                                         text-light-accent dark:text-blue-400 rounded-full font-medium">
                            {stock.currency_name}
                          </span>
                        </div>
                      </div>
                      
                      {/* Market Status Indicator */}
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-500 
                                      shadow-sm shadow-green-500/20 mr-2 animate-pulse" />
                        <span className="text-xs text-light-text-secondary dark:text-gray-400">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Company Name with Gradient Border */}
                    <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700/50">
                      <h3 className="text-sm text-light-text-primary dark:text-gray-200 
                                   line-clamp-2 font-medium leading-relaxed">
                        {stock.name}
                      </h3>
                    </div>

                    {/* Details Grid with Icons */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-1.5">
                        <span className="text-xs text-light-text-secondary dark:text-gray-400 
                                       flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>Market</span>
                        </span>
                        <span className="text-sm font-medium text-light-text-primary dark:text-white">
                          {stock.market}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <span className="text-xs text-light-text-secondary dark:text-gray-400 
                                       flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Type</span>
                        </span>
                        <span className="text-sm font-medium text-light-text-primary dark:text-white">
                          {stock.type}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Hover Effect */}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r 
                                  from-light-accent/0 via-light-accent to-light-accent/0
                                  dark:from-blue-500/0 dark:via-blue-500 dark:to-blue-500/0
                                  opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Loading and end states with animations */}
      <AnimatePresence>
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center py-8 space-x-3"
          >
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-light-accent/20 
                         dark:border-blue-500/20 border-t-light-accent dark:border-t-blue-500" />
            <span className="text-sm text-light-text-secondary dark:text-gray-400 animate-pulse">
              Loading more stocks...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {!hasNextPage && data.pages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center px-4 py-2 space-x-2 
                         bg-light-secondary/50 dark:bg-gray-800/50 
                         rounded-full text-sm text-light-text-secondary dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 13l4 4L19 7" />
              </svg>
              <span>You've reached the end of the list</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 