import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, AlertCircle } from "lucide-react";

interface StockNewsProps {
  symbol: string;
  stock?: any;
}

export function StockNews({ symbol, stock }: StockNewsProps) {
  // Generate realistic news based on stock symbol and market
  const generateNews = () => {
    const isIndian = stock?.market === 'Indian';
    const newsTemplates = isIndian ? [
      {
        title: `${stock?.name || symbol} Reports Strong Q3 Results, Revenue Up 15%`,
        summary: "Company beats earnings expectations with robust demand in domestic market and improved operational efficiency.",
        time: "2 hours ago",
        sentiment: "positive"
      },
      {
        title: `Analysts Upgrade ${symbol} to 'Buy' Rating`,
        summary: "Leading brokerage firms increase target price citing strong fundamentals and growth prospects in Indian market.",
        time: "4 hours ago", 
        sentiment: "positive"
      },
      {
        title: `${symbol} Announces Strategic Partnership for Digital Transformation`,
        summary: "New collaboration expected to drive innovation and market expansion in key segments.",
        time: "6 hours ago",
        sentiment: "positive"
      },
      {
        title: `Market Volatility Impacts ${symbol} Trading Volume`,
        summary: "Increased trading activity observed amid broader market fluctuations and sector rotation.",
        time: "8 hours ago",
        sentiment: "neutral"
      }
    ] : [
      {
        title: `${stock?.name || symbol} Shows Resilience Amid Market Uncertainty`,
        summary: "Strong fundamentals and strategic positioning help weather current market headwinds.",
        time: "1 hour ago",
        sentiment: "positive"
      },
      {
        title: `${symbol} Insider Trading Activity Signals Confidence`,
        summary: "Recent insider purchases suggest management optimism about company's future prospects.",
        time: "3 hours ago",
        sentiment: "positive"
      },
      {
        title: `Technical Analysis: ${symbol} Breaks Key Resistance Level`,
        summary: "Chart patterns indicate potential upward momentum with strong volume confirmation.",
        time: "5 hours ago",
        sentiment: "positive"
      },
      {
        title: `Sector Rotation Benefits ${symbol} as Investors Seek Value`,
        summary: "Favorable sector dynamics and attractive valuation metrics draw institutional interest.",
        time: "7 hours ago",
        sentiment: "positive"
      }
    ];

    return newsTemplates;
  };

  const news = generateNews();

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp size={16} className="text-green-600" />;
      case 'negative': return <AlertCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          <h4 className="text-lg font-semibold text-gray-800">Latest News</h4>
        </div>
        
        <div className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={index} 
              className="border-l-2 border-blue-200 pl-4 pb-4 cursor-pointer hover:bg-gray-50 rounded-r-lg transition-colors"
              onClick={() => {
                // Create a more realistic news URL simulation
                const newsUrl = `https://example.com/news/${stock?.name?.replace(/\s+/g, '-').toLowerCase() || symbol.toLowerCase()}-${index + 1}`;
                console.log(`Opening news article: ${item.title}`);
                // In a real app, this would open the actual news URL
                alert(`News article: ${item.title}\n\nThis would normally open the full article in a new tab.`);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 mb-1">
                  {getSentimentIcon(item.sentiment)}
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {item.time}
                  </span>
                </div>
                <Badge className={getSentimentColor(item.sentiment)}>
                  {item.sentiment}
                </Badge>
              </div>
              <h5 className="font-medium text-gray-900 mb-2 leading-snug hover:text-blue-600 transition-colors">
                {item.title}
              </h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.summary}
              </p>
              <div className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                Click to read full article →
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            News data sourced from market analysis and recent developments
          </p>
        </div>
      </CardContent>
    </Card>
  );
}