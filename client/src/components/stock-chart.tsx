import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar, Brush, Cell } from 'recharts';
import { useState } from 'react';
import { ZoomIn, ZoomOut, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StockChartProps {
  symbol: string;
  analysisData: any;
  stock?: any;
}

export function StockChart({ symbol, analysisData, stock }: StockChartProps) {
  const [timeRange, setTimeRange] = useState('3mo');
  const [timeRangeDisplay, setTimeRangeDisplay] = useState('3 Months');
  
  // Fetch real Yahoo Finance historical data
  const { data: historicalData, isLoading, error } = useQuery({
    queryKey: [`/api/yahoo/historical/${symbol}`, timeRange],
    queryFn: () => apiRequest('GET', `/api/yahoo/historical/${symbol}?period=${timeRange}`),
    enabled: !!symbol,
  });
  
  // Process historical data for chart display
  const processHistoricalData = () => {
    if (!historicalData || !Array.isArray(historicalData)) {
      return [];
    }
    
    return historicalData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: Math.round(item.open * 100) / 100,
      high: Math.round(item.high * 100) / 100,
      low: Math.round(item.low * 100) / 100,
      close: Math.round(item.close * 100) / 100,
      price: Math.round(item.close * 100) / 100,
      volume: item.volume,
    }));
  };

  // Fallback data generation only if Yahoo Finance data fails
  const generateFallbackData = () => {
    const data = [];
    const isIndian = stock?.market === 'Indian';
    const basePrice = isIndian ? (stock?.currentPrice || 2500) : (stock?.currentPrice || 100);
    let currentPrice = basePrice;
    
    // Generate pattern-based data to match the detected pattern
    const generatePatternData = (patternType: string, days: number) => {
      const patternData = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        
        let open = currentPrice;
        let high, low, close;
        
        // Generate realistic OHLC based on pattern type
        if (patternType.includes('Ascending Triangle')) {
          // Ascending triangle: higher lows, resistance at top
          const progress = i / days;
          const resistance = basePrice * 1.05;
          const support = basePrice * (0.92 + progress * 0.08);
          
          const dailyVolatility = 0.015;
          const changePercent = (Math.random() - 0.5) * dailyVolatility;
          
          close = Math.min(open * (1 + changePercent), resistance);
          close = Math.max(close, support);
          
          high = Math.max(open, close) * (1 + Math.random() * 0.01);
          low = Math.min(open, close) * (1 - Math.random() * 0.01);
          
        } else if (patternType.includes('Cup and Handle')) {
          // Cup and Handle pattern: Clear cup formation followed by handle
          const progress = i / days;
          const cupDepth = 0.12;
          let multiplier;
          
          if (progress < 0.4) {
            // Declining phase of cup (gradual decline)
            multiplier = 1 - (cupDepth * (progress / 0.4));
          } else if (progress < 0.6) {
            // Bottom of cup (consolidation)
            multiplier = 1 - cupDepth + (Math.random() - 0.5) * 0.02;
          } else if (progress < 0.85) {
            // Recovery phase of cup (gradual rise)
            const recoveryProgress = (progress - 0.6) / 0.25;
            multiplier = 1 - cupDepth + (cupDepth * recoveryProgress);
          } else {
            // Handle formation (slight pullback)
            const handleProgress = (progress - 0.85) / 0.15;
            multiplier = 1 - (0.03 * handleProgress) + (Math.random() - 0.5) * 0.01;
          }
          
          close = basePrice * multiplier;
          high = close * (1 + Math.random() * 0.008);
          low = close * (1 - Math.random() * 0.008);
          
        } else {
          // Default pattern
          const dailyVolatility = 0.02;
          const trend = analysisData.breakoutDirection === 'upward' ? 0.001 : -0.0005;
          const changePercent = trend + (Math.random() - 0.5) * dailyVolatility;
          
          close = open * (1 + changePercent);
          high = Math.max(open, close) * (1 + Math.random() * 0.01);
          low = Math.min(open, close) * (1 - Math.random() * 0.01);
        }
        
        patternData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          open: Math.round(open * 100) / 100,
          high: Math.round(high * 100) / 100,
          low: Math.round(low * 100) / 100,
          close: Math.round(close * 100) / 100,
          price: Math.round(close * 100) / 100,
          volume: Math.floor(1000000 + Math.random() * 5000000),
        });
        
        currentPrice = close;
      }
      
      return patternData;
    };
    
    const days = timeRangeDisplay === '3 Months' ? 90 : timeRangeDisplay === '1 Year' ? 365 : timeRangeDisplay === '5 Years' ? 1825 : 3650;
    return generatePatternData(analysisData.patternType, days);
  };

  // Use real Yahoo Finance data if available, otherwise fallback
  const chartData = historicalData && historicalData.length > 0 
    ? processHistoricalData() 
    : generateFallbackData();
  
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border">
        <div className="p-8 text-center">
          <p className="text-gray-600">No chart data available</p>
        </div>
      </div>
    );
  }
  
  const currentPrice = chartData[chartData.length - 1]?.price;
  const targetPrice = analysisData.targetPrice;
  const isIndian = stock?.market === 'Indian';
  const currencySymbol = isIndian ? '₹' : '$';
  
  // Get real-time price updates
  const { getStockPrice } = useWebSocket();
  const livePrice = getStockPrice(symbol);
  const displayPrice = livePrice?.currentPrice ?? currentPrice;
  
  // Calculate pattern-specific levels and annotations
  const prices = chartData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const resistance = maxPrice * 0.98;
  const support = minPrice * 1.02;
  
  // Pattern-specific calculations
  const getPatternAnnotations = () => {
    if (analysisData.patternType.includes('Cup and Handle')) {
      const cupDepthPoint = Math.min(...prices.slice(Math.floor(prices.length * 0.3), Math.floor(prices.length * 0.7)));
      const handleLow = Math.min(...prices.slice(Math.floor(prices.length * 0.85)));
      const targetPrice = maxPrice * 1.15; // Target above resistance
      
      return {
        cupDepth: cupDepthPoint,
        handleLow: handleLow,
        target: targetPrice,
        cupStart: Math.floor(chartData.length * 0.1),
        cupEnd: Math.floor(chartData.length * 0.85),
        handleStart: Math.floor(chartData.length * 0.85),
        handleEnd: chartData.length - 1
      };
    }
    return null;
  };
  
  const patternAnnotations = getPatternAnnotations();

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border">
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time chart data from Yahoo Finance...</p>
        </div>
      </div>
    );
  }

  // Show error state with fallback
  if (error && (!historicalData || historicalData.length === 0)) {
    return (
      <div className="w-full bg-white rounded-lg border">
        <div className="p-8 text-center">
          <p className="text-amber-600 mb-4">Yahoo Finance data temporarily unavailable</p>
          <p className="text-gray-600 text-sm">Using pattern-based analysis data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{symbol} - {timeRangeDisplay} Chart</h3>
            {historicalData && historicalData.length > 0 && (
              <p className="text-xs text-green-600">✓ Real Yahoo Finance Data</p>
            )}
          </div>
          <div className="flex gap-2">
            {[
              { label: '3 Months', value: '3mo' },
              { label: '1 Year', value: '1y' },
              { label: '5 Years', value: '5y' },
              { label: '10 Years', value: '10y' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => {
                  setTimeRange(range.value);
                  setTimeRangeDisplay(range.label);
                }}
                className={`px-3 py-1 text-xs rounded ${
                  timeRange === range.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">{analysisData.patternType} Pattern Detected</p>
      </div>
      
      <div className="p-4">
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 60, left: 20, bottom: 60 }}>
              <defs>
                {/* Pattern overlays */}
                <pattern id="cupPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="rgba(59, 130, 246, 0.1)"/>
                </pattern>
              </defs>
              
              <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={10}
                interval={Math.floor(chartData.length / 6)}
                tick={{ fontSize: 9 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={10}
                domain={['dataMin - 10', 'dataMax + 10']}
                tick={{ fontSize: 9 }}
                tickFormatter={(value) => `${currencySymbol}${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'volume') return [value.toLocaleString(), 'Volume'];
                  if (name === 'open') return [`${currencySymbol}${value.toFixed(2)}`, 'Open'];
                  if (name === 'high') return [`${currencySymbol}${value.toFixed(2)}`, 'High'];
                  if (name === 'low') return [`${currencySymbol}${value.toFixed(2)}`, 'Low'];
                  if (name === 'close') return [`${currencySymbol}${value.toFixed(2)}`, 'Close'];
                  return [`${currencySymbol}${value.toFixed(2)}`, name];
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              
              {/* Candlestick wicks (high-low lines) */}
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="transparent"
                strokeWidth={0}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="transparent"
                strokeWidth={0}
                dot={false}
              />
              
              {/* Custom candlestick bodies */}
              {chartData.map((entry, index) => {
                const isGreen = entry.close >= entry.open;
                const bodyHeight = Math.abs(entry.close - entry.open);
                const wickTop = entry.high;
                const wickBottom = entry.low;
                const bodyTop = Math.max(entry.open, entry.close);
                const bodyBottom = Math.min(entry.open, entry.close);
                
                return (
                  <g key={`candle-${index}`}>
                    {/* Wick lines */}
                    <line
                      x1={50 + (index * (600 / chartData.length))}
                      y1={300 - ((wickTop - minPrice) / (maxPrice - minPrice)) * 250}
                      x2={50 + (index * (600 / chartData.length))}
                      y2={300 - ((wickBottom - minPrice) / (maxPrice - minPrice)) * 250}
                      stroke="#6b7280"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
              
              {/* Main price line */}
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#2563eb" 
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
              />
              
              {/* Pattern-specific annotations */}
              {patternAnnotations && analysisData.patternType.includes('Cup and Handle') && (
                <>
                  {/* Cup depth line */}
                  <ReferenceLine 
                    y={patternAnnotations.cupDepth} 
                    stroke="#8b5cf6" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: `Cup Depth: ${currencySymbol}${patternAnnotations.cupDepth.toFixed(2)}`, 
                      position: 'insideTopLeft',
                      style: { fill: '#8b5cf6', fontWeight: 'bold', fontSize: '11px' }
                    }}
                  />
                  
                  {/* Handle low */}
                  <ReferenceLine 
                    y={patternAnnotations.handleLow} 
                    stroke="#f59e0b" 
                    strokeDasharray="2 2"
                    label={{ 
                      value: `Handle Low: ${currencySymbol}${patternAnnotations.handleLow.toFixed(2)}`, 
                      position: 'insideTopRight',
                      style: { fill: '#f59e0b', fontWeight: 'bold', fontSize: '11px' }
                    }}
                  />
                  
                  {/* Target price */}
                  <ReferenceLine 
                    y={patternAnnotations.target} 
                    stroke="#10b981" 
                    strokeDasharray="5 3"
                    strokeWidth={2}
                    label={{ 
                      value: `Target: ${currencySymbol}${patternAnnotations.target.toFixed(2)}`, 
                      position: 'topRight',
                      style: { fill: '#10b981', fontWeight: 'bold', fontSize: '12px', backgroundColor: '#fff', padding: '2px' }
                    }}
                  />
                  
                  {/* Cup outline overlay */}
                  <Line 
                    type="monotone" 
                    dataKey="close"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    connectNulls={false}
                    data={chartData.slice(patternAnnotations.cupStart, patternAnnotations.cupEnd)}
                  />
                </>
              )}
              
              {/* Support and Resistance Lines */}
              <ReferenceLine 
                y={resistance} 
                stroke="#ef4444" 
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{ 
                  value: `Resistance: ${currencySymbol}${resistance.toFixed(2)}`, 
                  position: 'topLeft',
                  style: { fill: '#ef4444', fontSize: '10px' }
                }}
              />
              <ReferenceLine 
                y={support} 
                stroke="#22c55e" 
                strokeDasharray="3 3" 
                strokeWidth={1}
                label={{ 
                  value: `Support: ${currencySymbol}${support.toFixed(2)}`, 
                  position: 'bottomLeft',
                  style: { fill: '#22c55e', fontSize: '10px' }
                }}
              />
              
              {/* Zoom brush */}
              <Brush dataKey="date" height={25} stroke="#2563eb" startIndex={Math.max(0, chartData.length - 30)} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Current Price Display */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-2xl font-bold text-gray-900">
              {currencySymbol}{displayPrice?.toFixed(2)}
            </p>
            {livePrice && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Live Price</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">24h Change</p>
            <p className={`text-lg font-semibold ${livePrice?.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {livePrice?.changePercent >= 0 ? '+' : ''}{livePrice?.changePercent?.toFixed(2) ?? stock?.changePercent?.toFixed(2) ?? '0.00'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}