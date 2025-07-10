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
          


          {/* Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Pattern Recognition */}
              <Card className="business-hover business-shadow border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Pattern Recognition</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-purple-100">{analysis.patternType}</span>
                      <span className="text-2xl font-black text-yellow-300">{analysis.confidence}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full shadow-lg transition-all duration-1000 ease-out" 
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                    <div className="transform scale-105">
                      <PatternVisualization 
                        patternType={analysis.patternType} 
                        confidence={analysis.confidence} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Confidence Score */}
              <Card className="business-hover business-shadow border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">AI Confidence</h4>
                  </div>
                  <div className="text-center">
                    <div className="relative">
                      <div className="text-6xl font-black text-cyan-200 mb-3 scale-in">{analysis.confidence}%</div>
                      <div className="absolute inset-0 text-6xl font-black bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse">{analysis.confidence}%</div>
                    </div>
                    <div className="text-lg font-bold text-cyan-100 mb-6">Neural Network Score</div>
                    {analysis.analysisData?.technicalScore && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="glass-effect rounded-xl p-4 card-hover">
                          <div className="text-cyan-200 font-bold text-xs uppercase tracking-wide">Technical</div>
                          <div className="text-2xl font-black text-white">{analysis.analysisData.technicalScore}%</div>
                        </div>
                        <div className="glass-effect rounded-xl p-4 card-hover">
                          <div className="text-cyan-200 font-bold text-xs uppercase tracking-wide">Volume</div>
                          <div className="text-2xl font-black text-white">{analysis.analysisData.volumeScore}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Breakout Prediction */}
              <Card className="business-hover business-shadow border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full mr-3"></div>
                    <h4 className="text-lg font-semibold text-gray-900">Breakout Forecast</h4>
                  </div>
                  <div className="space-y-6">
                    <div className="glass-effect rounded-xl p-4 flex justify-between items-center card-hover">
                      <span className="text-sm font-bold text-green-100 uppercase tracking-wide">Direction</span>
                      <span className={`font-black text-xl px-4 py-2 rounded-xl capitalize ${
                        analysis.breakoutDirection === 'upward' 
                          ? 'bg-green-400 text-green-900 shadow-lg' 
                          : 'bg-red-400 text-red-900 shadow-lg'
                      }`}>
                        {analysis.breakoutDirection} 🚀
                      </span>
                    </div>
                    <div className="glass-effect rounded-xl p-4 flex justify-between card-hover">
                      <span className="text-sm font-bold text-green-100 uppercase tracking-wide">Timeframe</span>
                      <span className="font-black text-white text-lg">{analysis.breakoutTimeframe}</span>
                    </div>
                    <div className="glass-effect rounded-xl p-4 flex justify-between card-hover">
                      <span className="text-sm font-bold text-green-100 uppercase tracking-wide">Probability</span>
                      <span className="font-black text-xl text-green-300">{analysis.breakoutProbability}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
          
          {/* Additional Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
                        <p className="text-sm text-gray-600">Based on technical analysis and pattern recognition</p>
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
