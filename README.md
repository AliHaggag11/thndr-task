<div align="center">
  <img src="/public/NDAQ_BIG.png" alt="NASDAQ Explorer Logo" width="200" style="margin: 20px 0" />

  # NASDAQ Stock Explorer

  A sophisticated real-time stock tracking platform with an elegant dark mode interface, interactive charts, and live market updates.

  [Live Demo](#) · [Report Bug](#) · [Request Feature](#)
</div>

---

## ✨ Features

### Core Experience
- **Live Market Status**
  - Real-time trading hours tracking
  - Pre-market, regular hours, and after-hours indicators
  - Market holiday detection
  - Time zone aware (ET)

- **Interactive Stock Data**
  - Real-time price updates
  - Multi-timeframe price charts (1D, 1W, 1M, 3M, 1Y)
  - Price change visualization
  - Volume analysis

- **Smart Search & Navigation**
  - Instant stock search
  - Infinite scroll stock listing
  - Responsive modal views
  - Share functionality

### Technical Implementation

- **Robust Error Handling**
  - Graceful error recovery
  - Rate limit management
  - Network error detection
  - User-friendly error messages

- **Performance Optimization**
  - Intelligent API caching
  - Request queue management
  - Lazy loading
  - Optimized re-renders

- **User Experience**
  - Fluid animations
  - Dark/Light theme
  - Responsive design
  - Touch gestures support

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher
# Start Generation Here

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alihaggag11/nasdaq-explorer.git
   ```

2. **Install dependencies**
   ```bash
   cd nasdaq-explorer
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Add your Polygon.io API key to .env**
   ```plaintext
   VITE_POLYGON_API_KEY=your_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Built With

- **Core**
  - React 18 - UI Framework
  - TypeScript - Language
  - Vite - Build Tool

- **Data & State**
  - TanStack Query - Data Fetching
  - Polygon.io - Market Data API

- **Styling & UI**
  - Tailwind CSS - Styling
  - Framer Motion - Animations
  - Chart.js - Charts

- **Error Handling**
  - Custom Error Service
  - React Error Boundaries
  - Axios Interceptors

