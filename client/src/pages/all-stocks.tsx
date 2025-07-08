import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { Link } from "wouter";

export default function AllStocks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<"All" | "US" | "Indian">("All");

  const { data: stocks, isLoading } = useQuery({
    queryKey: ["/api/stocks"],
  });

  const filteredStocks = stocks?.filter((stock: any) => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarket = selectedMarket === "All" || stock.market === selectedMarket;
    return matchesSearch && matchesMarket;
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Supported Stocks</h1>
              <p className="text-gray-600 mt-1">96+ stocks from US and Indian markets</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search stocks by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Market Filter */}
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {["All", "US", "Indian"].map((market) => (
              <Button
                key={market}
                onClick={() => setSelectedMarket(market as any)}
                variant={selectedMarket === market ? "default" : "ghost"}
                className={selectedMarket === market ? "bg-blue-600 text-white" : "text-gray-600"}
                size="sm"
              >
                {market} {market !== "All" && "Markets"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stocks?.length || 0}</div>
              <div className="text-gray-600">Total Stocks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                {stocks?.filter((s: any) => s.market === "US").length || 0}
              </div>
              <div className="text-gray-600">US Markets</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">
                {stocks?.filter((s: any) => s.market === "Indian").length || 0}
              </div>
              <div className="text-gray-600">Indian Markets</div>
            </CardContent>
          </Card>
        </div>

        {/* Stocks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }, (_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStocks?.map((stock: any) => (
              <Card key={stock.symbol} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(stock.symbol)}`}>
                      <span className="font-bold text-lg">{getStockIcon(stock.symbol)}</span>
                    </div>
                    <div className="flex items-center">
                      {stock.changePercent > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{stock.symbol}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stock.name}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {stock.market === 'Indian' ? '₹' : '$'}{stock.currentPrice?.toFixed(2)}
                      </div>
                      <div className={`text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {stock.market}
                    </div>
                  </div>
                  
                  <Link href="/">
                    <Button className="w-full mt-4" size="sm">
                      Analyze Stock
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStocks?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No stocks found matching your search.</div>
          </div>
        )}
      </div>
    </div>
  );
}