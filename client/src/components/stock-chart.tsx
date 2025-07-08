import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface StockChartProps {
  symbol: string;
  analysisData: any;
}

export function StockChart({ symbol, analysisData }: StockChartProps) {
  // Generate realistic 3-month stock price data
  const generateChartData = () => {
    const data = [];
    const basePrice = 100;
    let currentPrice = basePrice;
    
    // Generate 90 days of data
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      
      // Add some realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const trend = analysisData.breakoutDirection === 'upward' ? 0.001 : -0.0005;
      const randomChange = (Math.random() - 0.5) * volatility;
      
      currentPrice *= (1 + trend + randomChange);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(currentPrice * 100) / 100,
        volume: Math.floor(1000000 + Math.random() * 5000000),
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const currentPrice = chartData[chartData.length - 1]?.price;
  const targetPrice = analysisData.targetPrice;

  return (
    <div className="w-full h-80 bg-white p-4 rounded-lg border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{symbol} - 3 Month Chart</h3>
        <p className="text-sm text-gray-600">{analysisData.patternType} Pattern Detected</p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
            formatter={(value: any) => [`$${value}`, 'Price']}
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
              label={{ value: `Target: $${targetPrice.toFixed(2)}`, position: 'right' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-blue-600">${currentPrice?.toFixed(2)}</div>
          <div className="text-gray-500">Current</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">${targetPrice?.toFixed(2)}</div>
          <div className="text-gray-500">Target</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-purple-600">{analysisData.confidence}%</div>
          <div className="text-gray-500">Confidence</div>
        </div>
      </div>
    </div>
  );
}