import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stockSearchSchema, insertStockAnalysisSchema } from "@shared/schema";
import multer from "multer";
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
  fileFilter: (req, file, cb) => {
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

      // Simulate analysis results (in production, this would call the actual analysis service)
      const mockAnalysis = {
        stockSymbol: symbol.toUpperCase(),
        patternType: "Ascending Triangle",
        confidence: 87.3,
        breakoutDirection: "upward",
        breakoutTimeframe: "15-30 days",
        breakoutProbability: 78.0,
        targetPrice: stock.currentPrice ? stock.currentPrice * 1.15 : 200.0,
        stopLoss: stock.currentPrice ? stock.currentPrice * 0.85 : 150.0,
        riskReward: "1:2.3",
        analysisData: {
          technicalScore: 91,
          volumeScore: 84,
          riskLevel: "Moderate",
          threeMonthReturn: 12.5,
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
  app.post("/api/upload-chart", upload.single('chart'), async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
