export type ErrorType = 
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'TIMEOUT'
  | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public originalError?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }

  static fromApiError(error: any): AppError {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          return new AppError('AUTH_ERROR', 'Authentication failed', error, 401);
        case 403:
          return new AppError('AUTH_ERROR', 'Access forbidden', error, 403);
        case 404:
          return new AppError('NOT_FOUND', 'Resource not found', error, 404);
        case 429:
          return new AppError('RATE_LIMIT', 'Rate limit exceeded', error, 429);
        default:
          return new AppError('API_ERROR', error.response.data?.message || 'API request failed', error, error.response.status);
      }
    } else if (error.request) {
      // Request made but no response received
      if (!navigator.onLine) {
        return new AppError('NETWORK_ERROR', 'No internet connection', error);
      }
      return new AppError('TIMEOUT', 'Request timeout', error);
    }
    // Something else happened while setting up the request
    return new AppError('UNKNOWN', error.message || 'An unexpected error occurred', error);
  }
}

export const handleError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  return AppError.fromApiError(error);
};

export const isRetryableError = (error: AppError): boolean => {
  return [
    'NETWORK_ERROR',
    'TIMEOUT',
    'RATE_LIMIT'
  ].includes(error.type);
}; 