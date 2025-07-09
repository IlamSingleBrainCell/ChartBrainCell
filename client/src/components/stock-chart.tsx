import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar } from 'recharts';
import { useState } from 'react';

interface StockChartProps {
  symbol: string;
  analysisData: any;
  stock?: any;
}

export function StockChart({ symbol, analysisData, stock }: StockChartProps) {
  const [timeRange, setTimeRange] = useState('3 Months');
  // Generate realistic 3-month stock price data with OHLC values
  const generateChartData = () => {
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
          // Cup pattern: U-shaped recovery
          const progress = i / days;
          const cupDepth = 0.15;
          let multiplier;
          
          if (progress < 0.6) {
            // Declining phase of cup
            multiplier = 1 - (cupDepth * Math.sin(progress * Math.PI / 0.6));
          } else {
            // Recovery phase
            multiplier = 1 - cupDepth + (cupDepth * (progress - 0.6) / 0.4);
          }
          
          close = basePrice * multiplier * (1 + (Math.random() - 0.5) * 0.02);
          high = close * (1 + Math.random() * 0.015);
          low = close * (1 - Math.random() * 0.015);
          
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
    
    const days = timeRange === '3 Months' ? 90 : timeRange === '1 Year' ? 365 : timeRange === '5 Years' ? 1825 : 3650;
    return generatePatternData(analysisData.patternType, days);
  };

  const chartData = generateChartData();
  const currentPrice = chartData[chartData.length - 1]?.price;
  const targetPrice = analysisData.targetPrice;
  const isIndian = stock?.market === 'Indian';
  const currencySymbol = isIndian ? '₹' : '$';
  
  // Calculate support and resistance levels
  const prices = chartData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const resistance = maxPrice * 0.98;
  const support = minPrice * 1.02;

  return (
    <div className="w-full bg-white rounded-lg border">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{symbol} - {timeRange} Chart</h3>
          <div className="flex gap-2">
            {['3 Months', '1 Year', '5 Years', '10 Years'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-xs rounded ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600">{analysisData.patternType} Pattern Detected</p>
      </div>
      
      <div className="p-4">
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={10}
                interval={Math.floor(chartData.length / 8)}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#666"
                fontSize={10}
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'volume') return [value.toLocaleString(), 'Volume'];
                  return [`${currencySymbol}${value}`, name];
                }}
              />
              
              {/* Candlestick representation using bars */}
              <Bar dataKey="low" stackId="candle" fill="transparent" />
              <Bar 
                dataKey={(entry: any) => entry.high - entry.low} 
                stackId="candle" 
                fill="#666" 
                barSize={1}
              />
              
              {/* Price line */}
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: '#2563eb' }}
              />
              
              {/* Support and Resistance Lines */}
              <ReferenceLine 
                y={resistance} 
                stroke="#ef4444" 
                strokeDasharray="3 3"
                label={{ value: `Resistance: ${currencySymbol}${resistance.toFixed(2)}`, position: 'topLeft' }}
              />
              <ReferenceLine 
                y={support} 
                stroke="#22c55e" 
                strokeDasharray="3 3"
                label={{ value: `Support: ${currencySymbol}${support.toFixed(2)}`, position: 'bottomLeft' }}
              />
              
              {/* Target Price */}
              {targetPrice && (
                <ReferenceLine 
                  y={targetPrice} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5"
                  label={{ value: `Target: ${currencySymbol}${targetPrice.toFixed(2)}`, position: 'topRight' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}