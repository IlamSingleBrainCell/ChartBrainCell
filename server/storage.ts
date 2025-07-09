import { stocks, stockAnalysis, chartUploads, type Stock, type InsertStock, type StockAnalysis, type InsertStockAnalysis, type ChartUpload, type InsertChartUpload } from "@shared/schema";

export interface IStorage {
  // Stock operations
  getStock(symbol: string): Promise<Stock | undefined>;
  getStocks(): Promise<Stock[]>;
  getStocksByMarket(market: string): Promise<Stock[]>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(symbol: string, stock: Partial<InsertStock>): Promise<Stock | undefined>;
  searchStocks(query: string): Promise<Stock[]>;
  
  // Stock analysis operations
  getStockAnalysis(stockSymbol: string): Promise<StockAnalysis | undefined>;
  createStockAnalysis(analysis: InsertStockAnalysis): Promise<StockAnalysis>;
  getLatestAnalysis(): Promise<StockAnalysis[]>;
  
  // Chart upload operations
  createChartUpload(upload: InsertChartUpload): Promise<ChartUpload>;
  getChartUpload(id: number): Promise<ChartUpload | undefined>;
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock>;
  private stockAnalyses: Map<string, StockAnalysis>;
  private chartUploads: Map<number, ChartUpload>;
  private currentStockId: number;
  private currentAnalysisId: number;
  private currentUploadId: number;

  constructor() {
    this.stocks = new Map();
    this.stockAnalyses = new Map();
    this.chartUploads = new Map();
    this.currentStockId = 1;
    this.currentAnalysisId = 1;
    this.currentUploadId = 1;
    
    // Initialize with stocks from JSON files
    this.loadStockData();
  }

  private async loadStockData() {
    try {
      // Import JSON files dynamically
      const fs = await import('fs');
      const path = await import('path');
      
      const dataDir = path.join(process.cwd(), 'shared', 'data');
      
      // Read NSE stocks
      const nseData = JSON.parse(fs.readFileSync(path.join(dataDir, 'nse-stocks.json'), 'utf8'));
      // Read NYSE stocks  
      const nyseData = JSON.parse(fs.readFileSync(path.join(dataDir, 'nyse-stocks.json'), 'utf8'));
      // Read BSE stocks
      const bseData = JSON.parse(fs.readFileSync(path.join(dataDir, 'bse-stocks.json'), 'utf8'));
      
      // Combine all stock data
      const allStocks = [...nseData, ...nyseData, ...bseData];
      
      // Process and store stocks
      allStocks.forEach((stock: any) => {
        if (!this.stocks.has(stock.symbol)) { // Avoid duplicates
          const stockWithId = {
            id: this.currentStockId++,
            symbol: stock.symbol,
            name: stock.name,
            market: stock.market,
            currentPrice: stock.currentPrice,
            changePercent: Math.round((Math.random() * 6 - 3) * 100) / 100, // Random daily change
            lastUpdated: new Date(),
          };
          this.stocks.set(stock.symbol, stockWithId);
        }
      });
      
      console.log(`Loaded ${this.stocks.size} stocks from JSON files`);
    } catch (error) {
      console.error('Error loading stock data from JSON:', error);
      // Fallback to minimal data
      this.initializeFallbackStocks();
    }
  }
  
  private initializeFallbackStocks() {
    const fallbackStocks = [
      { symbol: "AAPL", name: "Apple Inc.", market: "US", currentPrice: 192.53, changePercent: 2.4 },
      { symbol: "RELIANCE", name: "Reliance Industries", market: "Indian", currentPrice: 2756.85, changePercent: 2.3 },
      { symbol: "TCS", name: "Tata Consultancy Services", market: "Indian", currentPrice: 4127.30, changePercent: 1.8 },
    ];
    
    fallbackStocks.forEach(stock => {
      const stockWithId = {
        id: this.currentStockId++,
        ...stock,
        lastUpdated: new Date(),
      };
      this.stocks.set(stock.symbol, stockWithId);
    });
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    return this.stocks.get(symbol.toUpperCase());
  }

  async getStocks(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  async getStocksByMarket(market: string): Promise<Stock[]> {
    return Array.from(this.stocks.values()).filter(stock => stock.market === market);
  }

  async createStock(insertStock: InsertStock): Promise<Stock> {
    const stock: Stock = {
      id: this.currentStockId++,
      ...insertStock,
      currentPrice: insertStock.currentPrice ?? null,
      changePercent: insertStock.changePercent ?? null,
      lastUpdated: new Date(),
    };
    this.stocks.set(stock.symbol, stock);
    return stock;
  }

  async updateStock(symbol: string, stockUpdate: Partial<InsertStock>): Promise<Stock | undefined> {
    const existing = this.stocks.get(symbol.toUpperCase());
    if (!existing) return undefined;

    const updated: Stock = {
      ...existing,
      ...stockUpdate,
      lastUpdated: new Date(),
    };
    this.stocks.set(symbol.toUpperCase(), updated);
    return updated;
  }

  async searchStocks(query: string): Promise<Stock[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.stocks.values()).filter(
      stock => 
        stock.symbol.toLowerCase().includes(searchTerm) ||
        stock.name.toLowerCase().includes(searchTerm)
    );
  }

  async getStockAnalysis(stockSymbol: string): Promise<StockAnalysis | undefined> {
    return this.stockAnalyses.get(stockSymbol.toUpperCase());
  }

  async createStockAnalysis(insertAnalysis: InsertStockAnalysis): Promise<StockAnalysis> {
    const analysis: StockAnalysis = {
      id: this.currentAnalysisId++,
      ...insertAnalysis,
      patternType: insertAnalysis.patternType ?? null,
      confidence: insertAnalysis.confidence ?? null,
      breakoutDirection: insertAnalysis.breakoutDirection ?? null,
      breakoutTimeframe: insertAnalysis.breakoutTimeframe ?? null,
      breakoutProbability: insertAnalysis.breakoutProbability ?? null,
      targetPrice: insertAnalysis.targetPrice ?? null,
      stopLoss: insertAnalysis.stopLoss ?? null,
      riskReward: insertAnalysis.riskReward ?? null,
      analysisData: insertAnalysis.analysisData ?? null,
      createdAt: new Date(),
    };
    this.stockAnalyses.set(analysis.stockSymbol.toUpperCase(), analysis);
    return analysis;
  }

  async getLatestAnalysis(): Promise<StockAnalysis[]> {
    return Array.from(this.stockAnalyses.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 10);
  }

  async createChartUpload(insertUpload: InsertChartUpload): Promise<ChartUpload> {
    const upload: ChartUpload = {
      id: this.currentUploadId++,
      ...insertUpload,
      analysisId: insertUpload.analysisId ?? null,
      uploadedAt: new Date(),
    };
    this.chartUploads.set(upload.id, upload);
    return upload;
  }

  async getChartUpload(id: number): Promise<ChartUpload | undefined> {
    return this.chartUploads.get(id);
  }
}

export const storage = new MemStorage();
