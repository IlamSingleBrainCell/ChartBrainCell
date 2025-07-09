import { stocks, stockAnalysis, chartUploads, portfolio, portfolioTransactions, type Stock, type InsertStock, type StockAnalysis, type InsertStockAnalysis, type ChartUpload, type InsertChartUpload, type Portfolio, type InsertPortfolio, type PortfolioTransaction, type InsertPortfolioTransaction } from "@shared/schema";

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
  
  // Portfolio operations
  getPortfolio(userId?: string): Promise<Portfolio[]>;
  addToPortfolio(portfolioItem: InsertPortfolio): Promise<Portfolio>;
  updatePortfolioItem(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined>;
  removeFromPortfolio(id: number): Promise<boolean>;
  getPortfolioItem(id: number): Promise<Portfolio | undefined>;
  
  // Portfolio transaction operations
  addTransaction(transaction: InsertPortfolioTransaction): Promise<PortfolioTransaction>;
  getPortfolioTransactions(portfolioId: number): Promise<PortfolioTransaction[]>;
  getPortfolioPerformance(userId?: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock>;
  private stockAnalyses: Map<string, StockAnalysis>;
  private chartUploads: Map<number, ChartUpload>;
  private portfolioItems: Map<number, Portfolio>;
  private portfolioTransactions: Map<number, PortfolioTransaction>;
  private currentStockId: number;
  private currentAnalysisId: number;
  private currentUploadId: number;
  private currentPortfolioId: number;
  private currentTransactionId: number;

  constructor() {
    this.stocks = new Map();
    this.stockAnalyses = new Map();
    this.chartUploads = new Map();
    this.portfolioItems = new Map();
    this.portfolioTransactions = new Map();
    this.currentStockId = 1;
    this.currentAnalysisId = 1;
    this.currentUploadId = 1;
    this.currentPortfolioId = 1;
    this.currentTransactionId = 1;
    
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
            changePercent: this.generateRealisticChange(stock.symbol, stock.market), // Realistic market-based change
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
  
  // Generate realistic price changes based on market data patterns
  private generateRealisticChange(symbol: string, market: string): number {
    const now = new Date();
    const hour = now.getHours();
    
    // Market hours: Indian (9-15), US (9-16) 
    const isMarketHours = market === 'Indian' ? 
      (hour >= 9 && hour <= 15) : 
      (hour >= 9 && hour <= 16);
    
    // Base volatility
    let volatility = isMarketHours ? 2.5 : 0.8;
    
    // Symbol-specific patterns
    const highVolatilitySymbols = ['TSLA', 'NVDA', 'GME', 'SBIN', 'RELIANCE'];
    const lowVolatilitySymbols = ['AAPL', 'MSFT', 'TCS', 'INFY'];
    
    if (highVolatilitySymbols.includes(symbol)) volatility *= 1.8;
    if (lowVolatilitySymbols.includes(symbol)) volatility *= 0.6;
    
    // Generate realistic change with slight positive bias
    const change = (Math.random() - 0.45) * volatility;
    return Math.round(change * 100) / 100;
  }

  private initializeFallbackStocks() {
    const fallbackStocks = [
      { symbol: "AAPL", name: "Apple Inc.", market: "US", currentPrice: 192.53 },
      { symbol: "RELIANCE", name: "Reliance Industries", market: "Indian", currentPrice: 2756.85 },
      { symbol: "TCS", name: "Tata Consultancy Services", market: "Indian", currentPrice: 4127.30 },
    ];
    
    fallbackStocks.forEach(stock => {
      const stockWithId = {
        id: this.currentStockId++,
        ...stock,
        changePercent: this.generateRealisticChange(stock.symbol, stock.market),
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

  // Portfolio operations
  async getPortfolio(userId: string = "guest"): Promise<Portfolio[]> {
    return Array.from(this.portfolioItems.values()).filter(item => item.userId === userId);
  }

  async addToPortfolio(portfolioItem: InsertPortfolio): Promise<Portfolio> {
    const portfolio: Portfolio = {
      id: this.currentPortfolioId++,
      userId: portfolioItem.userId || "guest",
      stockSymbol: portfolioItem.stockSymbol,
      quantity: portfolioItem.quantity,
      buyPrice: portfolioItem.buyPrice,
      purchaseDate: portfolioItem.purchaseDate,
      notes: portfolioItem.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.portfolioItems.set(portfolio.id, portfolio);
    return portfolio;
  }

  async updatePortfolioItem(id: number, updates: Partial<InsertPortfolio>): Promise<Portfolio | undefined> {
    const existing = this.portfolioItems.get(id);
    if (!existing) return undefined;

    const updated: Portfolio = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.portfolioItems.set(id, updated);
    return updated;
  }

  async removeFromPortfolio(id: number): Promise<boolean> {
    return this.portfolioItems.delete(id);
  }

  async getPortfolioItem(id: number): Promise<Portfolio | undefined> {
    return this.portfolioItems.get(id);
  }

  // Portfolio transaction operations
  async addTransaction(transaction: InsertPortfolioTransaction): Promise<PortfolioTransaction> {
    const portfolioTransaction: PortfolioTransaction = {
      id: this.currentTransactionId++,
      portfolioId: transaction.portfolioId,
      type: transaction.type,
      quantity: transaction.quantity,
      price: transaction.price,
      transactionDate: transaction.transactionDate,
      fees: transaction.fees || "0",
      notes: transaction.notes || null,
      createdAt: new Date(),
    };
    
    this.portfolioTransactions.set(portfolioTransaction.id, portfolioTransaction);
    return portfolioTransaction;
  }

  async getPortfolioTransactions(portfolioId: number): Promise<PortfolioTransaction[]> {
    return Array.from(this.portfolioTransactions.values()).filter(t => t.portfolioId === portfolioId);
  }

  async getPortfolioPerformance(userId: string = "guest"): Promise<any> {
    const userPortfolio = await this.getPortfolio(userId);
    const performance = [];

    for (const item of userPortfolio) {
      const currentStock = await this.getStock(item.stockSymbol);
      if (!currentStock) continue;

      const currentValue = currentStock.currentPrice * item.quantity;
      const investedValue = parseFloat(item.buyPrice) * item.quantity;
      const gainLoss = currentValue - investedValue;
      const gainLossPercent = (gainLoss / investedValue) * 100;

      performance.push({
        ...item,
        currentPrice: currentStock.currentPrice,
        currentValue: Math.round(currentValue * 100) / 100,
        investedValue: Math.round(investedValue * 100) / 100,
        gainLoss: Math.round(gainLoss * 100) / 100,
        gainLossPercent: Math.round(gainLossPercent * 100) / 100,
        stockName: currentStock.name,
        market: currentStock.market
      });
    }

    return performance;
  }
}

export const storage = new MemStorage();
