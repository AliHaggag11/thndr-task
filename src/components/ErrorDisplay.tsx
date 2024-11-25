import { FiAlertCircle, FiWifiOff, FiClock, FiLock } from 'react-icons/fi';
import { AppError } from '../services/errorService';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return <FiWifiOff className="w-5 h-5" />;
      case 'RATE_LIMIT':
        return <FiClock className="w-5 h-5" />;
      case 'AUTH_ERROR':
        return <FiLock className="w-5 h-5" />;
      default:
        return <FiAlertCircle className="w-5 h-5" />;
    }
  };

  const getErrorMessage = () => {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return 'Please check your internet connection';
      case 'RATE_LIMIT':
        return 'Too many requests. Please try again later';
      case 'AUTH_ERROR':
        return 'Authentication failed. Please try again';
      default:
        return error.message;
    }
  };

  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-red-500 dark:text-red-400">
          {getErrorIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            {error.type.replace(/_/g, ' ')}
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {getErrorMessage()}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-600 dark:text-red-400
                     hover:text-red-500 dark:hover:text-red-300"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 