import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { FiX, FiGlobe, FiDollarSign, FiBarChart2, FiTrendingUp, FiClock, FiHash } from 'react-icons/fi';
import { Stock } from '../types';
import { useEffect, useState } from 'react';
import { toggleScroll } from '../utils/scroll';
import { useModal } from '../context/ModalContext';
import { ShareButton } from './ShareButton';
import { PriceGraph } from './PriceGraph'

interface StockModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'info' | 'graph';

export const StockModal = ({ stock, isOpen, onClose }: StockModalProps) => {
  const { setIsModalOpen } = useModal();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  useEffect(() => {
    setIsModalOpen(isOpen);
    toggleScroll(isOpen);
    return () => {
      setIsModalOpen(false);
      toggleScroll(false);
    };
  }, [isOpen, setIsModalOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            {/* Main Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                           border border-gray-100/50 dark:border-gray-600/50
                           hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                           group transition-all duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FiGlobe className="w-4 h-4 text-light-accent dark:text-blue-400" />
                  <span className="text-sm font-medium text-light-text-secondary dark:text-gray-400">
                    Exchange
                  </span>
                </div>
                <p className="text-light-text-primary dark:text-white font-medium">
                  {stock.primary_exchange}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                           border border-gray-100/50 dark:border-gray-600/50
                           hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                           group transition-all duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FiDollarSign className="w-4 h-4 text-light-accent dark:text-blue-400" />
                  <span className="text-sm font-medium text-light-text-secondary dark:text-gray-400">
                    Currency
                  </span>
                </div>
                <p className="text-light-text-primary dark:text-white font-medium">
                  {stock.currency_name}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                           border border-gray-100/50 dark:border-gray-600/50
                           hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                           group transition-all duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FiBarChart2 className="w-4 h-4 text-light-accent dark:text-blue-400" />
                  <span className="text-sm font-medium text-light-text-secondary dark:text-gray-400">
                    Market
                  </span>
                </div>
                <p className="text-light-text-primary dark:text-white font-medium">
                  {stock.market}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                           border border-gray-100/50 dark:border-gray-600/50
                           hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                           group transition-all duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FiTrendingUp className="w-4 h-4 text-light-accent dark:text-blue-400" />
                  <span className="text-sm font-medium text-light-text-secondary dark:text-gray-400">
                    Type
                  </span>
                </div>
                <p className="text-light-text-primary dark:text-white font-medium">
                  {stock.type}
                </p>
              </div>
            </div>
          </div>
        );
      case 'graph':
        return (
          <div className="p-4 w-full h-full overflow-hidden">
            <PriceGraph stockSymbol={stock.ticker} />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-end sm:items-center justify-center z-[60] 
                   bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3 }}
            className="w-full sm:w-[550px] h-[80vh] sm:h-auto sm:max-h-[80vh]
                     bg-white dark:bg-gray-800 
                     rounded-t-2xl sm:rounded-2xl shadow-xl 
                     border-t border-gray-200/50 dark:border-gray-700/50 sm:border
                     backdrop-blur-xl backdrop-saturate-150
                     will-change-transform
                     mt-auto sm:mt-0
                     flex flex-col
                     overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center p-1.5 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl z-10">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Modal Header */}
            <div className="relative px-4 sm:px-5 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              {/* Actions Row */}
              <div className="absolute top-3 right-4 flex items-center space-x-2">
                <ShareButton stock={stock} />
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl
                         bg-gray-100/50 dark:bg-gray-700/50
                         hover:bg-gray-200/50 dark:hover:bg-gray-600/50
                         text-gray-500 dark:text-gray-400
                         transition-colors duration-200"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Title and Status */}
              <div className="mb-3 pr-20">
                <div className="flex items-center space-x-3 mb-1.5">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent 
                              bg-gradient-to-r from-light-text-primary to-light-text-primary/90
                              dark:from-white dark:to-gray-300">
                    {stock.ticker}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium
                               bg-green-400/10 dark:bg-green-500/10
                               text-green-600 dark:text-green-400
                               border border-green-400/20 dark:border-green-500/20">
                    Active
                  </span>
                </div>
                <p className="text-light-text-secondary dark:text-gray-400 text-sm">
                  {stock.name}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="px-3 py-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50
                             hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                             transition-colors duration-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <FiClock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Updated</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Just Now</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-green-400/10 dark:bg-green-500/10
                             hover:bg-green-400/20 dark:hover:bg-green-500/20
                             transition-colors duration-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400">Status</span>
                  </div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Trading</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50
                             hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                             transition-colors duration-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <FiHash className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Session</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Regular</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 sm:px-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-3 px-4 relative ${
                    activeTab === 'info'
                      ? 'text-light-accent dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Info
                  {activeTab === 'info' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent dark:bg-blue-400"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`py-3 px-4 relative ${
                    activeTab === 'graph'
                      ? 'text-light-accent dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Price Graph
                  {activeTab === 'graph' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent dark:bg-blue-400"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.2,
                    ease: "easeInOut"
                  }}
                  className="h-full"
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 