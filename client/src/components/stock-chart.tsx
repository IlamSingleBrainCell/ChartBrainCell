import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Bar } from 'recharts';

interface StockChartProps {
  symbol: string;
  analysisData: any;
  stock?: any;
}

export function StockChart({ symbol, analysisData, stock }: StockChartProps) {
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
    
    return generatePatternData(analysisData.patternType, 90);
  };

  const chartData = generateChartData();
  const currentPrice = chartData[chartData.length - 1]?.price;
  const targetPrice = analysisData.targetPrice;
  const isIndian = stock?.market === 'Indian';
  const currencySymbol = isIndian ? '₹' : '$';

  return (
    <div className="w-full bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">{symbol} - 3 Month Chart</h3>
        <p className="text-sm text-gray-600">{analysisData.patternType} Pattern Detected</p>
      </div>
      
      <div className="p-4">
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={11}
                interval="preserveStartEnd"
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                stroke="#666"
                fontSize={11}
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${currencySymbol}${value}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#2563eb' }}
              />
              {targetPrice && (
                <ReferenceLine 
                  y={targetPrice} 
                  stroke="#10b981" 
                  strokeDasharray="5 5"
                  label={{ value: `Target: ${currencySymbol}${targetPrice.toFixed(2)}`, position: 'topRight' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">+{((currentPrice - chartData[0]?.price) / chartData[0]?.price * 100).toFixed(1)}%</div>
            <div className="text-xs text-gray-600">3M Return</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{currencySymbol}{currentPrice?.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Current Price</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{currencySymbol}{targetPrice?.toFixed(2)}</div>
            <div className="text-xs text-gray-600">Target Price</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{analysisData.breakoutTimeframe}</div>
            <div className="text-xs text-gray-600">Breakout Window</div>
          </div>
        </div>
      </div>
    </div>
  );
}