import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from "lucide-react";
import { AddToPortfolioDialog } from "@/components/add-to-portfolio-dialog";
import { PortfolioSummary } from "@/components/portfolio-summary";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Portfolio() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: portfolioPerformance, isLoading } = useQuery({
    queryKey: ["/api/portfolio/performance"],
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });

  const removeFromPortfolioMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/performance"] });
      toast({
        title: "Success",
        description: "Stock removed from portfolio",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove stock from portfolio",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFromPortfolio = (id: number) => {
    removeFromPortfolioMutation.mutate(id);
  };

  const formatCurrency = (amount: number, market: string) => {
    const symbol = market === 'Indian' ? '₹' : '$';
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const portfolioData = portfolioPerformance || [];
  const totalInvested = portfolioData.reduce((sum: number, item: any) => sum + item.investedValue, 0);
  const totalCurrent = portfolioData.reduce((sum: number, item: any) => sum + item.currentValue, 0);
  const totalGainLoss = totalCurrent - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Investment Portfolio
            </h1>
            <p className="text-gray-600">Track your stock investments and performance</p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2"
          >
            <Plus className="mr-2" size={16} />
            Add Stock
          </Button>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary 
          totalInvested={totalInvested}
          totalCurrent={totalCurrent}
          totalGainLoss={totalGainLoss}
          totalGainLossPercent={totalGainLossPercent}
          portfolioCount={portfolioData.length}
        />

        {/* Portfolio Holdings */}
        <div className="mt-8">
          <div className="flex items-center mb-6">
            <Activity className="mr-3 text-indigo-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
          </div>

          {portfolioData.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-12 text-center">
                <PieChart className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No investments yet</h3>
                <p className="text-gray-500 mb-6">Start building your portfolio by adding your first stock</p>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  <Plus className="mr-2" size={16} />
                  Add Your First Stock
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {portfolioData.map((item: any) => (
                <Card key={item.id} className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Stock Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{item.stockSymbol}</h3>
                            <p className="text-sm text-gray-600">{item.stockName}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.market}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="text-lg font-semibold text-gray-900">{item.quantity}</p>
                        <p className="text-xs text-gray-500">
                          @ {formatCurrency(parseFloat(item.buyPrice), item.market)}
                        </p>
                      </div>

                      {/* Current Value */}
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Current Value</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.currentValue, item.market)}
                        </p>
                        <p className="text-xs text-gray-500">
                          @ {formatCurrency(item.currentPrice, item.market)}
                        </p>
                      </div>

                      {/* Investment */}
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Invested</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(item.investedValue, item.market)}
                        </p>
                      </div>

                      {/* Gain/Loss */}
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Gain/Loss</p>
                        <div className={`flex items-center justify-center space-x-1 ${
                          item.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.gainLoss >= 0 ? (
                            <TrendingUp size={16} />
                          ) : (
                            <TrendingDown size={16} />
                          )}
                          <div>
                            <p className="text-lg font-bold">
                              {item.gainLoss >= 0 ? '+' : '-'}{formatCurrency(item.gainLoss, item.market)}
                            </p>
                            <p className="text-sm">
                              {item.gainLoss >= 0 ? '+' : ''}{item.gainLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromPortfolio(item.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add to Portfolio Dialog */}
        <AddToPortfolioDialog 
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      </div>
    </div>
  );
}