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
    <Card className="w-full border border-gray-200 shadow-lg business-shadow">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <span className="text-gray-900">📈 Live Market Summary</span>
          <Badge variant="outline" className="text-sm px-3 py-1 border border-blue-200 text-blue-700 font-medium">
            NASDAQ • NYSE • NSE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketData.map((index: MarketIndex) => (
            <div
              key={index.symbol}
              className="p-4 border border-gray-200 rounded-lg bg-white business-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-base text-gray-900">{index.name}</h4>
                  <p className="text-sm text-gray-500">{index.exchange}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    {index.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {index.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        index.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {index.changePercent >= 0 ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-gray-50 rounded-md p-2">
                <span className="text-sm text-gray-600">
                  {index.change >= 0 ? '+' : ''}
                  {index.change.toFixed(2)}
                </span>
                <Badge
                  variant={index.marketState === 'REGULAR' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {index.marketState === 'REGULAR' ? 'OPEN' : 'CLOSED'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}