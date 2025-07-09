import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, BookOpen, TrendingUp, Brain, Gamepad2, Award, Star } from "lucide-react";
import { PatternRecognitionGame } from "@/components/learning/pattern-recognition-game";
import { TradingSimulation } from "@/components/learning/trading-simulation";
import { TerminologyQuiz } from "@/components/learning/terminology-quiz";
import { TrendPredictionGame } from "@/components/learning/trend-prediction-game";

type LearningModule = 
  | "dashboard"
  | "pattern-recognition"
  | "trading-simulation" 
  | "terminology-quiz"
  | "trend-prediction";

interface UserProgress {
  level: number;
  totalPoints: number;
  completedModules: string[];
  achievements: string[];
}

export default function Learn() {
  const [activeModule, setActiveModule] = useState<LearningModule>("dashboard");
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    totalPoints: 0,
    completedModules: [],
    achievements: []
  });

  const modules = [
    {
      id: "pattern-recognition" as LearningModule,
      title: "Pattern Recognition",
      description: "Learn to identify chart patterns like Head & Shoulders, Double Top, and Triangle patterns",
      icon: Brain,
      difficulty: "Beginner",
      points: 100,
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "trading-simulation" as LearningModule,
      title: "Trading Simulation",
      description: "Practice trading with virtual money and learn risk management",
      icon: TrendingUp,
      difficulty: "Intermediate",
      points: 200,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "terminology-quiz" as LearningModule,
      title: "Stock Market Quiz",
      description: "Master financial terms, ratios, and market concepts",
      icon: BookOpen,
      difficulty: "Beginner",
      points: 75,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "trend-prediction" as LearningModule,
      title: "Trend Prediction",
      description: "Analyze historical data and predict future price movements",
      icon: Target,
      difficulty: "Advanced",
      points: 300,
      color: "from-red-500 to-rose-600"
    }
  ];

  const achievements = [
    { id: "first-pattern", name: "Pattern Spotter", description: "Identified your first chart pattern", icon: "🎯" },
    { id: "profitable-trade", name: "Profitable Trader", description: "Made your first profitable trade", icon: "💰" },
    { id: "quiz-master", name: "Quiz Master", description: "Scored 100% on a terminology quiz", icon: "🧠" },
    { id: "trend-predictor", name: "Trend Predictor", description: "Successfully predicted 5 trends", icon: "🔮" }
  ];

  const handleModuleComplete = (moduleId: string, points: number) => {
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      completedModules: [...prev.completedModules, moduleId],
      level: Math.floor((prev.totalPoints + points) / 500) + 1
    }));
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case "pattern-recognition":
        return <PatternRecognitionGame onComplete={(points) => handleModuleComplete("pattern-recognition", points)} />;
      case "trading-simulation":
        return <TradingSimulation onComplete={(points) => handleModuleComplete("trading-simulation", points)} />;
      case "terminology-quiz":
        return <TerminologyQuiz onComplete={(points) => handleModuleComplete("terminology-quiz", points)} />;
      case "trend-prediction":
        return <TrendPredictionGame onComplete={(points) => handleModuleComplete("trend-prediction", points)} />;
      default:
        return null;
    }
  };

  if (activeModule !== "dashboard") {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back to Dashboard */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setActiveModule("dashboard")}
              className="mb-4"
            >
              ← Back to Learning Dashboard
            </Button>
          </div>
          
          {renderActiveModule()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
              <Gamepad2 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Stock Market Learning Hub
              </h1>
              <p className="text-gray-600 mt-2">Master stock analysis through interactive games and simulations</p>
            </div>
          </div>
        </div>

        {/* User Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Current Level</p>
                  <p className="text-3xl font-bold text-purple-900">{userProgress.level}</p>
                  <p className="text-sm text-purple-600">Learning Enthusiast</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Points</p>
                  <p className="text-3xl font-bold text-green-900">{userProgress.totalPoints}</p>
                  <p className="text-sm text-green-600">Keep learning!</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Star className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Completed Modules</p>
                  <p className="text-3xl font-bold text-blue-900">{userProgress.completedModules.length}</p>
                  <p className="text-sm text-blue-600">of {modules.length} modules</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="mr-3 text-indigo-600" size={28} />
            Learning Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              const isCompleted = userProgress.completedModules.includes(module.id);
              
              return (
                <Card 
                  key={module.id} 
                  className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                    isCompleted ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="text-white" size={24} />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">{module.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {module.difficulty}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {module.points} points
                            </Badge>
                            {isCompleted && (
                              <Badge className="text-xs bg-green-600">
                                ✓ Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                    <Button 
                      className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white`}
                      onClick={() => setActiveModule(module.id)}
                    >
                      {isCompleted ? 'Play Again' : 'Start Learning'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="mr-3 text-yellow-600" size={28} />
            Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const isUnlocked = userProgress.achievements.includes(achievement.id);
              
              return (
                <Card 
                  key={achievement.id}
                  className={`text-center p-4 ${
                    isUnlocked ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-yellow-800' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  {isUnlocked && (
                    <Badge className="mt-2 bg-yellow-600 text-white">Unlocked!</Badge>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}