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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          📈 Live Market Summary
          <Badge variant="outline" className="text-xs">
            NASDAQ • NYSE • NSE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((index: MarketIndex) => (
            <div
              key={index.symbol}
              className="p-3 border rounded-lg bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{index.name}</h4>
                  <p className="text-xs text-gray-500">{index.exchange}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <div className="flex items-center gap-1">
                    {index.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        index.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {index.changePercent >= 0 ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)}
                </span>
                <Badge
                  variant={index.marketState === 'REGULAR' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {index.marketState}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}