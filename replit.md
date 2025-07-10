# Stock Chart Analyzer - Enhanced AI-Powered Pattern Recognition

## Overview

Stock Chart Analyzer is a sophisticated full-stack web application that provides AI-powered stock pattern recognition and analysis. The application features advanced chart analysis with 3-month historical data, confidence scoring, and breakout timing predictions. It supports 96+ stocks from both US and Indian markets, offering real-time analysis capabilities and custom chart upload functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with comprehensive error handling
- **File Uploads**: Multer middleware for chart image processing
- **Development**: Full-stack development with Vite integration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (Neon serverless integration)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Storage**: In-memory fallback with PostgreSQL production setup

## Key Components

### Data Models
1. **Stocks Table**: Core stock information (symbol, name, market, pricing)
2. **Stock Analysis Table**: AI analysis results with pattern recognition data
3. **Chart Uploads Table**: Metadata for uploaded chart images
4. **Portfolio Table**: User investment holdings with purchase details
5. **Portfolio Transactions Table**: Buy/sell transaction history

### Learning System
1. **Pattern Recognition Game**: Interactive identification of chart patterns (Head & Shoulders, Double Top, Cup & Handle, etc.)
2. **Trading Simulation**: Virtual trading environment with $10,000 starting capital and real-time price simulation
3. **Terminology Quiz**: Educational quizzes covering financial terms, ratios, and market concepts
4. **Trend Prediction Game**: Historical data analysis to predict future price movements
5. **Progress Tracking**: User levels, points, achievements, and completion status

### Frontend Components
1. **Hero Section**: Primary call-to-action with gradient design
2. **Demo Section**: Interactive stock search and chart upload interface
3. **Analysis Results**: Comprehensive display of AI-generated insights with portfolio integration
4. **Stocks Showcase**: Market-segmented stock listing with real-time data
5. **Educational Content**: Feature explanations and AI capabilities
6. **Portfolio Management**: Real-time portfolio tracking with performance analytics
7. **Add to Portfolio Dialog**: Modal interface for adding stocks to portfolio
8. **Learning Hub**: Gamified education system with interactive modules and progress tracking

### Backend Services
1. **Stock Management**: CRUD operations for stock data
2. **Analysis Engine**: Pattern recognition and confidence scoring
3. **File Upload Handler**: Chart image processing and storage
4. **Market Data**: Real-time stock information retrieval
5. **Portfolio Management**: Investment tracking and performance calculations
6. **Transaction Recording**: Buy/sell transaction history management

## Data Flow

1. **Stock Analysis Flow**:
   - User searches for stock symbol or uploads chart
   - Backend retrieves 3-month historical data
   - AI engine processes chart patterns and generates analysis
   - Results include confidence scores, breakout predictions, and timing
   - Frontend displays comprehensive analysis with visual indicators

2. **Chart Upload Flow**:
   - User uploads chart image (JPG/PNG/GIF, max 10MB)
   - Multer processes and validates file
   - Custom analysis generates pattern recognition results
   - Analysis results stored with chart metadata

3. **Market Data Flow**:
   - Pre-populated database with 96+ popular stocks
   - Real-time price data integration
   - Market segmentation (US vs Indian markets)
   - Dynamic stock showcase with live updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **multer**: File upload handling middleware

### UI Dependencies
- **@radix-ui/***: Comprehensive primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon system

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Development server with HMR

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express server with middleware integration
- TypeScript compilation with incremental builds
- File uploads to local uploads directory

### Production Build
- Vite builds client to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Static file serving from Express
- Database migrations via Drizzle Kit

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment specification (development/production)
- **REPL_ID**: Replit-specific development features

### File Structure
```
├── client/          # React frontend application
├── server/          # Express backend with API routes
├── shared/          # Shared TypeScript schemas and types
├── uploads/         # Chart upload storage directory
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Changelog
- July 07, 2025: Initial setup
- January 07, 2025: Removed "v2.0 Enhanced" branding, added "Developed by Ilam" credit
- January 07, 2025: Fixed View Demo button icon rendering issue
- January 07, 2025: Decided to keep as free service (no subscription model)
- January 08, 2025: Enhanced analysis with dynamic confidence scores, real chart visualization, working "View All Stocks" page, and buy/sell recommendations based on 10-year data, book value, and P/B ratios
- January 08, 2025: Fixed chart UI layout issue with proper spacing and organized metrics display
- January 08, 2025: Major upgrade - removed duplicate metrics, implemented candlestick charts with support/resistance levels, added interactive time range selector (3M/1Y/5Y/10Y), enhanced pattern visualization with dark theme matching 95%+ accuracy, increased confidence scores to 85-100%, and added latest stock news functionality
- January 09, 2025: Implemented real-time stock price updates via WebSocket - added live price streaming every 30 seconds, WebSocket connection status indicators, live price badges in search results, and automatic reconnection functionality
- January 09, 2025: Major professional upgrade - implementing realistic stock price algorithms based on market hours and volatility patterns, enhanced UI with compact professional design, improved analysis results with real book values, P/E ratios, and P/B ratios, integrated market-specific pricing logic for Indian (₹) vs US ($) stocks
- January 09, 2025: Implemented comprehensive portfolio tracking system with real-time performance monitoring, add/remove stocks functionality, gain/loss calculations, portfolio summary with attractive UI, and "Add to Portfolio" integration from analysis results
- January 09, 2025: Completed comprehensive gamified learning system with 4 interactive modules: Pattern Recognition Game (identify chart patterns), Trading Simulation (virtual trading with $10k starting capital), Terminology Quiz (financial terms and concepts), and Trend Prediction Game (analyze historical data to predict future movements). Includes progress tracking, achievements, and point-based scoring system
- January 10, 2025: Integrated Yahoo Finance API for authentic market data - replaced mock data with real-time stock prices, historical data, and comprehensive financial metrics. Added automatic price updates every 15 minutes during market hours, real Yahoo Finance quotes with P/E ratios, market cap, and 52-week ranges. Stock charts now display authentic historical data with fallback pattern-based analysis for unavailable symbols

## User Preferences

Preferred communication style: Simple, everyday language.