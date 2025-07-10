import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PatternVisualizationProps {
  patternType: string;
  confidence: number;
}

export function PatternVisualization({ patternType, confidence }: PatternVisualizationProps) {
  // Generate simplified pattern-specific visualization data
  const generatePatternData = () => {
    const points = 15;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const x = i;
      let y = 50; // baseline
      let supportLine = null;
      let resistanceLine = null;
      
      if (patternType.includes('Descending Triangle') || patternType.includes('Triangle')) {
        // Descending triangle: horizontal support, descending resistance
        supportLine = 30; // flat support line
        resistanceLine = 70 - (i * 2.5); // descending resistance line
        y = supportLine + Math.random() * (resistanceLine - supportLine);
        
      } else if (patternType.includes('Ascending Triangle')) {
        // Ascending triangle: ascending support, horizontal resistance
        supportLine = 30 + (i * 2.5); // rising support line
        resistanceLine = 70; // flat resistance
        y = supportLine + Math.random() * (resistanceLine - supportLine);
        
      } else if (patternType.includes('Cup and Handle')) {
        // Simplified cup and handle
        const progress = i / points;
        if (progress < 0.3) {
          y = 60 - (progress / 0.3) * 15;
        } else if (progress < 0.7) {
          y = 45 + Math.sin((progress - 0.3) / 0.4 * Math.PI) * 15;
        } else {
          y = 58 - ((progress - 0.7) / 0.3) * 8;
        }
        
      } else if (patternType.includes('Head and Shoulders')) {
        // Simplified head and shoulders
        if (i < 4) y = 45 + (i * 3);
        else if (i < 6) y = 57 - ((i - 4) * 5);
        else if (i < 9) y = 47 + ((i - 6) * 6);
        else if (i < 11) y = 65 - ((i - 9) * 6);
        else y = 53 + ((i - 11) * 2);
        
      } else if (patternType.includes('Double Bottom')) {
        // Simplified double bottom
        if (i < 5) y = 60 - (i * 6);
        else if (i < 10) y = 30 + ((i - 5) * 6);
        else y = 60 - ((i - 10) * 6);
        
      } else {
        // Default wedge pattern
        supportLine = 30 + (i * 1.5);
        resistanceLine = 70 - (i * 1.5);
        y = supportLine + Math.random() * (resistanceLine - supportLine);
      }
      
      data.push({
        x,
        y: Math.max(20, Math.min(80, y)),
        supportLine,
        resistanceLine
      });
    }
    
    return data;
  };

  const patternData = generatePatternData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Chart Container */}
      <div className="h-32 mb-3 bg-gray-50 rounded border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patternData} margin={{ top: 15, right: 15, left: 15, bottom: 15 }}>
            <XAxis hide />
            <YAxis hide />
            
            {/* Support line (green dashed) */}
            {patternData[0].supportLine && (
              <Line 
                type="linear" 
                dataKey="supportLine" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                connectNulls={false}
              />
            )}
            
            {/* Resistance line (red dashed) */}
            {patternData[0].resistanceLine && (
              <Line 
                type="linear" 
                dataKey="resistanceLine" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                connectNulls={false}
              />
            )}
            
            {/* Main price line (blue solid) */}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Pattern Name */}
      <div className="text-center mb-2">
        <h4 className="text-sm font-semibold text-gray-800">{patternType}</h4>
      </div>
      
      {/* Description */}
      <div className="flex items-center text-xs text-gray-500">
        <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm mr-2 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
        </div>
        <span>Typical {patternType.toLowerCase()} pattern example</span>
      </div>
    </div>
  );
}