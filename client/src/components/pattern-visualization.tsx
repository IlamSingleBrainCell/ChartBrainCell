import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PatternVisualizationProps {
  patternType: string;
  confidence: number;
}

export function PatternVisualization({ patternType, confidence }: PatternVisualizationProps) {
  // Generate pattern-specific visualization data
  const generatePatternData = () => {
    const points = 20;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const x = i;
      let y = 50; // baseline
      
      if (patternType.includes('Ascending Triangle')) {
        // Higher lows with horizontal resistance
        const support = 30 + (i * 1.5); // rising support line
        const resistance = 70; // flat resistance
        y = support + Math.random() * (resistance - support);
        if (i > 15) y = Math.min(y, resistance); // resistance at top
        
      } else if (patternType.includes('Cup and Handle')) {
        // U-shaped pattern
        if (i < 8) {
          y = 60 - (i * 3); // decline
        } else if (i < 16) {
          y = 36 + ((i - 8) * 3); // recovery
        } else {
          y = 60 - ((i - 16) * 2); // handle formation
        }
        
      } else if (patternType.includes('Bullish Flag')) {
        // Strong rise then sideways consolidation
        if (i < 5) {
          y = 30 + (i * 8); // flagpole
        } else {
          y = 70 - ((i - 5) * 0.5) + (Math.random() * 4 - 2); // flag
        }
        
      } else if (patternType.includes('Double Bottom')) {
        // Two lows at similar levels
        if (i < 6) {
          y = 60 - (i * 4);
        } else if (i < 10) {
          y = 36 + ((i - 6) * 6);
        } else if (i < 16) {
          y = 60 - ((i - 10) * 4);
        } else {
          y = 36 + ((i - 16) * 6);
        }
        
      } else if (patternType.includes('Head and Shoulders')) {
        // Left shoulder, head, right shoulder
        if (i < 5) {
          y = 40 + (i * 4); // left shoulder up
        } else if (i < 8) {
          y = 60 - ((i - 5) * 3); // down to neckline
        } else if (i < 12) {
          y = 51 + ((i - 8) * 5); // head formation
        } else if (i < 15) {
          y = 71 - ((i - 12) * 5); // down from head
        } else {
          y = 56 + ((i - 15) * 2); // right shoulder
        }
        
      } else {
        // Default wedge pattern
        const upperBound = 70 - (i * 1.5);
        const lowerBound = 30 + (i * 1);
        y = lowerBound + Math.random() * (upperBound - lowerBound);
      }
      
      let supportLine = null;
      let resistanceLine = null;
      
      // Add support and resistance lines for relevant patterns
      if (patternType.includes('Ascending Triangle')) {
        supportLine = 30 + (i * 1.5); // Rising support
        resistanceLine = 70; // Flat resistance
      } else if (patternType.includes('Wedge')) {
        supportLine = 30 + (i * 1);
        resistanceLine = 70 - (i * 1);
      }
      
      data.push({
        x,
        y: Math.max(20, Math.min(80, y + (Math.random() * 2 - 1))),
        supportLine,
        resistanceLine
      });
    }
    
    return data;
  };

  const patternData = generatePatternData();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 border">
      <div className="flex items-center mb-3">
        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded mr-2"></div>
        <h4 className="font-semibold text-white">{patternType}</h4>
      </div>
      
      <div className="text-xs text-yellow-400 mb-3 flex items-center">
        💡 Compare the actual chart above with this pattern example below
      </div>
      
      <div className="h-32 mb-3 bg-slate-800 rounded border border-slate-700">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patternData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis hide />
            <YAxis hide />
            
            {/* Support line for patterns that have one */}
            {(patternType.includes('Ascending Triangle') || patternType.includes('Wedge')) && (
              <Line 
                type="linear" 
                dataKey="supportLine" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                connectNulls={false}
              />
            )}
            
            {/* Resistance line for patterns that have one */}
            {(patternType.includes('Triangle') || patternType.includes('Wedge')) && (
              <Line 
                type="linear" 
                dataKey="resistanceLine" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
                connectNulls={false}
              />
            )}
            
            {/* Main price line */}
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#60a5fa" 
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          <input type="checkbox" checked className="mr-1" readOnly />
          Typical {patternType.toLowerCase()} pattern example
        </div>
        <div className="text-xs font-medium text-emerald-400">{confidence}% Match</div>
      </div>
    </div>
  );
}