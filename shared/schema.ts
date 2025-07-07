import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  market: text("market").notNull(), // 'US' or 'Indian'
  currentPrice: real("current_price"),
  changePercent: real("change_percent"),
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

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = z.infer<typeof insertStockSchema>;
export type StockAnalysis = typeof stockAnalysis.$inferSelect;
export type InsertStockAnalysis = z.infer<typeof insertStockAnalysisSchema>;
export type ChartUpload = typeof chartUploads.$inferSelect;
export type InsertChartUpload = z.infer<typeof insertChartUploadSchema>;
export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
