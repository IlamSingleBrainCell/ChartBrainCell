import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Shield, AlertTriangle, ShoppingCart, Plus } from "lucide-react";
import { StockChart } from "./stock-chart";
import { PatternVisualization } from "./pattern-visualization";
import { StockNews } from "./stock-news";
import { AddToPortfolioDialog } from "./add-to-portfolio-dialog";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalysisResultsProps {
  analysis: any;
  stock?: any;
}

export function AnalysisResults({ analysis, stock }: AnalysisResultsProps) {
  const [showAddToPortfolio, setShowAddToPortfolio] = useState(false);
  
  // Fetch real Yahoo Finance quote for additional data
  const { data: yahooQuote, isLoading: quoteLoading } = useQuery({
    queryKey: [`/api/yahoo/quote/${analysis?.stockSymbol}`],
    queryFn: () => apiRequest('GET', `/api/yahoo/quote/${analysis.stockSymbol}`),
    enabled: !!analysis?.stockSymbol && analysis.stockSymbol !== "CUSTOM_CHART",
  });
  
  if (!analysis) return null;

  const isCustomChart = analysis.stockSymbol === "CUSTOM_CHART";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Analysis Results</h2>
          <p className="text-xl text-brand-gray">
            Comprehensive pattern analysis and predictions
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 lg:p-8">
          {/* Main Chart Section */}
          <div className="mb-8">
            <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-slate-50 to-gray-50 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {isCustomChart ? "Custom Chart Analysis" : analysis.stockSymbol}
                    </h3>
                    <p className="text-gray-600 font-medium">Real-time 3-Month Professional Analysis</p>
                    {yahooQuote && (
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-blue-600 font-medium">
                          {yahooQuote.fullExchangeName || yahooQuote.exchange}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">
                          Market: {yahooQuote.marketState}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">
                          Currency: {yahooQuote.currency}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Badge 
                      variant="secondary"
                      className={`px-4 py-2 text-sm font-bold ${
                        analysis.breakoutDirection === 'upward' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                      }`}
                    >
                      {analysis.breakoutDirection === 'upward' ? 'Bullish' : 'Bearish'} Pattern
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm font-bold text-blue-600 border-blue-600 bg-blue-50">
                      {analysis.confidence >= 80 ? 'High' : analysis.confidence >= 60 ? 'Medium' : 'Low'} Confidence
                    </Badge>
                  </div>
                </div>
                
                {/* Add to Portfolio Button */}
                {!isCustomChart && stock && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={() => setShowAddToPortfolio(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2"
                    >
                      <Plus className="mr-2" size={16} />
                      Add to Portfolio
                    </Button>
                  </div>
                )}
                
                <StockChart 
                  symbol={analysis.stockSymbol} 
                  analysisData={analysis} 
                  stock={stock} 
                  isCustomChart={isCustomChart}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Horizontal Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Pattern Recognition */}
              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <h4 className="text-lg font-bold text-purple-900">Pattern Recognition</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-700">{analysis.patternType}</span>
                      <span className="text-lg font-bold text-green-600">{analysis.confidence}%</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-sm" 
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                    <PatternVisualization 
                      patternType={analysis.patternType} 
                      confidence={analysis.confidence} 
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Confidence Score */}
              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <h4 className="text-lg font-bold text-blue-900">Confidence Score</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{analysis.confidence}%</div>
                    <div className="text-sm font-medium text-blue-700 mb-4">Overall Confidence</div>
                    {analysis.analysisData?.technicalScore && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="text-blue-600 font-medium">Technical</div>
                          <div className="text-xl font-bold text-blue-900">{analysis.analysisData.technicalScore}%</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                          <div className="text-blue-600 font-medium">Volume</div>
                          <div className="text-xl font-bold text-blue-900">{analysis.analysisData.volumeScore}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Breakout Prediction */}
              <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                    <h4 className="text-lg font-bold text-emerald-900">Breakout Prediction</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/60 rounded-lg p-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-emerald-700">Expected Direction</span>
                      <span className={`font-bold text-lg px-3 py-1 rounded-full capitalize ${
                        analysis.breakoutDirection === 'upward' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {analysis.breakoutDirection}
                      </span>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 flex justify-between">
                      <span className="text-sm font-medium text-emerald-700">Timeframe</span>
                      <span className="font-bold text-emerald-900">{analysis.breakoutTimeframe}</span>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 flex justify-between">
                      <span className="text-sm font-medium text-emerald-700">Probability</span>
                      <span className="font-bold text-xl text-blue-600">{analysis.breakoutProbability}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Risk Assessment */}
              {analysis.riskReward && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Shield className="text-yellow-600 mr-2" size={20} />
                      <h4 className="text-lg font-semibold text-brand-dark">Risk Assessment</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-brand-gray">Risk Level</span>
                        <span className="font-semibold text-yellow-600">
                          {analysis.analysisData?.riskLevel || 'Moderate'}
                        </span>
                      </div>
                      {analysis.stopLoss && (
                        <div className="flex justify-between">
                          <span className="text-brand-gray">Stop Loss</span>
                          <span className="font-semibold text-red-500">
                            {stock?.market === 'Indian' ? '₹' : '$'}{analysis.stopLoss.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-brand-gray">Risk/Reward</span>
                        <span className="font-semibold text-green-600">{analysis.riskReward}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Buy/Sell Recommendation */}
              {analysis.analysisData?.recommendation && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <ShoppingCart className="text-green-600 mr-2" size={20} />
                      <h4 className="text-lg font-semibold text-brand-dark">Investment Recommendation</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                        <div className={`text-2xl font-bold mb-2 ${
                          analysis.analysisData.recommendation === 'Strong Buy' ? 'text-green-700' :
                          analysis.analysisData.recommendation === 'Buy' ? 'text-green-600' :
                          analysis.analysisData.recommendation === 'Hold' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {analysis.analysisData.recommendation}
                        </div>
                        <p className="text-sm text-gray-600">Based on 10-year analysis, book value & current price</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-gray">Book Value</span>
                            <span className="font-semibold">
                              {stock?.market === 'Indian' ? '₹' : '$'}{analysis.analysisData.bookValue}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-gray">P/B Ratio</span>
                            <span className="font-semibold">{analysis.analysisData.priceToBook}x</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-brand-gray">10Y Growth</span>
                            <span className="font-semibold text-green-600">+{analysis.analysisData.tenYearGrowth}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-gray">Fair Value</span>
                            <span className={`font-semibold ${
                              analysis.analysisData.priceToBook < 1.5 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {analysis.analysisData.priceToBook < 1.5 ? 'Undervalued' : 'Overvalued'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
          
          {/* Latest News - Full Width Below Horizontal Cards */}
          {!isCustomChart && stock && (
            <div className="mt-8">
              <StockNews symbol={analysis.stockSymbol} stock={stock} />
            </div>
          )}
        </div>
        
        {/* Add to Portfolio Dialog */}
        {!isCustomChart && stock && (
          <AddToPortfolioDialog 
            open={showAddToPortfolio}
            onOpenChange={setShowAddToPortfolio}
            defaultStock={analysis.stockSymbol}
          />
        )}
      </div>
    </section>
  );
}
