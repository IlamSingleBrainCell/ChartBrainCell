import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, PlayCircle, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewDemo: () => void;
}

export function HeroSection({ onStartAnalysis, onViewDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-24 neural-grid">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-8 glow-pulse">
              <Rocket className="text-yellow-300 mr-3 bounce-gentle" size={18} />
              <span className="text-sm font-semibold tracking-wide">🚀 AI-Powered Analysis Live</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8 gradient-text">
              Smart Stock Pattern Recognition
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed font-light">
              Unleash the power of advanced AI to analyze live stock charts with 
              <span className="text-yellow-300 font-semibold"> 98.5% accuracy</span> pattern recognition 
              and precise breakout timing predictions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <Button 
                onClick={onStartAnalysis}
                className="button-modern bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 focus-ring"
                size="lg"
                aria-label="Start analyzing stocks now"
              >
                <BarChart3 className="mr-3" size={24} />
                Start Analysis Now
              </Button>
              <Button 
                onClick={onViewDemo}
                variant="outline"
                className="button-modern border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/50 bg-white/5 backdrop-blur-sm focus-ring"
                size="lg"
                aria-label="Watch interactive demo"
              >
                <PlayCircle className="mr-3" size={24} />
                Watch Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center glass-effect rounded-2xl p-4">
                <CheckCircle className="text-green-400 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-lg">96+</div>
                  <div className="text-sm text-gray-300">Global Stocks</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center glass-effect rounded-2xl p-4">
                <CheckCircle className="text-green-400 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-lg">Real-time</div>
                  <div className="text-sm text-gray-300">Live Data</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center glass-effect rounded-2xl p-4">
                <CheckCircle className="text-green-400 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0" size={20} />
                <div>
                  <div className="font-bold text-lg">AI-Powered</div>
                  <div className="text-sm text-gray-300">Predictions</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative scale-in lg:scale-110">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional trading workspace with multiple monitors showing stock analysis" 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 glass-effect rounded-2xl shadow-2xl p-6 text-white card-hover">
              <div className="text-3xl font-black text-emerald-400">98.5%</div>
              <div className="text-sm font-medium text-gray-200">Pattern Accuracy</div>
              <div className="w-12 h-1 bg-emerald-400 mt-2 rounded-full"></div>
            </div>
            
            <div className="absolute -top-8 -right-8 glass-effect rounded-2xl shadow-2xl p-6 text-white card-hover">
              <div className="text-3xl font-black text-blue-400">96+</div>
              <div className="text-sm font-medium text-gray-200">Global Stocks</div>
              <div className="w-12 h-1 bg-blue-400 mt-2 rounded-full"></div>
            </div>
            
            <div className="absolute top-1/2 -right-12 glass-effect rounded-2xl shadow-2xl p-4 text-white card-hover">
              <div className="text-2xl font-black text-purple-400">24/7</div>
              <div className="text-xs font-medium text-gray-200">Live Updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
