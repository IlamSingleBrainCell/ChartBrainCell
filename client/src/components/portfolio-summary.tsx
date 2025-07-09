import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity } from "lucide-react";

interface PortfolioSummaryProps {
  totalInvested: number;
  totalCurrent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  portfolioCount: number;
}

export function PortfolioSummary({ 
  totalInvested, 
  totalCurrent, 
  totalGainLoss, 
  totalGainLossPercent, 
  portfolioCount 
}: PortfolioSummaryProps) {
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(totalCurrent)}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Invested: {formatCurrency(totalInvested)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Gain/Loss */}
      <Card className={`border-l-4 shadow-lg ${
        totalGainLoss >= 0 
          ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'border-l-red-500 bg-gradient-to-br from-red-50 to-rose-50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                totalGainLoss >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                Total Gain/Loss
              </p>
              <div className={`flex items-center space-x-2 ${
                totalGainLoss >= 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {totalGainLoss >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <p className="text-3xl font-bold">
                  {totalGainLoss >= 0 ? '+' : '-'}{formatCurrency(totalGainLoss)}
                </p>
              </div>
              <p className={`text-sm mt-1 ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              totalGainLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="text-white" size={24} />
              ) : (
                <TrendingDown className="text-white" size={24} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Stats */}
      <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Holdings</p>
              <p className="text-3xl font-bold text-purple-900">
                {portfolioCount}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                Active investments
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <PieChart className="text-white" size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}