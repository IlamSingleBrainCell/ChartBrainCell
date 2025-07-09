import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, Trophy, BookOpen } from "lucide-react";

interface TerminologyQuizProps {
  onComplete: (points: number) => void;
}

interface QuizQuestion {
  id: string;
  term: string;
  definition: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: "pe-ratio",
    term: "P/E Ratio",
    definition: "What does P/E Ratio measure?",
    options: [
      "Price compared to earnings per share",
      "Profit compared to expenses",
      "Price compared to equity",
      "Performance compared to expectations"
    ],
    correctAnswer: "Price compared to earnings per share",
    explanation: "The Price-to-Earnings ratio compares a company's share price to its earnings per share, indicating how much investors pay for each dollar of earnings."
  },
  {
    id: "market-cap",
    term: "Market Capitalization",
    definition: "How is market capitalization calculated?",
    options: [
      "Total revenue × number of employees",
      "Share price × number of outstanding shares",
      "Total assets - total liabilities",
      "Annual profit × growth rate"
    ],
    correctAnswer: "Share price × number of outstanding shares",
    explanation: "Market cap is the total value of a company's shares, calculated by multiplying the current share price by the number of outstanding shares."
  },
  {
    id: "dividend-yield",
    term: "Dividend Yield",
    definition: "What does dividend yield represent?",
    options: [
      "Annual dividends per share ÷ share price",
      "Total dividends ÷ company revenue",
      "Dividend growth rate over time",
      "Dividends ÷ company profit"
    ],
    correctAnswer: "Annual dividends per share ÷ share price",
    explanation: "Dividend yield shows the annual dividend payments relative to the stock price, expressed as a percentage."
  },
  {
    id: "bear-market",
    term: "Bear Market",
    definition: "What characterizes a bear market?",
    options: [
      "Stock prices declining 20% or more",
      "High trading volume",
      "Increased company profits",
      "Rising interest rates"
    ],
    correctAnswer: "Stock prices declining 20% or more",
    explanation: "A bear market is typically defined as a period when stock prices fall 20% or more from recent highs, often accompanied by negative investor sentiment."
  },
  {
    id: "volatility",
    term: "Volatility",
    definition: "What does stock volatility measure?",
    options: [
      "The company's profit stability",
      "Price fluctuation over time",
      "Trading volume changes",
      "Market capitalization growth"
    ],
    correctAnswer: "Price fluctuation over time",
    explanation: "Volatility measures how much a stock's price fluctuates over time. Higher volatility indicates larger price swings."
  },
  {
    id: "ipo",
    term: "IPO",
    definition: "What does IPO stand for?",
    options: [
      "Initial Public Offering",
      "International Portfolio Option",
      "Investment Performance Objective",
      "Internal Profit Operation"
    ],
    correctAnswer: "Initial Public Offering",
    explanation: "An IPO is when a private company first sells shares to the public, allowing investors to buy ownership stakes in the company."
  },
  {
    id: "support-resistance",
    term: "Support and Resistance",
    definition: "What are support and resistance levels?",
    options: [
      "Price levels where buying/selling pressure increases",
      "Company financial statement categories",
      "Types of stock market orders",
      "Economic indicator measurements"
    ],
    correctAnswer: "Price levels where buying/selling pressure increases",
    explanation: "Support is a price level where buying pressure typically increases, while resistance is where selling pressure increases, creating barriers for price movement."
  },
  {
    id: "rsi",
    term: "RSI",
    definition: "What does RSI (Relative Strength Index) indicate?",
    options: [
      "Whether a stock is overbought or oversold",
      "Company's relative market position",
      "Revenue growth compared to competitors",
      "Stock's trading volume strength"
    ],
    correctAnswer: "Whether a stock is overbought or oversold",
    explanation: "RSI is a momentum oscillator that ranges from 0-100, helping identify overbought (above 70) and oversold (below 30) conditions."
  }
];

export function TerminologyQuiz({ onComplete }: TerminologyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    // Shuffle questions and select 5 for the quiz
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 5));
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 15);
      setCorrectAnswers(correctAnswers + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore = isCorrect ? score + 15 : score;
        onComplete(finalScore);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer("");
    setShowResult(false);
    setGameComplete(false);
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 5));
  };

  if (quizQuestions.length === 0) {
    return <div className="animate-pulse">Loading quiz...</div>;
  }

  if (gameComplete) {
    const percentage = (correctAnswers / quizQuestions.length) * 100;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600 mb-2">{score} Points</p>
            <p className="text-gray-600">
              {correctAnswers} out of {quizQuestions.length} correct ({percentage.toFixed(0)}%)
            </p>
          </div>
          
          <div className="space-y-2 mb-6">
            {percentage === 100 && (
              <Badge className="bg-green-600 text-white">Perfect Score! Quiz Master</Badge>
            )}
            {percentage >= 80 && percentage < 100 && (
              <Badge className="bg-blue-600 text-white">Excellent Knowledge!</Badge>
            )}
            {percentage >= 60 && percentage < 80 && (
              <Badge className="bg-yellow-600 text-white">Good Understanding!</Badge>
            )}
            {percentage < 60 && (
              <Badge className="bg-orange-600 text-white">Keep Studying!</Badge>
            )}
          </div>
          
          <Button onClick={resetQuiz} className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <RotateCcw className="mr-2" size={16} />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 text-blue-600" size={28} />
              Stock Market Terminology Quiz
            </h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="text-center">
            <Badge className="mb-4 bg-blue-600 text-white text-lg px-4 py-2">
              {currentQ.term}
            </Badge>
            <CardTitle className="text-xl">{currentQ.definition}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentQ.options.map((option, index) => {
              let buttonClass = "bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-900 text-left";
              
              if (showResult && option === currentQ.correctAnswer) {
                buttonClass = "bg-green-100 border-green-500 text-green-800 text-left";
              } else if (showResult && selectedAnswer === option && option !== currentQ.correctAnswer) {
                buttonClass = "bg-red-100 border-red-500 text-red-800 text-left";
              }

              return (
                <Button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`p-4 h-auto justify-start ${buttonClass}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{option}</span>
                    {showResult && option === currentQ.correctAnswer && (
                      <CheckCircle className="text-green-600" size={20} />
                    )}
                    {showResult && selectedAnswer === option && option !== currentQ.correctAnswer && (
                      <XCircle className="text-red-600" size={20} />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedAnswer === currentQ.correctAnswer ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <CheckCircle className="text-white" size={16} />
                  ) : (
                    <XCircle className="text-white" size={16} />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {selectedAnswer === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    <strong>Explanation:</strong> {currentQ.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}