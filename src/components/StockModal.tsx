import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { FiX, FiTrendingUp, FiDollarSign, FiBarChart2, FiGlobe } from 'react-icons/fi';
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
        // Backdrop with click handler
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto
                     bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
                     border border-gray-200/50 dark:border-gray-700/50
                     backdrop-blur-xl backdrop-saturate-150"
          >
            {/* Drag Handle */}
            <div className="flex justify-center p-2">
              <div className="w-12 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Modal Header */}
            <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              {/* Actions Row */}
              <div className="absolute top-6 right-6 flex items-center space-x-2">
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
              <div>
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
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50
                             border border-gray-100/50 dark:border-gray-600/50
                             hover:bg-gray-50/70 dark:hover:bg-gray-700/70
                             group transition-all duration-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiGlobe className="w-4 h-4 text-light-accent dark:text-blue-400 
                                    group-hover:scale-110 transition-transform" />
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
                    <FiDollarSign className="w-4 h-4 text-light-accent dark:text-blue-400 
                                        group-hover:scale-110 transition-transform" />
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
                    <FiBarChart2 className="w-4 h-4 text-light-accent dark:text-blue-400 
                                       group-hover:scale-110 transition-transform" />
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
                    <FiTrendingUp className="w-4 h-4 text-light-accent dark:text-blue-400 
                                        group-hover:scale-110 transition-transform" />
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 