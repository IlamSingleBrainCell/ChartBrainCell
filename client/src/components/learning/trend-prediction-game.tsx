import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, RotateCcw, Trophy, Target } from "lucide-react";

interface TrendPredictionGameProps {
  onComplete: (points: number) => void;
}

interface PriceData {
  date: string;
  price: number;
}

interface PredictionRound {
  id: string;
  symbol: string;
  historicalData: PriceData[];
  actualTrend: "up" | "down" | "sideways";
  actualPrice: number;
}

export function TrendPredictionGame({ onComplete }: TrendPredictionGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [prediction, setPrediction] = useState<"up" | "down" | "sideways" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [rounds, setRounds] = useState<PredictionRound[]>([]);
  const [correctPredictions, setCorrectPredictions] = useState(0);

  useEffect(() => {
    generateRounds();
  }, []);

  const generateRounds = () => {
    const stocks = ["AAPL", "GOOGL", "TSLA", "MSFT", "AMZN"];
    const gameRounds: PredictionRound[] = [];

    for (let i = 0; i < 5; i++) {
      const symbol = stocks[i];
      const basePrice = 100 + Math.random() * 200; // $100-$300 base price
      
      // Generate 7 days of historical data
      const historicalData: PriceData[] = [];
      let currentPrice = basePrice;
      
      for (let day = 0; day < 7; day++) {
        const dailyChange = (Math.random() - 0.5) * 0.1; // -5% to +5% daily change
        currentPrice = currentPrice * (1 + dailyChange);
        historicalData.push({
          date: new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          price: Math.round(currentPrice * 100) / 100
        });
      }
      
      // Generate actual next day movement
      const trendRandom = Math.random();
      let actualTrend: "up" | "down" | "sideways";
      let nextDayChange: number;
      
      if (trendRandom < 0.4) {
        actualTrend = "up";
        nextDayChange = 0.02 + Math.random() * 0.08; // 2-10% increase
      } else if (trendRandom < 0.8) {
        actualTrend = "down";
        nextDayChange = -(0.02 + Math.random() * 0.08); // 2-10% decrease
      } else {
        actualTrend = "sideways";
        nextDayChange = (Math.random() - 0.5) * 0.04; // -2% to +2%
      }
      
      const actualPrice = currentPrice * (1 + nextDayChange);
      
      gameRounds.push({
        id: `round-${i}`,
        symbol,
        historicalData,
        actualTrend,
        actualPrice: Math.round(actualPrice * 100) / 100
      });
    }
    
    setRounds(gameRounds);
  };

  const handlePrediction = (selectedPrediction: "up" | "down" | "sideways") => {
    setPrediction(selectedPrediction);
    setShowResult(true);
    
    const currentRoundData = rounds[currentRound];
    const isCorrect = selectedPrediction === currentRoundData.actualTrend;
    
    if (isCorrect) {
      setScore(score + 60);
      setCorrectPredictions(correctPredictions + 1);
    }
    
    setTimeout(() => {
      if (currentRound < rounds.length - 1) {
        setCurrentRound(currentRound + 1);
        setPrediction(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore = isCorrect ? score + 60 : score;
        onComplete(finalScore);
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setCorrectPredictions(0);
    setPrediction(null);
    setShowResult(false);
    setGameComplete(false);
    generateRounds();
  };

  const calculateTrendPercentage = (data: PriceData[]) => {
    if (data.length < 2) return 0;
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  if (rounds.length === 0) {
    return <div className="animate-pulse">Loading prediction game...</div>;
  }

  if (gameComplete) {
    const accuracy = (correctPredictions / rounds.length) * 100;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Prediction Challenge Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <p className="text-3xl font-bold text-red-600 mb-2">{score} Points</p>
            <p className="text-gray-600">
              {correctPredictions} out of {rounds.length} correct predictions ({accuracy.toFixed(0)}% accuracy)
            </p>
          </div>
          
          <div className="space-y-2 mb-6">
            {accuracy >= 80 && (
              <Badge className="bg-green-600 text-white">Master Predictor!</Badge>
            )}
            {accuracy >= 60 && accuracy < 80 && (
              <Badge className="bg-blue-600 text-white">Good Market Sense!</Badge>
            )}
            {accuracy >= 40 && accuracy < 60 && (
              <Badge className="bg-yellow-600 text-white">Keep Analyzing!</Badge>
            )}
            {accuracy < 40 && (
              <Badge className="bg-orange-600 text-white">Study More Patterns!</Badge>
            )}
          </div>
          
          <Button onClick={resetGame} className="bg-gradient-to-r from-red-500 to-rose-600">
            <RotateCcw className="mr-2" size={16} />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentRoundData = rounds[currentRound];
  const progress = ((currentRound + 1) / rounds.length) * 100;
  const trendPercentage = calculateTrendPercentage(currentRoundData.historicalData);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Target className="mr-3 text-red-600" size={28} />
              Trend Prediction Challenge
            </h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-600">
            Round {currentRound + 1} of {rounds.length}
          </p>
        </CardContent>
      </Card>

      {/* Chart and Prediction */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Analyze {currentRoundData.symbol} - Predict Next Day Movement</CardTitle>
            <Badge className="bg-blue-600 text-white">
              7-Day Trend: {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Historical Price Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">7-Day Price History</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-end h-32 mb-4">
                {currentRoundData.historicalData.map((data, index) => {
                  const minPrice = Math.min(...currentRoundData.historicalData.map(d => d.price));
                  const maxPrice = Math.max(...currentRoundData.historicalData.map(d => d.price));
                  const height = ((data.price - minPrice) / (maxPrice - minPrice)) * 100 + 20;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t-sm w-8"
                        style={{ height: `${height}px` }}
                      ></div>
                      <div className="text-xs mt-2 text-center">
                        <div className="font-semibold">${data.price.toFixed(2)}</div>
                        <div className="text-gray-500">{data.date.split('/').slice(0, 2).join('/')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Price Statistics */}
              <div className="grid grid-cols-3 gap-4 text-center border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Starting Price</p>
                  <p className="font-semibold">${currentRoundData.historicalData[0].price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="font-semibold">${currentRoundData.historicalData[currentRoundData.historicalData.length - 1].price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">7-Day Change</p>
                  <p className={`font-semibold ${trendPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Buttons */}
          {!showResult && (
            <div>
              <h3 className="text-lg font-semibold mb-4">What will happen to {currentRoundData.symbol} tomorrow?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handlePrediction("up")}
                  className="p-6 h-auto flex-col bg-green-600 hover:bg-green-700 text-white"
                >
                  <TrendingUp size={32} className="mb-2" />
                  <span className="font-semibold text-lg">Price will Rise</span>
                  <span className="text-sm opacity-90">Bullish prediction</span>
                </Button>

                <Button
                  onClick={() => handlePrediction("down")}
                  className="p-6 h-auto flex-col bg-red-600 hover:bg-red-700 text-white"
                >
                  <TrendingDown size={32} className="mb-2" />
                  <span className="font-semibold text-lg">Price will Fall</span>
                  <span className="text-sm opacity-90">Bearish prediction</span>
                </Button>

                <Button
                  onClick={() => handlePrediction("sideways")}
                  className="p-6 h-auto flex-col bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <Minus size={32} className="mb-2" />
                  <span className="font-semibold text-lg">Price will Stay Flat</span>
                  <span className="text-sm opacity-90">Neutral prediction</span>
                </Button>
              </div>
            </div>
          )}

          {/* Result */}
          {showResult && (
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  prediction === currentRoundData.actualTrend ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {prediction === currentRoundData.actualTrend ? (
                    <TrendingUp className="text-white" size={32} />
                  ) : (
                    <TrendingDown className="text-white" size={32} />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {prediction === currentRoundData.actualTrend ? 'Correct Prediction!' : 'Incorrect Prediction'}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Your Prediction</p>
                  <p className="font-semibold capitalize">{prediction}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actual Result</p>
                  <p className="font-semibold capitalize">{currentRoundData.actualTrend}</p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Next Day Price</p>
                <p className="text-2xl font-bold">${currentRoundData.actualPrice.toFixed(2)}</p>
                <p className={`text-sm ${
                  currentRoundData.actualPrice > currentRoundData.historicalData[currentRoundData.historicalData.length - 1].price 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {currentRoundData.actualPrice > currentRoundData.historicalData[currentRoundData.historicalData.length - 1].price ? '↗' : '↘'} 
                  {Math.abs(((currentRoundData.actualPrice - currentRoundData.historicalData[currentRoundData.historicalData.length - 1].price) / currentRoundData.historicalData[currentRoundData.historicalData.length - 1].price) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}