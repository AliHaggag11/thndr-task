import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { FiX, FiGlobe, FiDollarSign, FiBarChart2, FiTrendingUp, FiInfo, FiClock, FiHash } from 'react-icons/fi';
import { Stock } from '../types';
import { useEffect } from 'react';
import { toggleScroll } from '../utils/scroll';
import { useModal } from '../context/ModalContext';
import { ShareButton } from './ShareButton';

interface StockModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
}

export const StockModal = ({ stock, isOpen, onClose }: StockModalProps) => {
  const { setIsModalOpen } = useModal();

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
            className="w-full sm:w-auto sm:max-w-2xl max-h-[80vh] sm:h-auto sm:max-h-[90vh] 
                     overflow-y-auto bg-white dark:bg-gray-800 
                     rounded-t-2xl sm:rounded-2xl shadow-xl 
                     border-t border-gray-200/50 dark:border-gray-700/50 sm:border
                     backdrop-blur-xl backdrop-saturate-150
                     will-change-transform
                     mt-auto sm:mt-0"
          >
            {/* Drag Handle */}
            <div className="flex justify-center p-2 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl z-10">
              <div className="w-12 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Modal Header */}
            <div className="relative px-4 sm:px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              {/* Actions Row - Simplified */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <ShareButton stock={stock} />
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl
                         bg-gray-100/50 dark:bg-gray-700/50
                         hover:bg-gray-200/50 dark:hover:bg-gray-600/50
                         text-gray-500 dark:text-gray-400
                         transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Title and Status */}
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent 
                              bg-gradient-to-r from-light-text-primary to-light-text-primary/90
                              dark:from-white dark:to-gray-300">
                    {stock.ticker}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-medium
                               bg-green-400/10 dark:bg-green-500/10
                               text-green-600 dark:text-green-400
                               border border-green-400/20 dark:border-green-500/20">
                    Active
                  </span>
                </div>
                <p className="text-light-text-secondary dark:text-gray-400 text-sm pr-24">
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

            {/* Modal Body */}
            <div className="p-4 space-y-4">
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

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                             border border-gray-100/50 dark:border-gray-600/50
                             hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                             transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <FiInfo className="w-4 h-4 text-light-accent dark:text-blue-400" />
                      <span className="text-sm font-medium text-light-text-secondary dark:text-gray-400">
                        About
                      </span>
                    </div>
                    <span className="text-xs text-light-text-secondary dark:text-gray-400">
                      {stock.primary_exchange}
                    </span>
                  </div>
                  <p className="text-sm text-light-text-primary dark:text-white leading-relaxed">
                    {stock.name} ({stock.ticker}) is listed on the {stock.primary_exchange} exchange.
                    It trades in {stock.currency_name} currency as a {stock.type} instrument.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 