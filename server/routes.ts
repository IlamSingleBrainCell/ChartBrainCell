import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { stockSearchSchema, insertStockAnalysisSchema, insertPortfolioSchema, insertPortfolioTransactionSchema } from "@shared/schema";
import multer from "multer";
import type { Request } from "express";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stocks
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  // Get stocks by market
  app.get("/api/stocks/market/:market", async (req, res) => {
    try {
      const { market } = req.params;
      const stocks = await storage.getStocksByMarket(market);
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stocks by market" });
    }
  });

  // Search stocks
  app.post("/api/stocks/search", async (req, res) => {
    try {
      const { query } = stockSearchSchema.parse(req.body);
      const stocks = await storage.searchStocks(query);
      res.json(stocks);
    } catch (error) {
      res.status(400).json({ message: "Invalid search query" });
    }
  });

  // Get stock by symbol
  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await storage.getStock(symbol);
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock" });
    }
  });

  // Analyze stock (integrate with existing service)
  app.post("/api/stocks/:symbol/analyze", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await storage.getStock(symbol);
      
      if (!stock) {
        return res.status(404).json({ message: "Stock not found" });
      }

      // Generate dynamic analysis based on stock characteristics
      const patterns = ["Ascending Triangle", "Cup and Handle", "Bullish Flag", "Double Bottom", "Head and Shoulders", "Wedge Pattern"];
      const patternType = patterns[Math.floor(Math.random() * patterns.length)];
      
      // Generate confidence based on stock symbol hash for consistency
      const symbolHash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const confidence = 85 + (symbolHash % 15); // Range: 85-100% (High confidence)
      
      const breakoutDirection = confidence > 75 ? "upward" : (Math.random() > 0.5 ? "upward" : "downward");
      const timeframes = ["5-10 days", "10-15 days", "15-30 days", "30-45 days"];
      const breakoutTimeframe = timeframes[Math.floor(symbolHash % timeframes.length)];
      
      // Calculate dynamic prices with book value consideration based on market
      const isIndian = stock.market === 'Indian';
      const currentPrice = stock.currentPrice || (isIndian ? 2500 : 150);
      const bookValue = currentPrice * (0.7 + (symbolHash % 30) / 100); // Simulate book value
      const tenYearGrowth = 8 + (symbolHash % 15); // 8-23% historical growth
      
      // Adjust target and stop loss based on market and currency
      const targetMultiplier = breakoutDirection === "upward" ? (1.1 + Math.random() * 0.2) : (0.85 + Math.random() * 0.1);
      const stopLossMultiplier = 0.85 + Math.random() * 0.1;
      
      // Buy/Sell recommendation logic
      const priceToBook = currentPrice / bookValue;
      const recommendation = priceToBook < 1.2 && confidence > 70 ? "Strong Buy" : 
                           priceToBook < 1.5 && confidence > 60 ? "Buy" :
                           priceToBook > 2.0 || confidence < 50 ? "Sell" : "Hold";
      
      const mockAnalysis = {
        stockSymbol: symbol.toUpperCase(),
        patternType,
        confidence: Math.round(confidence * 10) / 10,
        breakoutDirection,
        breakoutTimeframe,
        breakoutProbability: Math.round((confidence - 10 + Math.random() * 15) * 10) / 10,
        targetPrice: currentPrice * targetMultiplier,
        stopLoss: currentPrice * stopLossMultiplier,
        riskReward: `1:${(1.5 + Math.random() * 1.5).toFixed(1)}`,
        analysisData: {
          technicalScore: Math.round(65 + Math.random() * 30),
          volumeScore: Math.round(70 + Math.random() * 25),
          riskLevel: confidence > 80 ? "Low" : confidence > 60 ? "Moderate" : "High",
          threeMonthReturn: Math.round((5 + Math.random() * 20) * 10) / 10,
          bookValue: Math.round(bookValue * 100) / 100,
          priceToBook: Math.round(priceToBook * 100) / 100,
          tenYearGrowth: Math.round(tenYearGrowth * 10) / 10,
          recommendation,
        },
      };

      const analysis = await storage.createStockAnalysis(mockAnalysis);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze stock" });
    }
  });

  // Get stock analysis
  app.get("/api/stocks/:symbol/analysis", async (req, res) => {
    try {
      const { symbol } = req.params;
      const analysis = await storage.getStockAnalysis(symbol);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Upload chart image
  app.post("/api/upload-chart", upload.single('chart'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const chartUpload = await storage.createChartUpload({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        analysisId: null,
      });

      // Simulate chart analysis (in production, this would process the uploaded image)
      const mockAnalysis = {
        stockSymbol: "CUSTOM_CHART",
        patternType: "Chart Pattern Detected",
        confidence: 75.8,
        breakoutDirection: "upward",
        breakoutTimeframe: "10-20 days",
        breakoutProbability: 65.5,
        targetPrice: null,
        stopLoss: null,
        riskReward: "1:1.8",
        analysisData: {
          uploadId: chartUpload.id,
          patternStrength: "Medium",
          supportResistance: "Clear levels identified",
          volumeAnalysis: "Above average volume",
        },
      };

      const analysis = await storage.createStockAnalysis(mockAnalysis);

      res.json({
        upload: chartUpload,
        analysis: analysis,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload and analyze chart" });
    }
  });

  // Get latest analyses
  app.get("/api/analyses/latest", async (req, res) => {
    try {
      const analyses = await storage.getLatestAnalysis();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest analyses" });
    }
  });

  // Portfolio Management Routes
  
  // Get user portfolio
  app.get("/api/portfolio", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const portfolio = await storage.getPortfolio(userId);
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Get portfolio performance
  app.get("/api/portfolio/performance", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const performance = await storage.getPortfolioPerformance(userId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio performance" });
    }
  });

  // Add stock to portfolio
  app.post("/api/portfolio", async (req, res) => {
    try {
      const portfolioData = insertPortfolioSchema.parse(req.body);
      const portfolioItem = await storage.addToPortfolio(portfolioData);
      res.json(portfolioItem);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid portfolio data", error: error.message });
    }
  });

  // Update portfolio item
  app.put("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertPortfolioSchema.partial().parse(req.body);
      const updated = await storage.updatePortfolioItem(id, updates);
      
      if (!updated) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid update data", error: error.message });
    }
  });

  // Remove stock from portfolio
  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const removed = await storage.removeFromPortfolio(id);
      
      if (!removed) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json({ message: "Portfolio item removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove portfolio item" });
    }
  });

  // Get portfolio item details
  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getPortfolioItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  // Add transaction to portfolio
  app.post("/api/portfolio/:id/transactions", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const transactionData = insertPortfolioTransactionSchema.parse({
        ...req.body,
        portfolioId
      });
      
      const transaction = await storage.addTransaction(transactionData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid transaction data", error: error.message });
    }
  });

  // Get portfolio transactions
  app.get("/api/portfolio/:id/transactions", async (req, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const transactions = await storage.getPortfolioTransactions(portfolioId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time price updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    clients.add(ws);
    
    // Send initial stock prices
    sendStockPrices(ws);
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  // Function to send stock prices to a specific client
  async function sendStockPrices(ws: WebSocket) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        const stocks = await storage.getStocks();
        ws.send(JSON.stringify({
          type: 'STOCK_PRICES',
          data: stocks.map(stock => ({
            symbol: stock.symbol,
            currentPrice: stock.currentPrice,
            changePercent: stock.changePercent,
            lastUpdated: stock.lastUpdated
          }))
        }));
      } catch (error) {
        console.error('Error sending stock prices:', error);
      }
    }
  }
  
  // Function to broadcast price updates to all clients
  async function broadcastPriceUpdates() {
    if (clients.size === 0) return;
    
    try {
      // Get current stocks and simulate price changes
      const stocks = await storage.getStocks();
      const updatedStocks = [];
      
      for (const stock of stocks) {
        // Simulate realistic price changes (-2% to +2%)
        const changePercent = (Math.random() - 0.5) * 4;
        const newPrice = stock.currentPrice * (1 + changePercent / 100);
        
        // Update stock in storage
        await storage.updateStock(stock.symbol, {
          currentPrice: Math.round(newPrice * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100
        });
        
        updatedStocks.push({
          symbol: stock.symbol,
          currentPrice: Math.round(newPrice * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          lastUpdated: new Date()
        });
      }
      
      // Broadcast to all connected clients
      const message = JSON.stringify({
        type: 'PRICE_UPDATE',
        data: updatedStocks
      });
      
      clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        } else {
          clients.delete(ws);
        }
      });
      
      console.log(`Broadcasted price updates to ${clients.size} clients`);
    } catch (error) {
      console.error('Error broadcasting price updates:', error);
    }
  }
  
  // Start price update interval (every 30 seconds)
  setInterval(broadcastPriceUpdates, 30000);
  
  return httpServer;
}
