import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ProfessionalStockChartProps {
  symbol: string;
  analysisData: any;
  stock?: any;
  isCustomChart?: boolean;
}

export function ProfessionalStockChart({ symbol, analysisData, stock, isCustomChart = false }: ProfessionalStockChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('3mo');

  const { data: historicalData, isLoading } = useQuery({
    queryKey: [`/api/yahoo/historical/${symbol}`, selectedPeriod],
    queryFn: () => fetch(`/api/yahoo/historical/${symbol}?period=${selectedPeriod}`).then(res => res.json()),
    enabled: !isCustomChart && !!symbol,
  });

  // Fetch current market data
  const { data: currentQuote } = useQuery({
    queryKey: [`/api/yahoo/quote/${symbol}`],
    queryFn: () => fetch(`/api/yahoo/quote/${symbol}`).then(res => res.json()),
    enabled: !isCustomChart && !!symbol,
  });

  // Enhanced currency formatting based on symbol and market
  const formatPrice = (value: number, showCurrency: boolean = true) => {
    const isIndian = symbol.endsWith('.NS') || symbol.endsWith('.BO') || stock?.market === 'Indian';
    const currency = isIndian ? '₹' : '$';
    
    if (!showCurrency) {
      if (value >= 10000) return `${(value / 1000).toFixed(1)}K`;
      if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
      return value.toFixed(2);
    }
    
    if (value >= 10000) return `${currency}${(value / 1000).toFixed(1)}K`;
    if (value >= 1000) return `${currency}${(value / 1000).toFixed(2)}K`;
    return `${currency}${value.toFixed(2)}`;
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
          <p className="text-xs text-gray-500 mb-2 font-medium">{new Date(label).toLocaleDateString()}</p>
          <div className="space-y-1">
            <p className="text-sm flex justify-between">
              <span className="text-gray-600">Open:</span> 
              <span className="font-bold text-blue-600">{formatPrice(data.open)}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-gray-600">High:</span> 
              <span className="font-bold text-green-600">{formatPrice(data.high)}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-gray-600">Low:</span> 
              <span className="font-bold text-red-600">{formatPrice(data.low)}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span className="text-gray-600">Close:</span> 
              <span className="font-bold text-blue-800">{formatPrice(data.close)}</span>
            </p>
            <div className="border-t border-gray-200 pt-1 mt-2">
              <p className="text-xs text-gray-500">Volume: {(data.volume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isCustomChart) {
    return (
      <Card className="w-full border border-gray-200 shadow-lg bg-white">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="flex items-center justify-between text-lg font-bold text-gray-800">
            <span>Custom Chart Analysis</span>
            <Badge className="bg-blue-600 text-white px-3 py-1">
              Pattern Detected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Custom Chart Analysis Complete
              </p>
              <p className="text-sm text-gray-500">
                Pattern recognition applied to uploaded chart
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full border border-gray-200 shadow-lg">
        <CardContent className="h-96 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading chart data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!historicalData || historicalData.length === 0) {
    return (
      <Card className="w-full border border-gray-200 shadow-lg">
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-lg text-gray-500">No chart data available for {symbol}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = historicalData.map((item: any) => ({
    date: item.date,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume / 1000000 // Convert to millions
  }));

  const prices = chartData.map((d: any) => d.close);
  const highs = chartData.map((d: any) => d.high);
  const lows = chartData.map((d: any) => d.low);
  const volumes = chartData.map((d: any) => d.volume);
  const currentPrice = currentQuote?.regularMarketPrice || prices[prices.length - 1];
  const maxVolume = Math.max(...volumes);

  // Calculate support and resistance from actual price data
  const supportLevel = analysisData?.analysisData?.keyLevels?.support || Math.min(...prices);
  const resistanceLevel = analysisData?.analysisData?.keyLevels?.resistance || Math.max(...prices);

  // Generate pattern animation points for Double Bottom
  const generateDoubleBottomAnimation = () => {
    if (analysisData?.patternType !== 'Double Bottom') return [];
    
    const valleys = [];
    for (let i = 1; i < lows.length - 1; i++) {
      if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
        valleys.push({ index: i, value: lows[i], date: chartData[i].date });
      }
    }
    
    // Get the two lowest valleys for double bottom
    const sortedValleys = valleys.sort((a, b) => a.value - b.value).slice(0, 2);
    if (sortedValleys.length >= 2) {
      return sortedValleys.sort((a, b) => a.index - b.index);
    }
    return [];
  };

  const doubleBottomPoints = generateDoubleBottomAnimation();

  return (
    <Card className="w-full border border-gray-200 shadow-xl bg-white">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {symbol} - {selectedPeriod === '3mo' ? '3 Months' : selectedPeriod === '1y' ? '1 Year' : selectedPeriod === '5y' ? '5 Years' : '10 Years'} Chart
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600 text-white px-3 py-1 font-medium">
                ✓ Yahoo Finance Price Data
              </Badge>
              {analysisData && (
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-blue-700">{analysisData.patternType}</span> pattern detected • 
                  <span className="ml-1 font-bold text-green-600">Confidence: {analysisData.confidence}%</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Professional Time Range Selector */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            {[
              { key: '3mo', label: '3 Months' },
              { key: '1y', label: '1 Year' },
              { key: '5y', label: '5 Years' },
              { key: '10y', label: '10 Years' }
            ].map((period) => (
              <Button
                key={period.key}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPeriod(period.key)}
                className={`rounded-md transition-all duration-200 px-4 py-2 text-sm font-medium ${
                  selectedPeriod === period.key 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Professional Price Display with Current Market Data */}
        {!isCustomChart && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Current Price</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(currentPrice)}
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-medium animate-pulse">
                    ● Live Price
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-600 text-xs">
                    Yahoo Finance
                  </Badge>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-1">24h Change</div>
                <div className={`text-3xl font-bold mb-2 ${
                  (currentQuote?.regularMarketChangePercent || stock?.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-500'
                }`}>
                  {(currentQuote?.regularMarketChangePercent || stock?.changePercent || 0) >= 0 ? '+' : ''}
                  {(currentQuote?.regularMarketChangePercent || stock?.changePercent || 0)?.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500">
                  {(currentQuote?.regularMarketChangePercent || stock?.changePercent || 0) >= 0 ? '↗️' : '↘️'} 
                  {(currentQuote?.regularMarketChangePercent || stock?.changePercent || 0) >= 0 ? 'Gaining' : 'Declining'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-500 mb-1">Market Status</div>
                <div className="text-lg font-bold text-blue-600 mb-1">
                  {currentQuote?.marketState || 'REGULAR'}
                </div>
                <div className="text-sm text-gray-600">
                  Vol: {currentQuote?.regularMarketVolume ? 
                    `${(currentQuote.regularMarketVolume / 1000000).toFixed(1)}M` : 
                    'N/A'
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currentQuote?.fullExchangeName || currentQuote?.exchange || 'Market'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Professional Chart */}
        <div className="h-96 bg-white rounded-lg border border-gray-200 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="1 1" stroke="#e5e7eb" opacity={0.6} />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDateShort}
                stroke="#6b7280"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              
              <YAxis 
                yAxisId="price"
                tickFormatter={formatPrice}
                stroke="#6b7280"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                domain={['dataMin * 0.98', 'dataMax * 1.02']}
              />
              
              <YAxis 
                yAxisId="volume"
                orientation="right"
                tickFormatter={(value) => `${value.toFixed(1)}M`}
                stroke="#9ca3af"
                fontSize={10}
                axisLine={false}
                tickLine={false}
                domain={[0, maxVolume * 4]}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Support and Resistance Lines with Proper Currency */}
              {supportLevel && (
                <ReferenceLine 
                  yAxisId="price"
                  y={supportLevel} 
                  stroke="#10b981" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Support ${formatPrice(supportLevel)}`, 
                    position: "insideTopLeft",
                    style: { fill: '#10b981', fontWeight: 'bold', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: '3px' }
                  }}
                />
              )}
              {resistanceLevel && (
                <ReferenceLine 
                  yAxisId="price"
                  y={resistanceLevel} 
                  stroke="#ef4444" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Resistance ${formatPrice(resistanceLevel)}`, 
                    position: "insideTopLeft",
                    style: { fill: '#ef4444', fontWeight: 'bold', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: '3px' }
                  }}
                />
              )}

              {/* Double Bottom Pattern Animation */}
              {analysisData?.patternType === 'Double Bottom' && doubleBottomPoints.length >= 2 && (
                <>
                  {doubleBottomPoints.map((point, index) => (
                    <ReferenceLine 
                      key={`double-bottom-${index}`}
                      yAxisId="price"
                      y={point.value} 
                      stroke="#ff6b35" 
                      strokeDasharray="4 4" 
                      strokeWidth={2}
                      opacity={0.7}
                      label={{ 
                        value: `Bottom ${index + 1}`, 
                        position: index === 0 ? "insideTopLeft" : "insideTopRight",
                        style: { fill: '#ff6b35', fontWeight: 'bold', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '1px 3px', borderRadius: '2px' }
                      }}
                    />
                  ))}
                  {/* Connect the two bottoms with a dotted line */}
                  <ReferenceLine 
                    yAxisId="price"
                    y={(doubleBottomPoints[0].value + doubleBottomPoints[1].value) / 2} 
                    stroke="#ff6b35" 
                    strokeDasharray="2 6" 
                    strokeWidth={1}
                    opacity={0.5}
                    label={{ 
                      value: "Double Bottom Pattern", 
                      position: "insideTopLeft",
                      style: { fill: '#ff6b35', fontWeight: 'bold', fontSize: '10px', backgroundColor: 'rgba(255,107,53,0.1)', padding: '2px 6px', borderRadius: '4px' }
                    }}
                  />
                </>
              )}
              
              {/* Volume bars */}
              <Bar 
                yAxisId="volume"
                dataKey="volume" 
                fill="#e5e7eb" 
                opacity={0.4}
                radius={[1, 1, 0, 0]}
              />
              
              {/* Main price line */}
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="close" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: "#2563eb", 
                  stroke: "#ffffff", 
                  strokeWidth: 3,
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }
                }}
                fill="url(#priceGradient)"
              />
              
              {/* High/Low indicators */}
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="high" 
                stroke="#10b981" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                opacity={0.7}
              />
              
              <Line 
                yAxisId="price"
                type="monotone" 
                dataKey="low" 
                stroke="#ef4444" 
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                opacity={0.7}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart Legend */}
        <div className="mt-4 flex items-center justify-center space-x-8 text-sm bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-600 rounded"></div>
            <span className="text-gray-700 font-medium">Close Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-green-500"></div>
            <span className="text-gray-700 font-medium">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 border-t-2 border-dashed border-red-500"></div>
            <span className="text-gray-700 font-medium">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-gray-300 rounded"></div>
            <span className="text-gray-700 font-medium">Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}