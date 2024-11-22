export interface Stock {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  currency_name: string;
  last_updated_utc: string;
}

export interface StockDetails {
  status: string;
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: [{
    T?: string;      // ticker
    c: number;       // close price
    h: number;       // high
    l: number;       // low
    o: number;       // open
    v: number;       // volume
    vw: number;      // volume weighted average price
    t: number;       // timestamp
  }];
}

export interface ApiResponse {
  results: Stock[];
  status: string;
  count: number;
  next_url: string | null;
} 