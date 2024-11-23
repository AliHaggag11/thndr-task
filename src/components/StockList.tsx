import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { fetchStocks } from '../services/api';
import { Stock, ApiResponse } from '../types';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiGlobe, FiBarChart } from 'react-icons/fi';
import { StockModal } from './StockModal';

const CardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group relative bg-white/50 dark:bg-gray-800/30 rounded-2xl 
                backdrop-blur-sm backdrop-saturate-150
                border border-gray-100/50 dark:border-gray-700/30
                overflow-hidden will-change-transform"
  >
    <div className="relative p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2 animate-pulse">
          <div className="h-7 w-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg" />
          <div className="h-4 w-32 bg-gray-200/30 dark:bg-gray-700/30 rounded-full" />
        </div>
      </div>
      <div className="pb-4 border-b border-gray-100/50 dark:border-gray-700/30 animate-pulse">
        <div className="h-4 w-3/4 bg-gray-200/30 dark:bg-gray-700/30 rounded-lg" />
      </div>
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

export const StockList = ({ searchQuery, filters }: { searchQuery: string; filters?: any }) => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['stocks', searchQuery, filters],
    queryFn: ({ pageParam }) => fetchStocks(searchQuery, pageParam === null ? undefined : pageParam),
    getNextPageParam: (lastPage: ApiResponse) => lastPage.next_url || null,
    initialPageParam: null,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isLoading) {
    const columnCount = window.innerWidth < 640 ? 1 : 
                       window.innerWidth < 1024 ? 2 : 
                       window.innerWidth < 1536 ? 3 : 4;
    
    const skeletonCount = columnCount * 3;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 p-6">
        {[...Array(skeletonCount)].map((_, index) => (
          <CardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 p-6">
        {data.pages.map((page: ApiResponse, pageIndex) =>
          page.results.map((stock: Stock, index: number) => {
            const isLastElement = pageIndex === data.pages.length - 1 && 
                                index === page.results.length - 1;
            const uniqueKey = `${pageIndex}-${stock.ticker}`;
            const isMobile = window.innerWidth < 640;
            
            return (
              <motion.div
                key={uniqueKey}
                ref={isLastElement ? lastElementRef : null}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.2,
                  delay: isMobile ? index * 0.05 : (index % 4) * 0.1
                }}
                onClick={() => setSelectedStock(stock)}
                className="group relative bg-white/90 dark:bg-gray-800/50 rounded-2xl 
                          backdrop-blur-sm backdrop-saturate-150
                          border border-gray-100/50 dark:border-gray-700/50
                          overflow-hidden will-change-transform
                          hover:shadow-lg hover:shadow-light-accent/5 dark:hover:shadow-blue-500/5
                          active:scale-[0.98] touch-manipulation
                          transition-all duration-300 ease-out
                          cursor-pointer"
              >
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent 
                                   bg-gradient-to-r from-light-text-primary to-light-text-primary/90
                                   dark:from-white dark:to-gray-300
                                   group-hover:from-light-accent group-hover:to-light-accent/90
                                   dark:group-hover:from-blue-400 dark:group-hover:to-blue-500 
                                   transition-all duration-300">
                          {stock.ticker}
                        </h3>
                        <span className="px-2 py-1 text-[10px] font-medium rounded-full
                                     bg-green-400/10 dark:bg-green-500/10
                                     text-green-600 dark:text-green-400
                                     border border-green-400/20 dark:border-green-500/20">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center space-x-1 text-xs text-light-text-secondary dark:text-gray-400">
                          <FiGlobe className="w-3 h-3" />
                          <span>{stock.primary_exchange}</span>
                        </div>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                        <div className="flex items-center space-x-1 text-xs text-light-text-secondary dark:text-gray-400">
                          <FiDollarSign className="w-3 h-3" />
                          <span>{stock.currency_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="mb-6 pb-4 border-b border-gray-100/50 dark:border-gray-700/50">
                    <p className="text-sm text-light-text-primary dark:text-gray-200 
                               line-clamp-2 font-medium leading-relaxed">
                      {stock.name}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-light-text-secondary/80 dark:text-gray-400/80 
                                   flex items-center space-x-1">
                        <FiBarChart className="w-3 h-3" />
                        <span>Market</span>
                      </span>
                      <span className="text-sm font-medium text-light-text-primary dark:text-white
                                   group-hover:text-light-accent dark:group-hover:text-blue-400
                                   transition-colors duration-300">
                        {stock.market}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-light-text-secondary/80 dark:text-gray-400/80 
                                   flex items-center space-x-1">
                        <FiTrendingUp className="w-3 h-3" />
                        <span>Type</span>
                      </span>
                      <span className="text-sm font-medium text-light-text-primary dark:text-white
                                   group-hover:text-light-accent dark:group-hover:text-blue-400
                                   transition-colors duration-300">
                        {stock.type}
                      </span>
                    </div>
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br 
                              from-light-accent/[0.02] to-transparent
                              dark:from-blue-500/[0.02] opacity-0 
                              group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <StockModal 
        stock={selectedStock!}
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
      />

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8 space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-light-accent/20 
                       dark:border-blue-500/20 border-t-light-accent dark:border-t-blue-500
                       will-change-transform" />
          <span className="text-sm text-light-text-secondary dark:text-gray-400">
            Loading more stocks...
          </span>
        </div>
      )}

      {/* End of List Indicator */}
      {!hasNextPage && data.pages.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 space-x-2 
                       bg-light-secondary/50 dark:bg-gray-800/50 
                       rounded-full text-sm text-light-text-secondary dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M5 13l4 4L19 7" />
            </svg>
            <span>You've reached the end of the list</span>
          </div>
        </div>
      )}
    </div>
  );
}; 