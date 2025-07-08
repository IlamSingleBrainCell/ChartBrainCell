import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Shield, AlertTriangle, ShoppingCart } from "lucide-react";
import { StockChart } from "./stock-chart";

interface AnalysisResultsProps {
  analysis: any;
  stock?: any;
}

export function AnalysisResults({ analysis, stock }: AnalysisResultsProps) {
  if (!analysis) return null;

  const isCustomChart = analysis.stockSymbol === "CUSTOM_CHART";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Analysis Results</h2>
          <p className="text-xl text-brand-gray">
            Comprehensive AI-powered pattern analysis and predictions
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Visualization */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-brand-dark">
                      {isCustomChart ? "Custom Chart Analysis" : `${analysis.stockSymbol} - 3 Month Analysis`}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={analysis.breakoutDirection === 'upward' ? 'default' : 'secondary'}
                        className={analysis.breakoutDirection === 'upward' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {analysis.breakoutDirection === 'upward' ? 'Bullish' : 'Bearish'} Pattern
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {analysis.confidence >= 80 ? 'High' : analysis.confidence >= 60 ? 'Medium' : 'Low'} Confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <StockChart symbol={analysis.stockSymbol} analysisData={analysis} />
                  
                  {!isCustomChart && stock && (
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+{analysis.analysisData?.threeMonthReturn || 12.5}%</div>
                        <div className="text-sm text-brand-gray">3M Return</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {stock.market === 'Indian' ? '₹' : '$'}{stock.currentPrice?.toFixed(2)}
                        </div>
                        <div className="text-sm text-brand-gray">Current Price</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">
                          {analysis.targetPrice ? (
                            `${stock.market === 'Indian' ? '₹' : '$'}${analysis.targetPrice.toFixed(2)}`
                          ) : 'N/A'}
                        </div>
                        <div className="text-sm text-brand-gray">Target Price</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{analysis.breakoutTimeframe}</div>
                        <div className="text-sm text-brand-gray">Breakout Window</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Analysis Details */}
            <div className="space-y-6">
              {/* Pattern Recognition */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="text-blue-600 mr-2" size={20} />
                    <h4 className="text-lg font-semibold text-brand-dark">Pattern Recognition</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-gray">{analysis.patternType}</span>
                      <span className="font-semibold text-green-600">{analysis.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${analysis.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Confidence Score */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-brand-dark mb-4">Confidence Score</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{analysis.confidence}%</div>
                    <div className="text-brand-gray mb-4">Overall Confidence</div>
                    {analysis.analysisData?.technicalScore && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-brand-gray">Technical</div>
                          <div className="font-semibold">{analysis.analysisData.technicalScore}%</div>
                        </div>
                        <div>
                          <div className="text-brand-gray">Volume</div>
                          <div className="font-semibold">{analysis.analysisData.volumeScore}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Breakout Prediction */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="text-purple-600 mr-2" size={20} />
                    <h4 className="text-lg font-semibold text-brand-dark">Breakout Prediction</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-brand-gray">Expected Direction</span>
                      <span className={`font-semibold capitalize ${
                        analysis.breakoutDirection === 'upward' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {analysis.breakoutDirection}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray">Timeframe</span>
                      <span className="font-semibold text-brand-dark">{analysis.breakoutTimeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-gray">Probability</span>
                      <span className="font-semibold text-blue-600">{analysis.breakoutProbability}%</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
