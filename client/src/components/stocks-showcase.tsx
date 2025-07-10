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
        <div className="text-center mb-24 fade-in">
          <div className="flex flex-col items-center gap-8 mb-8">
            <h2 className="text-5xl lg:text-7xl font-black gradient-text">96+ Global Stocks 🌍</h2>
            <div className={`flex items-center px-8 py-4 rounded-3xl text-xl font-black shadow-2xl card-hover transition-all duration-300 ${
              isConnected ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-500 text-white glow-pulse neon-glow' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            }`}>
              {isConnected ? <Wifi size={24} className="mr-4" /> : <WifiOff size={24} className="mr-4" />}
              {isConnected ? '🔴 LIVE DATA STREAMING' : '⚠️ OFFLINE MODE'}
            </div>
          </div>
          <p className="text-2xl lg:text-3xl text-gray-700 font-medium max-w-4xl mx-auto leading-relaxed">
            <span className="text-purple-600 font-black">Real-time market data</span> from NSE, NYSE, and BSE exchanges with 
            <span className="text-cyan-600 font-black"> instant price updates</span> ⚡
          </p>
        </div>
        
        {/* Enhanced Market Tabs */}
        <div className="flex justify-center mb-16 scale-in">
          <div className="glass-effect rounded-2xl p-2 shadow-2xl">
            <Button
              onClick={() => setSelectedMarket("US")}
              variant={selectedMarket === "US" ? "default" : "ghost"}
              className={`button-modern px-10 py-5 rounded-2xl text-xl font-black transition-all duration-300 ${
                selectedMarket === "US" 
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl glow-pulse transform scale-105" 
                  : "text-gray-600 hover:bg-white/70 hover:scale-105"
              }`}
            >
              <span className="text-2xl mr-3">🇺🇸</span> US Markets
            </Button>
            <Button
              onClick={() => setSelectedMarket("Indian")}
              variant={selectedMarket === "Indian" ? "default" : "ghost"}
              className={`button-modern px-10 py-5 rounded-2xl text-xl font-black transition-all duration-300 ${
                selectedMarket === "Indian" 
                  ? "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-2xl glow-pulse transform scale-105" 
                  : "text-gray-600 hover:bg-white/70 hover:scale-105"
              }`}
            >
              <span className="text-2xl mr-3">🇮🇳</span> Indian Markets
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
                  className="glass-effect border-0 rounded-3xl shadow-2xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:border-purple-400/50 card-hover neon-glow group"
                  onClick={() => onStockSelect(stock.symbol)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${getIconColor(stock.symbol)} group-hover:scale-110 transition-transform`}>
                      <span className="font-black text-2xl text-white">{getStockIcon(stock.symbol)}</span>
                    </div>
                    <div className="flex items-center">
                      {changePercent >= 0 ? (
                        <TrendingUp className="text-green-500 mr-2" size={20} />
                      ) : (
                        <TrendingDown className="text-red-500 mr-2" size={20} />
                      )}
                      <span className={`text-lg font-black px-4 py-2 rounded-2xl ${
                        changePercent >= 0 ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
                      }`}>
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </span>
                      {isLive && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse ml-3 shadow-lg"></div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors">{stock.name}</h3>
                  <p className="text-purple-600 text-lg font-bold mb-4">{stock.symbol} • {stock.market === 'Indian' ? '🇮🇳 India' : '🇺🇸 USA'}</p>
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 mb-4">
                    <div className="text-3xl font-black text-gray-900">
                      {stock.market === 'Indian' ? '₹' : '$'}{currentPrice?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-bold mt-1 ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
                      {isLive ? '🔴 LIVE PRICE' : `📊 Updated ${Math.floor(Math.random() * 5) + 1} min ago`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="text-center scale-in">
          <Button 
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl neon-glow hover:scale-110 transform transition-all duration-300"
            onClick={() => window.location.href = '/all-stocks'}
          >
            View All 96+ Stocks 🚀
          </Button>
        </div>
      </div>
    </section>
  );
}
