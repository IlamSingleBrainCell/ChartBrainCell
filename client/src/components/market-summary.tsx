import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  exchange: string;
  marketState: string;
}

export function MarketSummary() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['/api/yahoo/market-summary'],
    queryFn: () => apiRequest('GET', '/api/yahoo/market-summary'),
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Market Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketData || !Array.isArray(marketData)) {
    return null;
  }

  return (
    <Card className="w-full glass-effect border-0 shadow-2xl neon-glow">
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl lg:text-3xl font-black flex items-center gap-4">
          <span className="gradient-text">📈 Live Market Summary</span>
          <Badge variant="outline" className="text-lg px-4 py-2 border-2 border-purple-500 text-purple-600 font-bold">
            NASDAQ • NYSE • NSE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketData.map((index: MarketIndex) => (
            <div
              key={index.symbol}
              className="p-6 border-0 rounded-3xl glass-effect card-hover shadow-xl neon-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-black text-lg text-gray-900">{index.name}</h4>
                  <p className="text-sm text-purple-600 font-bold">{index.exchange}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-2xl text-gray-900">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    {index.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-black px-3 py-1 rounded-xl ${
                        index.change >= 0 ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                      }`}
                    >
                      {index.changePercent >= 0 ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-white rounded-2xl p-3">
                <span className="text-sm font-bold text-gray-600">
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)}
                </span>
                <Badge
                  variant={index.marketState === 'REGULAR' ? 'default' : 'secondary'}
                  className={`text-sm font-bold px-3 py-1 ${
                    index.marketState === 'REGULAR' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {index.marketState === 'REGULAR' ? '🟢 OPEN' : '🟡 CLOSED'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}