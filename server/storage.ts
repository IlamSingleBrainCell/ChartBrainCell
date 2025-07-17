import { stocks, stockAnalysis, chartUploads, portfolio, portfolioTransactions, type Stock, type InsertStock, type StockAnalysis, type InsertStockAnalysis, type ChartUpload, type InsertChartUpload, type Portfolio, type InsertPortfolio, type PortfolioTransaction, type InsertPortfolioTransaction } from "@shared/schema";
import { yahooFinanceService, type YahooQuote } from "./yahoo-finance";

export interface IStorage {
  // Stock operations
  getStock(symbol: string): Promise<Stock | undefined>;
  getStocks(): Promise<Stock[]>;
  getStocksByMarket(market: string): Promise<Stock[]>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(symbol: string, stock: Partial<InsertStock>): Promise<Stock | undefined>;
  searchStocks(query: string): Promise<Stock[]>;
  updateStockPricesFromYahoo(): Promise<void>;
  getYahooQuote(symbol: string): Promise<YahooQuote | null>;
  getHistoricalData(symbol: string, period?: string): Promise<any[]>;
  
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
      // Load NSE stocks from CSV file
      const fs = await import('fs');
      const path = await import('path');
      
      const csvPath = path.join(process.cwd(), 'attached_assets', 'EQUITY_L_1752411351496.csv');
      
      if (fs.existsSync(csvPath)) {
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const lines = csvData.split('\n').slice(1); // Skip header
        
        // Process top 100 NSE stocks for better performance
        const nseStocks = lines.slice(0, 100).map((line, index) => {
          const [symbol, name] = line.split(',');
          if (symbol && name) {
            return {
              id: index + 1,
              symbol: symbol.trim(),
              name: name.trim(),
              market: "Indian",
              currentPrice: 0, // Will be updated from Yahoo Finance
              changePercent: 0,
              dayHigh: 0,
              dayLow: 0,
              volume: 0,
              marketCap: 0,
              peRatio: 0,
              pbRatio: 0,
              weekHigh52: 0,
              weekLow52: 0,
              lastUpdated: new Date()
            };
          }
          return null;
        }).filter(Boolean) as Stock[];
        
        // Add these stocks to our map with .NS suffix for Yahoo Finance
        nseStocks.forEach(stock => {
          if (stock) {
            this.stocks.set(stock.symbol, stock);
          }
        });
        
        console.log(`Loaded ${nseStocks.length} NSE stocks from CSV`);
      }
      
      // Add popular US stocks
      const usStocks = [
        { symbol: "AAPL", name: "Apple Inc.", market: "US" },
        { symbol: "GOOGL", name: "Alphabet Inc.", market: "US" },
        { symbol: "MSFT", name: "Microsoft Corporation", market: "US" },
        { symbol: "AMZN", name: "Amazon.com Inc.", market: "US" },
        { symbol: "TSLA", name: "Tesla Inc.", market: "US" },
        { symbol: "META", name: "Meta Platforms Inc.", market: "US" },
        { symbol: "NVDA", name: "NVIDIA Corporation", market: "US" },
        { symbol: "NFLX", name: "Netflix Inc.", market: "US" },
        { symbol: "BABA", name: "Alibaba Group Holding Limited", market: "US" },
        { symbol: "CRM", name: "Salesforce Inc.", market: "US" },
        { symbol: "ORCL", name: "Oracle Corporation", market: "US" },
        { symbol: "AMD", name: "Advanced Micro Devices Inc.", market: "US" },
        { symbol: "PYPL", name: "PayPal Holdings Inc.", market: "US" },
        { symbol: "ADBE", name: "Adobe Inc.", market: "US" },
        { symbol: "INTC", name: "Intel Corporation", market: "US" },
        { symbol: "CSCO", name: "Cisco Systems Inc.", market: "US" },
        { symbol: "PEP", name: "PepsiCo Inc.", market: "US" },
        { symbol: "KO", name: "The Coca-Cola Company", market: "US" },
        { symbol: "DIS", name: "The Walt Disney Company", market: "US" },
        { symbol: "VZ", name: "Verizon Communications Inc.", market: "US" }
      ];
      
