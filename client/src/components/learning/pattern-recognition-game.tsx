import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";

interface PatternRecognitionGameProps {
  onComplete: (points: number) => void;
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  image: string;
  type: "bullish" | "bearish" | "neutral";
}

const patterns: Pattern[] = [
  {
    id: "head-shoulders",
    name: "Head and Shoulders",
    description: "A bearish reversal pattern with three peaks, the middle one being the highest",
    image: "📈",
    type: "bearish"
  },
  {
    id: "double-top",
    name: "Double Top",
    description: "A bearish reversal pattern showing two peaks at roughly the same level",
    image: "📊",
    type: "bearish"
  },
  {
    id: "ascending-triangle",
    name: "Ascending Triangle",
    description: "A bullish continuation pattern with horizontal resistance and rising support",
    image: "📈",
    type: "bullish"
  },
  {
    id: "cup-handle",
    name: "Cup and Handle",
    description: "A bullish continuation pattern resembling a tea cup with a handle",
    image: "☕",
    type: "bullish"
  },
  {
    id: "flag",
    name: "Bull Flag",
    description: "A short-term bullish continuation pattern after a strong upward move",
    image: "🏁",
    type: "bullish"
  },
  {
    id: "wedge",
    name: "Rising Wedge",
    description: "A bearish pattern where price moves up but with decreasing momentum",
    image: "📐",
    type: "bearish"
  }
];

export function PatternRecognitionGame({ onComplete }: PatternRecognitionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [questions, setQuestions] = useState<Array<{
    pattern: Pattern;
    options: string[];
    correctAnswer: string;
  }>>([]);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const shuffledPatterns = [...patterns].sort(() => Math.random() - 0.5);
    const gameQuestions = shuffledPatterns.slice(0, 5).map(pattern => {
      const incorrectOptions = patterns
        .filter(p => p.id !== pattern.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map(p => p.name);
      
      const options = [pattern.name, ...incorrectOptions].sort(() => Math.random() - 0.5);
      
      return {
        pattern,
        options,
        correctAnswer: pattern.name
      };
    });
    
    setQuestions(gameQuestions);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 20);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer("");
        setShowResult(false);
      } else {
        setGameComplete(true);
        const finalScore = answer === questions[currentQuestion].correctAnswer ? score + 20 : score;
        onComplete(finalScore);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer("");
    setShowResult(false);
    setGameComplete(false);
    generateQuestions();
  };

  if (questions.length === 0) {
    return <div className="animate-pulse">Loading game...</div>;
  }

  if (gameComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <p className="text-3xl font-bold text-green-600 mb-2">{score} / 100 Points</p>
            <p className="text-gray-600">
              You correctly identified {score / 20} out of {questions.length} patterns
            </p>
          </div>
          
          <div className="space-y-2 mb-6">
            {score >= 80 && (
              <Badge className="bg-green-600 text-white">Excellent! Pattern Master</Badge>
            )}
            {score >= 60 && score < 80 && (
              <Badge className="bg-blue-600 text-white">Good Job! Keep Learning</Badge>
            )}
            {score < 60 && (
              <Badge className="bg-orange-600 text-white">Practice More!</Badge>
            )}
          </div>
          
          <Button onClick={resetGame} className="bg-gradient-to-r from-purple-500 to-indigo-600">
            <RotateCcw className="mr-2" size={16} />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Pattern Recognition Challenge</h2>
            <Badge variant="outline" className="text-lg px-3 py-1">
              Score: {score}
            </Badge>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Identify the Chart Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Pattern Display */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl">{currentQ.pattern.image}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 italic">"{currentQ.pattern.description}"</p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentQ.options.map((option, index) => {
              let buttonClass = "bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-900";
              
              if (showResult && option === currentQ.correctAnswer) {
                buttonClass = "bg-green-100 border-green-500 text-green-800";
              } else if (showResult && selectedAnswer === option && option !== currentQ.correctAnswer) {
                buttonClass = "bg-red-100 border-red-500 text-red-800";
              }

              return (
                <Button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`p-6 h-auto flex-col ${buttonClass}`}
                >
                  <span className="font-semibold text-lg mb-2">{option}</span>
                  {showResult && option === currentQ.correctAnswer && (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                  {showResult && selectedAnswer === option && option !== currentQ.correctAnswer && (
                    <XCircle className="text-red-600" size={20} />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
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
                    <strong>{currentQ.pattern.name}</strong> is a {currentQ.pattern.type} pattern. 
                    {currentQ.pattern.description}
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