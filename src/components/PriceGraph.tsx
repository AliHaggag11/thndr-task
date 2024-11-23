import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
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
  ChartData,
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

type ChartDataType = ChartData<'line', number[], string>;

export const PriceGraph = ({ stockSymbol }: PriceGraphProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [priceData, setPriceData] = useState<ChartDataType | null>(null);
  const [selectedRange, setSelectedRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const dataPoints = 30;
        const basePrice = 150 + Math.random() * 100;
        const volatility = 0.02;
        
        const dates = Array.from({ length: dataPoints }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (dataPoints - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        let priceList: number[] = [];
        for (let i = 0; i < dataPoints; i++) {
          if (i === 0) {
            priceList.push(basePrice);
          } else {
            const previousPrice = priceList[i - 1];
            const change = previousPrice * volatility * (Math.random() - 0.5);
            priceList.push(previousPrice + change);
          }
        }

        const mockData: ChartDataType = {
          labels: dates,
          datasets: [
            {
              label: stockSymbol,
              data: priceList,
              fill: true,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 0,
              pointHitRadius: 20,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgb(59, 130, 246)',
              pointHoverBorderColor: 'white',
              pointHoverBorderWidth: 2,
            },
          ],
        };
        setPriceData(mockData);
      } catch (error) {
        console.error('Error fetching price data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceData();
  }, [stockSymbol, selectedRange]);

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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: 'rgba(209, 213, 219, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: false,
        callbacks: {
          label: function(context) {
            if (typeof context.parsed.y === 'number') {
              return `$${context.parsed.y.toFixed(2)}`;
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
          display: true,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
          },
          callback: (value) => {
            if (typeof value === 'number') {
              return `$${value.toFixed(0)}`;
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
            size: 12,
          },
          maxRotation: 0,
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
      },
    },
  };

  const timeRanges = ['1D', '1W', '1M', '3M', '1Y'] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full space-y-4"
    >
      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2 px-4">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                     ${selectedRange === range
                       ? 'bg-light-accent/10 dark:bg-blue-500/10 text-light-accent dark:text-blue-400'
                       : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                     }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Graph Container */}
      <div className="relative h-[calc(100%-40px)] px-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-light-accent/20 
                         dark:border-blue-500/20 border-t-light-accent dark:border-t-blue-500" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {priceData && <Line data={priceData} options={options} />}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}; 