import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceGraphProps {
  stockSymbol: string;
}


const API_KEY = import.meta.env.VITE_POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io/v2';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting queue
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 12000; // 12 seconds between requests (5 requests per minute)

const fetchWithRateLimit = async (url: string) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  // Check cache first
  const cacheKey = url;
  const cachedData = cache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }

  lastRequestTime = Date.now();
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 429) {
      // If rate limited, try to use cached data if available
      if (cachedData) {
        return cachedData.data;
      }
      throw new Error('Rate limit reached. Please try again in a few minutes.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Cache the response
  cache.set(cacheKey, { data, timestamp: Date.now() });
  
  return data;
};

interface PolygonAggResponse {
  ticker: string;
  status: string;
  results: {
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    t: number; // timestamp
    v: number; // volume
    vw: number; // volume weighted average
  }[];
}

export const PriceGraph = ({ stockSymbol }: PriceGraphProps) => {
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  const { data: priceData, isLoading, error } = useQuery({
    queryKey: ['stockPrice', stockSymbol, selectedRange],
    queryFn: async () => {
      const { multiplier, timespan, from, to } = getTimeRange(selectedRange);
      const fromStr = from.toISOString().split('T')[0];
      const toStr = to.toISOString().split('T')[0];

      const url = `${BASE_URL}/aggs/ticker/${stockSymbol}/range/${multiplier}/${timespan}/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=50000&apiKey=${API_KEY}`;
      
      const data: PolygonAggResponse = await fetchWithRateLimit(url);

      if (!data.results?.length) {
        throw new Error('No data available for this time range');
      }

      // Calculate if price is rising or falling
      const firstPrice = data.results[0].c;
      const lastPrice = data.results[data.results.length - 1].c;
      const isRising = lastPrice >= firstPrice;

      // Define colors based on price movement
      const colors = {
        line: isRising ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        background: isRising ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        hover: isRising ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)',
      };

      return {
        labels: data.results.map(result => 
          new Date(result.t).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(selectedRange === '1D' || selectedRange === '1W' 
              ? { hour: 'numeric', minute: 'numeric' } 
              : {})
          })
        ),
        datasets: [{
          label: stockSymbol,
          data: data.results.map(result => result.c),
          fill: true,
          borderColor: colors.line,
          backgroundColor: colors.background,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 20,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors.hover,
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2,
        }],
        priceChange: {
          value: lastPrice - firstPrice,
          percentage: ((lastPrice - firstPrice) / firstPrice) * 100,
          isPositive: isRising,
        },
      };
    },
    staleTime: CACHE_DURATION,
    retry: 2,
    retryDelay: 5000,
  });

  const getTimeRange = (range: '1D' | '1W' | '1M' | '3M' | '1Y') => {
    const now = new Date();
    const from = new Date();
    
    switch (range) {
      case '1D':
        from.setDate(now.getDate() - 1);
        return { multiplier: 5, timespan: 'minute', from, to: now };
      case '1W':
        from.setDate(now.getDate() - 7);
        return { multiplier: 30, timespan: 'minute', from, to: now };
      case '1M':
        from.setMonth(now.getMonth() - 1);
        return { multiplier: 1, timespan: 'day', from, to: now };
      case '3M':
        from.setMonth(now.getMonth() - 3);
        return { multiplier: 1, timespan: 'day', from, to: now };
      case '1Y':
        from.setFullYear(now.getFullYear() - 1);
        return { multiplier: 1, timespan: 'day', from, to: now };
    }
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: 'rgba(209, 213, 219, 0.5)',
        borderWidth: 1,
        padding: {
          top: 10,
          right: 12,
          bottom: 10,
          left: 12
        },
        cornerRadius: 8,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const date = new Date(tooltipItems[0].label);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              ...(selectedRange === '1D' && {
                hour: '2-digit',
                minute: '2-digit'
              })
            });
          },
          label: function(context) {
            if (typeof context.parsed.y === 'number') {
              return `Price: $${context.parsed.y.toFixed(2)}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          padding: 8,
          callback: (value) => {
            if (typeof value === 'number') {
              return `$${value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`;
            }
            return '';
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          maxRotation: 0,
          padding: 8,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 8,
        hoverRadius: 4,
      },
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 10,
        left: 10
      }
    },
  };

  const timeRanges = ['1D', '1W', '1M', '3M', '1Y'] as const;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Price Change Indicator */}
      {priceData && (
        <div className="flex justify-between items-center mb-4 px-0">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium
                        ${priceData.priceChange.isPositive 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            <span className="text-base font-semibold">
              ${priceData.datasets[0].data[priceData.datasets[0].data.length - 1].toFixed(2)}
            </span>
            <div className="flex items-center space-x-1 text-xs opacity-90">
              <span>
                {priceData.priceChange.isPositive ? '+' : ''}
                ${Math.abs(priceData.priceChange.value).toFixed(2)}
              </span>
              <span>
                ({priceData.priceChange.isPositive ? '+' : ''}
                {priceData.priceChange.percentage.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                         ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                         ${selectedRange === range
                           ? 'bg-white dark:bg-gray-700 text-light-accent dark:text-blue-400 shadow-sm'
                           : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
                         }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Graph Container */}
      <div className="flex-1 relative min-h-[250px] w-full overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-light-accent/20 
                           dark:border-blue-500/20 border-t-light-accent dark:border-t-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Loading price data...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/30 dark:bg-red-900/10 backdrop-blur-sm rounded-xl">
            <div className="text-red-500 text-sm text-center px-4 max-w-md">
              {error instanceof Error ? error.message : 'Failed to fetch price data'}
            </div>
          </div>
        ) : (
          <div className="h-full w-full">
            {priceData && (
              <div className="h-full w-full overflow-hidden">
                <Line data={priceData} options={options} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 