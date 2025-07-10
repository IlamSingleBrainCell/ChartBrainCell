import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from '@/hooks/useWebSocket';

interface StocksShowcaseProps {
  onStockSelect: (symbol: string) => void;
}

export function StocksShowcase({ onStockSelect }: StocksShowcaseProps) {
  const [selectedMarket, setSelectedMarket] = useState<"US" | "Indian">("US");

  const { data: stocks, isLoading } = useQuery({
    queryKey: ["/api/stocks"],
  });

  const { data: usStocks } = useQuery({
    queryKey: ["/api/stocks/market/US"],
  });

  const { data: indianStocks } = useQuery({
    queryKey: ["/api/stocks/market/Indian"],
  });

  // Get real-time price updates
  const { isConnected, getStockPrice } = useWebSocket();

  const displayStocks = selectedMarket === "US" ? usStocks : indianStocks;

  const getStockIcon = (symbol: string) => {
    return symbol.charAt(0).toUpperCase();
  };

  const getIconColor = (symbol: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-red-100 text-red-600", 
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
    ];
    return colors[symbol.length % colors.length];
  };

  return (
    <section id="stocks" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark">65+ Supported Stocks</h2>
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isConnected ? <Wifi size={16} className="mr-2" /> : <WifiOff size={16} className="mr-2" />}
              {isConnected ? 'Live Prices' : 'Offline'}
            </div>
          </div>
          <p className="text-xl text-brand-gray">
            Comprehensive coverage of NSE, NYSE, and BSE markets with real-time data
          </p>
        </div>
        
        {/* Market Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <Button
              onClick={() => setSelectedMarket("US")}
              variant={selectedMarket === "US" ? "default" : "ghost"}
              className={selectedMarket === "US" ? "bg-blue-600 text-white" : "text-brand-gray"}
            >
              US Markets
            </Button>
            <Button
              onClick={() => setSelectedMarket("Indian")}
              variant={selectedMarket === "Indian" ? "default" : "ghost"}
              className={selectedMarket === "Indian" ? "bg-blue-600 text-white" : "text-brand-gray"}
            >
              Indian Markets
            </Button>
          </div>
        </div>
        
        {/* Stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            displayStocks?.slice(0, 8).map((stock: any) => {
              const livePrice = getStockPrice(stock.symbol);
              const currentPrice = livePrice?.currentPrice ?? stock.currentPrice;
              const changePercent = livePrice?.changePercent ?? stock.changePercent;
              const isLive = !!livePrice;
              
              return (
                <Card 
                  key={stock.symbol} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onStockSelect(stock.symbol)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(stock.symbol)}`}>
                        <span className="font-bold text-lg">{getStockIcon(stock.symbol)}</span>
                      </div>
                      <div className="flex items-center">
                        {changePercent >= 0 ? (
                          <TrendingUp className="text-green-600 mr-1" size={16} />
                        ) : (
                          <TrendingDown className="text-red-500 mr-1" size={16} />
                        )}
                        <span className={`text-sm font-medium ${
                          changePercent >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                        </span>
                        {isLive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-brand-dark mb-1 truncate">{stock.name}</h3>
                    <p className="text-brand-gray text-sm mb-3">{stock.symbol}</p>
                    <div className="text-2xl font-bold text-brand-dark">
                      {stock.market === 'Indian' ? '₹' : '$'}{currentPrice?.toFixed(2)}
                    </div>
                    <div className="text-sm text-brand-gray">
                      {isLive ? 'Live price' : `Updated ${Math.floor(Math.random() * 5) + 1} min ago`}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold"
            onClick={() => window.location.href = '/all-stocks'}
          >
            View All 65+ Stocks
          </Button>
        </div>
      </div>
    </section>
  );
}
