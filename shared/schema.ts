import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  market: text("market").notNull(), // 'US' or 'Indian'
  currentPrice: real("current_price"),
  changePercent: real("change_percent"),
  dayHigh: real("day_high"),
  dayLow: real("day_low"),
  volume: integer("volume"),
  marketCap: real("market_cap"),
  peRatio: real("pe_ratio"),
  pbRatio: real("pb_ratio"),
  weekHigh52: real("week_high_52"),
  weekLow52: real("week_low_52"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const stockAnalysis = pgTable("stock_analysis", {
  id: serial("id").primaryKey(),
  stockSymbol: text("stock_symbol").notNull(),
  patternType: text("pattern_type"),
  confidence: real("confidence"),
  breakoutDirection: text("breakout_direction"), // 'upward' or 'downward'
  breakoutTimeframe: text("breakout_timeframe"),
  breakoutProbability: real("breakout_probability"),
  targetPrice: real("target_price"),
  stopLoss: real("stop_loss"),
  riskReward: text("risk_reward"),
  projectedBreakoutDate: text("projected_breakout_date"),
  analysisData: jsonb("analysis_data"), // Store chart data and metrics
  createdAt: timestamp("created_at").defaultNow(),
});

export const chartUploads = pgTable("chart_uploads", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  analysisId: integer("analysis_id"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// User Portfolio Management
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("guest"), // For future user authentication
  stockSymbol: text("stock_symbol").notNull(),
  quantity: integer("quantity").notNull(),
  buyPrice: decimal("buy_price", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const portfolioTransactions = pgTable("portfolio_transactions", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").references(() => portfolio.id),
  type: text("type").notNull(), // 'buy' or 'sell'
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStockSchema = createInsertSchema(stocks).omit({
  id: true,
  lastUpdated: true,
});

export const insertStockAnalysisSchema = createInsertSchema(stockAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertChartUploadSchema = createInsertSchema(chartUploads).omit({
  id: true,
  uploadedAt: true,
});

export const stockSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

export const insertPortfolioSchema = createInsertSchema(portfolio).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPortfolioTransactionSchema = createInsertSchema(portfolioTransactions).omit({
  id: true,
  createdAt: true,
});

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
export type StockAnalysis = typeof stockAnalysis.$inferSelect;
export type InsertStockAnalysis = z.infer<typeof insertStockAnalysisSchema>;
export type ChartUpload = typeof chartUploads.$inferSelect;
export type InsertChartUpload = z.infer<typeof insertChartUploadSchema>;
export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
export type Portfolio = typeof portfolio.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PortfolioTransaction = typeof portfolioTransactions.$inferSelect;
export type InsertPortfolioTransaction = z.infer<typeof insertPortfolioTransactionSchema>;
