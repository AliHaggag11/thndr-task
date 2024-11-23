import { FiShare2 } from 'react-icons/fi';
import { Stock } from '../types';

interface ShareButtonProps {
  stock: Stock;
}

export const ShareButton = ({ stock }: ShareButtonProps) => {
  const handleShare = async () => {
    const shareData = {
      title: `${stock.ticker} - ${stock.name}`,
      text: `Check out ${stock.ticker} (${stock.name}) on NASDAQ`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support native share
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full
               bg-gray-100/50 dark:bg-gray-700/50
               hover:bg-gray-200/50 dark:hover:bg-gray-600/50
               text-gray-500 dark:text-gray-400
               transition-colors duration-200"
      aria-label="Share stock"
    >
      <FiShare2 className="w-4 h-4" />
    </button>
  );
}; 