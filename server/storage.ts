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
    
    // Initialize with popular stocks
    this.initializeStocks();
  }

  private initializeStocks() {
    const popularStocks = [
      // US Stocks
      { symbol: "AAPL", name: "Apple Inc.", market: "US", currentPrice: 185.42, changePercent: 2.4 },
      { symbol: "GOOGL", name: "Alphabet Inc.", market: "US", currentPrice: 142.56, changePercent: -1.2 },
      { symbol: "MSFT", name: "Microsoft Corporation", market: "US", currentPrice: 378.85, changePercent: 1.8 },
      { symbol: "TSLA", name: "Tesla Inc.", market: "US", currentPrice: 248.73, changePercent: 5.7 },
      { symbol: "NVDA", name: "NVIDIA Corporation", market: "US", currentPrice: 875.34, changePercent: 3.8 },
      { symbol: "AMZN", name: "Amazon.com Inc.", market: "US", currentPrice: 152.74, changePercent: 0.9 },
      { symbol: "META", name: "Meta Platforms Inc.", market: "US", currentPrice: 485.23, changePercent: -0.5 },
      { symbol: "NFLX", name: "Netflix Inc.", market: "US", currentPrice: 578.12, changePercent: 2.1 },
      
      // Indian Stocks
      { symbol: "TCS", name: "Tata Consultancy Services", market: "Indian", currentPrice: 3842.0, changePercent: 1.8 },
      { symbol: "RELIANCE", name: "Reliance Industries", market: "Indian", currentPrice: 2756.0, changePercent: 2.3 },
      { symbol: "HDFCBANK", name: "HDFC Bank", market: "Indian", currentPrice: 1678.5, changePercent: 0.7 },
      { symbol: "INFY", name: "Infosys Limited", market: "Indian", currentPrice: 1845.2, changePercent: 1.2 },
      { symbol: "WIPRO", name: "Wipro Limited", market: "Indian", currentPrice: 567.8, changePercent: -0.3 },
      { symbol: "ITC", name: "ITC Limited", market: "Indian", currentPrice: 412.3, changePercent: 1.5 },
      { symbol: "SBIN", name: "State Bank of India", market: "Indian", currentPrice: 789.6, changePercent: 0.8 },
      { symbol: "LT", name: "Larsen & Toubro", market: "Indian", currentPrice: 3456.7, changePercent: 2.1 },
    ];

    popularStocks.forEach(stock => {
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
