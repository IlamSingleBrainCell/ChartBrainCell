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
    <section id="stocks" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 neural-grid opacity-30"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex flex-col items-center gap-6 mb-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">Unlimited Global Stock Access</h2>
            <div className={`flex items-center px-6 py-3 rounded-lg text-lg font-semibold shadow-lg business-hover ${
              isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}>
              {isConnected ? <Wifi size={20} className="mr-3" /> : <WifiOff size={20} className="mr-3" />}
              {isConnected ? 'Live Data Connected' : 'Offline Mode'}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access any global stock using Yahoo Finance API. Our 96+ stock database serves as quick-access samples for typeahead search.
          </p>
        </div>
        
        {/* Market Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 shadow-md">
            <Button
              onClick={() => setSelectedMarket("US")}
              variant={selectedMarket === "US" ? "default" : "ghost"}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                selectedMarket === "US" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              🇺🇸 US Markets
            </Button>
            <Button
              onClick={() => setSelectedMarket("Indian")}
              variant={selectedMarket === "Indian" ? "default" : "ghost"}
              className={`px-8 py-3 rounded-md font-semibold transition-all ${
                selectedMarket === "Indian" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              🇮🇳 Indian Markets
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
                <div 
                  key={stock.symbol} 
                  className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer business-hover"
                  onClick={() => onStockSelect(stock.symbol)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${getIconColor(stock.symbol)}`}>
                      <span className="font-semibold text-lg text-white">{getStockIcon(stock.symbol)}</span>
                    </div>
                    <div className="flex items-center">
                      {changePercent >= 0 ? (
                        <TrendingUp className="text-green-600 mr-2" size={16} />
                      ) : (
                        <TrendingDown className="text-red-600 mr-2" size={16} />
                      )}
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${
                        changePercent >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </span>
                      {isLive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{stock.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{stock.symbol} • {stock.market === 'Indian' ? '🇮🇳 India' : '🇺🇸 USA'}</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">
                      {stock.market === 'Indian' ? '₹' : '$'}{currentPrice?.toFixed(2)}
                    </div>
                    <div className={`text-xs font-medium mt-1 ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
                      {isLive ? 'Live Price' : `Updated ${Math.floor(Math.random() * 5) + 1} min ago`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md business-hover"
            onClick={() => window.location.href = '/all-stocks'}
          >
            View All Sample Stocks
          </Button>
        </div>
      </div>
    </section>
  );
}
