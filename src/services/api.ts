import axios from 'axios';
import { ApiResponse, StockDetails } from '../types';
import { cacheService } from './cacheService';
import { handleError, isRetryableError } from './errorService';

const api = axios.create({
  baseURL: 'https://api.polygon.io',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_POLYGON_API_KEY}`
  }
});

const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
let lastRequestTime = 0;

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => 
      setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
};

// Implement exponential backoff retry logic
const fetchWithRetry = async <T>(
  url: string, 
  params: any, 
  retries = 3, 
  delay = 2000
): Promise<T> => {
  try {
    await waitForRateLimit();
    const response = await api.get(url, { params });
    return response.data;
  } catch (error: any) {
    const appError = handleError(error);
    
    if (isRetryableError(appError) && retries > 0) {
      console.log(`Retrying request in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, params, retries - 1, delay * 2);
    }
    
    throw appError;
  }
};

// Add request queue to manage rate limits
let requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await waitForRateLimit(); // Wait before making the request
      await request();
    }
  }
  isProcessingQueue = false;
};

export const fetchStocks = async (
  search?: string,
  nextUrl?: string
): Promise<ApiResponse> => {
  const cacheKey = `stocks-${search}-${nextUrl}`;
  const cachedData = cacheService.get<ApiResponse>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await fetchWithRetry<ApiResponse>(
          nextUrl || '/v3/reference/tickers',
          {
            market: 'stocks',
            active: 'true',
            sort: 'ticker',
            order: 'asc',
            limit: '20',
            search,
          }
        );
        
        // Cache the response for 5 minutes
        cacheService.set(cacheKey, result);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

export const fetchStockDetails = async (ticker: string): Promise<StockDetails> => {
  const cacheKey = `stock-details-${ticker}`;
  const cachedData = cacheService.get<StockDetails>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await fetchWithRetry<StockDetails>(
          `/v2/aggs/ticker/${ticker}/prev`,
          { adjusted: true }
        );
        
        // Cache the response for 1 minute (since it's real-time data)
        cacheService.set(cacheKey, result, 60 * 1000);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

// Add request interceptor to track API usage
api.interceptors.request.use((config) => {
  console.log('API Request:', {
    url: config.url,
    params: config.params,
    timestamp: new Date().toISOString()
  });
  return config;
});

// Add response interceptor to track remaining rate limit
api.interceptors.response.use(
  (response) => {
    const remaining = response.headers['x-ratelimit-remaining'];
    if (remaining) {
      console.log(`Rate limit remaining: ${remaining}`);
    }
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        console.log(`Rate limit resets at: ${resetDate.toLocaleString()}`);
      }
    }
    throw error;
  }
);