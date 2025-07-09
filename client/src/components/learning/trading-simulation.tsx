import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, RotateCcw, Trophy } from "lucide-react";

interface TradingSimulationProps {
  onComplete: (points: number) => void;
}

interface Trade {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  timestamp: Date;
}

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const simulationStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.00, change: 2.50, changePercent: 1.69 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800.00, change: -15.30, changePercent: -0.54 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 250.00, change: 8.75, changePercent: 3.63 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 380.00, change: 1.20, changePercent: 0.32 },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2450.00, change: -12.00, changePercent: -0.49 }
];

export function TradingSimulation({ onComplete }: TradingSimulationProps) {
  const [balance, setBalance] = useState(10000); // Starting with $10,000
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock>(simulationStocks[0]);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [gameStage, setGameStage] = useState<"playing" | "complete">("playing");
  const [totalTrades, setTotalTrades] = useState(0);
  const [successfulTrades, setSuccessfulTrades] = useState(0);
  const [stocks, setStocks] = useState(simulationStocks);

  // Simulate price changes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const changePercent = (Math.random() - 0.5) * 4; // -2% to +2% change
          const newPrice = stock.price * (1 + changePercent / 100);
          const change = newPrice - stock.price;
          
          return {
            ...stock,
            price: Math.round(newPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100
          };
        })
      );
      
      // Update position values
      setPositions(prevPositions => 
        prevPositions.map(position => {
          const currentStock = stocks.find(s => s.symbol === position.symbol);
          if (!currentStock) return position;
          
          const currentPrice = currentStock.price;
          const pnl = (currentPrice - position.avgPrice) * position.quantity;
          const pnlPercent = ((currentPrice - position.avgPrice) / position.avgPrice) * 100;
          
          return {
            ...position,
            currentPrice,
            pnl: Math.round(pnl * 100) / 100,
            pnlPercent: Math.round(pnlPercent * 100) / 100
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [stocks]);

  // Check if game should end (10 trades or balance below $1000)
  useEffect(() => {
    if (totalTrades >= 10 || balance < 1000) {
      setGameStage("complete");
      const portfolioValue = calculatePortfolioValue();
      const totalValue = balance + portfolioValue;
      const profit = totalValue - 10000;
      const points = Math.max(0, Math.round(profit / 10)); // 1 point per $10 profit
      onComplete(points);
    }
  }, [totalTrades, balance, positions]);

  const calculatePortfolioValue = () => {
    return positions.reduce((total, position) => {
      return total + (position.currentPrice * position.quantity);
    }, 0);
  };

  const handleBuy = () => {
    const cost = selectedStock.price * tradeQuantity;
    if (cost > balance) {
      alert("Insufficient funds!");
      return;
    }

    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: selectedStock.symbol,
      type: "buy",
      quantity: tradeQuantity,
      price: selectedStock.price,
      timestamp: new Date()
    };

    setTrades([...trades, newTrade]);
    setBalance(balance - cost);
    setTotalTrades(totalTrades + 1);

    // Update positions
    const existingPosition = positions.find(p => p.symbol === selectedStock.symbol);
    if (existingPosition) {
      const totalQuantity = existingPosition.quantity + tradeQuantity;
      const totalCost = (existingPosition.avgPrice * existingPosition.quantity) + cost;
      const newAvgPrice = totalCost / totalQuantity;
      
      setPositions(positions.map(p => 
        p.symbol === selectedStock.symbol 
          ? { 
              ...p, 
              quantity: totalQuantity, 
              avgPrice: Math.round(newAvgPrice * 100) / 100 
            }
          : p
      ));
    } else {
      const newPosition: Position = {
        symbol: selectedStock.symbol,
        quantity: tradeQuantity,
        avgPrice: selectedStock.price,
        currentPrice: selectedStock.price,
        pnl: 0,
        pnlPercent: 0
      };
      setPositions([...positions, newPosition]);
    }
  };

  const handleSell = () => {
    const position = positions.find(p => p.symbol === selectedStock.symbol);
    if (!position || position.quantity < tradeQuantity) {
      alert("Insufficient shares to sell!");
      return;
    }

    const revenue = selectedStock.price * tradeQuantity;
    const costBasis = position.avgPrice * tradeQuantity;
    const profit = revenue - costBasis;

    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: selectedStock.symbol,
      type: "sell",
      quantity: tradeQuantity,
      price: selectedStock.price,
      timestamp: new Date()
    };

    setTrades([...trades, newTrade]);
    setBalance(balance + revenue);
    setTotalTrades(totalTrades + 1);
    
    if (profit > 0) {
      setSuccessfulTrades(successfulTrades + 1);
    }

    // Update positions
    if (position.quantity === tradeQuantity) {
      setPositions(positions.filter(p => p.symbol !== selectedStock.symbol));
    } else {
      setPositions(positions.map(p => 
        p.symbol === selectedStock.symbol 
          ? { ...p, quantity: p.quantity - tradeQuantity }
          : p
      ));
    }
  };

  const resetSimulation = () => {
    setBalance(10000);
    setPositions([]);
    setTrades([]);
    setTotalTrades(0);
    setSuccessfulTrades(0);
    setGameStage("playing");
    setStocks(simulationStocks);
  };

  if (gameStage === "complete") {
    const portfolioValue = calculatePortfolioValue();
    const totalValue = balance + portfolioValue;
    const profit = totalValue - 10000;
    const profitPercent = (profit / 10000) * 100;
    const successRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Trading Simulation Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Final Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Profit/Loss</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercent.toFixed(1)}%)
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <p className="text-gray-600">Success Rate: {successRate.toFixed(1)}% ({successfulTrades}/{totalTrades} trades)</p>
            
            {profit > 1000 && (
              <Badge className="bg-green-600 text-white">Excellent Trader!</Badge>
            )}
            {profit > 0 && profit <= 1000 && (
              <Badge className="bg-blue-600 text-white">Profitable Trading!</Badge>
            )}
            {profit <= 0 && (
              <Badge className="bg-orange-600 text-white">Keep Learning!</Badge>
            )}
          </div>
          
          <Button onClick={resetSimulation} className="bg-gradient-to-r from-green-500 to-emerald-600">
            <RotateCcw className="mr-2" size={16} />
            Start New Simulation
          </Button>
        </CardContent>
      </Card>
    );
  }

  const portfolioValue = calculatePortfolioValue();
  const totalValue = balance + portfolioValue;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto text-green-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Cash Balance</p>
            <p className="text-xl font-bold">${balance.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="mx-auto text-blue-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Portfolio Value</p>
            <p className="text-xl font-bold">${portfolioValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="mx-auto text-purple-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-xl font-bold">${totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="mx-auto text-yellow-600 mb-2" size={24} />
            <p className="text-sm text-gray-600">Trades</p>
            <p className="text-xl font-bold">{totalTrades}/10</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trading Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Panel</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Stock Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Stock</p>
              <div className="grid grid-cols-1 gap-2">
                {stocks.map(stock => (
                  <Button
                    key={stock.symbol}
                    variant={selectedStock.symbol === stock.symbol ? "default" : "outline"}
                    onClick={() => setSelectedStock(stock)}
                    className="justify-between p-3"
                  >
                    <span className="font-semibold">{stock.symbol}</span>
                    <div className="text-right">
                      <div className="font-semibold">${stock.price.toFixed(2)}</div>
                      <div className={`text-xs ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
              <Input
                type="number"
                min="1"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* Trade Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleBuy}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={selectedStock.price * tradeQuantity > balance}
              >
                <TrendingUp className="mr-2" size={16} />
                Buy (${(selectedStock.price * tradeQuantity).toFixed(2)})
              </Button>
              <Button 
                onClick={handleSell}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!positions.find(p => p.symbol === selectedStock.symbol && p.quantity >= tradeQuantity)}
              >
                <TrendingDown className="mr-2" size={16} />
                Sell (${(selectedStock.price * tradeQuantity).toFixed(2)})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Your Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No positions yet. Start trading!</p>
            ) : (
              <div className="space-y-3">
                {positions.map(position => (
                  <div key={position.symbol} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{position.symbol}</p>
                        <p className="text-sm text-gray-600">{position.quantity} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(position.currentPrice * position.quantity).toFixed(2)}</p>
                        <p className={`text-sm ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: ${position.avgPrice.toFixed(2)} | Current: ${position.currentPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}