      // Add US stocks to the map
      usStocks.forEach((stock, index) => {
        const stockData: Stock = {
          id: this.stocks.size + index + 1,
          symbol: stock.symbol,
          name: stock.name,
          market: stock.market,
          currentPrice: 0,
          changePercent: 0,
          dayHigh: 0,
          dayLow: 0,
          volume: 0,
          marketCap: 0,
          peRatio: 0,
          pbRatio: 0,
          weekHigh52: 0,
          weekLow52: 0,
          lastUpdated: new Date()
        };
        this.stocks.set(stock.symbol, stockData);
      });
      
      console.log(`Loaded ${this.stocks.size} stocks total`);
      
      // Update all stock prices from Yahoo Finance immediately
      this.updateStockPricesFromYahoo();
    } catch (error) {
      console.error('Error loading stock data:', error);
    }
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
      dayHigh: null,
      dayLow: null,
      volume: null,
      marketCap: null,
      peRatio: null,
      pbRatio: null,
      weekHigh52: null,
      weekLow52: null,
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
      projectedBreakoutDate: insertAnalysis.projectedBreakoutDate ?? null,
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
      quantity: updates.quantity ?? existing.quantity,
      buyPrice: updates.buyPrice ?? existing.buyPrice,
      purchaseDate: updates.purchaseDate ?? existing.purchaseDate,
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

      const currentValue = (currentStock.currentPrice ?? 0) * item.quantity;
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

  async updateStockPricesFromYahoo(): Promise<void> {
    try {
      const allStocks = Array.from(this.stocks.values());
      let symbols = allStocks.map(stock => {
        // Add .NS suffix for Indian stocks for Yahoo Finance API
        return stock.market === 'Indian' ? `${stock.symbol}.NS` : stock.symbol;
      });
      
      console.log(`Updating prices for ${symbols.length} stocks from Yahoo Finance...`);
      
      const quotes = await yahooFinanceService.getMultipleQuotes(symbols);
      
      for (const [yahooSymbol, quote] of Object.entries(quotes)) {
        // Extract original symbol (remove .NS suffix if present)
        const originalSymbol = yahooSymbol.replace('.NS', '');
        const existingStock = this.stocks.get(originalSymbol);
        
        if (existingStock && quote) {
          // Update with real Yahoo Finance data ONLY - no fallbacks
          const updatedStock: Stock = {
            ...existingStock,
            currentPrice: quote.regularMarketPrice || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            dayHigh: quote.regularMarketDayHigh || 0,
            dayLow: quote.regularMarketDayLow || 0,
            volume: quote.regularMarketVolume || 0,
            marketCap: quote.marketCap || 0,
            peRatio: quote.trailingPE || 0,
            pbRatio: quote.priceToBook || 0,
            weekHigh52: quote.fiftyTwoWeekHigh || 0,
            weekLow52: quote.fiftyTwoWeekLow || 0,
            lastUpdated: new Date()
          } as Stock;
          
          this.stocks.set(originalSymbol, updatedStock);
        }
      }
      
      console.log(`Successfully updated ${Object.keys(quotes).length} stock prices`);
    } catch (error) {
      console.error('Error updating stock prices from Yahoo Finance:', error);
    }
  }

  async getYahooQuote(symbol: string): Promise<YahooQuote | null> {
    try {
      // Add .NS suffix for Indian stocks
      const yahooSymbol = this.stocks.get(symbol)?.market === 'Indian' ? `${symbol}.NS` : symbol;
      return await yahooFinanceService.getQuote(yahooSymbol);
    } catch (error) {
      console.error(`Error fetching Yahoo quote for ${symbol}:`, error);
      return null;
    }
  }

  async getHistoricalData(symbol: string, period: string = '3mo'): Promise<any[]> {
    try {
      const validPeriod = ['3mo', '1y', '5y', '10y'].includes(period) 
        ? period as '3mo' | '1y' | '5y' | '10y' 
        : '3mo';
      
      // Add .NS suffix for Indian stocks
      const yahooSymbol = this.stocks.get(symbol)?.market === 'Indian' ? `${symbol}.NS` : symbol;
      return await yahooFinanceService.getHistoricalData(yahooSymbol, validPeriod);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }
}

export const storage = new MemStorage();
