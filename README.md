<div align="center">


  <!-- <img src="/public/NDAQ_BIG.png" alt="NASDAQ Explorer Logo" width="200" style="margin: 20px 0" /> -->

  # NASDAQ Stock Explorer
  <img src="/public/cover.png" alt="NASDAQ Explorer Cover" width="100%" style="margin-bottom: 20px; border-radius: 8px;" />

  A professional web application for real-time stock tracking, featuring a sleek dark/light mode interface, interactive charts, and live market updates.

  [Live Demo](https://thndr-task.vercel.app/) · [Report Bug](mailto:ali7aggag@gmail.com) · [Request Feature](mailto:ali7aggag@gmail.com)
</div>

---

## ✨ Features

### 📈 Real-time Market Status
- Live tracking of market hours (pre-market, regular, after-hours)
- Custom market status indicators with animations
- Time zone handling (Eastern Time)
- Weekend and holiday detection

### 📊 Stock Price Visualization
- Interactive price charts with multiple timeframes (1D, 1W, 1M, 3M, 1Y)
- Real-time price updates
- Price change visualization
- Volume analysis
- Custom chart styling and animations

### ⚠️ Error Handling System
- Custom error service with typed errors
- React Error Boundaries for component-level error handling
- Graceful error recovery
- User-friendly error messages
- Network error detection

### 🚀 Performance Optimizations
- API response caching with a custom cache service
- Request queue management
- Rate limit handling with exponential backoff
- Lazy loading for improved performance
- Code splitting for optimized loading

### 🎨 UI/UX Features
- Dark/Light theme with system preference detection
- Fully responsive design for all devices
- Infinite scroll for stock listings
- Modal views with drag gestures
- Share functionality for stock information
- Loading states and animations for better user experience

### 🛠️ Technical Implementation
- Custom hooks and context providers
- TypeScript interfaces and types for better type safety
- API service with interceptors for error handling
- Utility functions for market hours
- Caching mechanisms for improved performance
- Error handling patterns for robust application behavior

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher

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

3. **Create an environment file**
   ```bash
   cp .env.example .env
   ```

4. **Add your Polygon.io API key to the .env file**
   ```plaintext
   VITE_POLYGON_API_KEY=your_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### 🛠️ Built With

- **Core Technologies**
  - React 18 - UI Framework
  - TypeScript - Programming Language
  - Vite - Build Tool

- **Data & State Management**
  - Axios - API requests
  - Polygon.io - Market Data API

- **Styling & UI Frameworks**
  - Tailwind CSS - Utility-first CSS Framework
  - Framer Motion - Animation Library
  - Chart.js with react-chartjs-2 - Charting Library

- **Error Handling Mechanisms**
  - Custom Error Service for handling errors
  - React Error Boundaries for component-level error handling
  - Axios Interceptors for managing API request errors

  ### 📖 Documentation

  - **API Integration**
    The application uses Polygon.io's REST API with sophisticated error handling and rate limiting.

  - **Error Handling**
    Comprehensive error management system.

  - **Market Hours**
    Precise market status tracking.

  ### 🤝 Contributing

  1. Fork the Project
  2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
  3. Commit your Changes (git commit -m 'Add some AmazingFeature')
  4. Push to the Branch (git push origin feature/AmazingFeature)
  5. Open a Pull Request

  ### 📝 License

  Distributed under the MIT License. See LICENSE for more information.

  Made with ❤️ by Ali Haggag

