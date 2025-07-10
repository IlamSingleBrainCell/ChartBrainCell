import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, PlayCircle, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewDemo: () => void;
}

export function HeroSection({ onStartAnalysis, onViewDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white py-28 neural-grid">
      {/* Gen Z Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-pink-500/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-yellow-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-1500"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-8 glow-pulse">
              <Rocket className="text-yellow-300 mr-3 bounce-gentle" size={18} />
              <span className="text-sm font-semibold tracking-wide">🚀 AI-Powered Analysis Live</span>
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8 bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-transparent">
              Smart Stock Pattern Recognition 🚀
            </h1>
            
            <p className="text-2xl lg:text-3xl text-white/90 mb-12 leading-relaxed font-medium">
              Unleash <span className="text-cyan-300 font-black">AI superpowers</span> to analyze live stock charts with 
              <span className="text-yellow-300 font-black bg-yellow-300/20 px-3 py-1 rounded-full"> 98.5% accuracy</span> pattern recognition 
              and <span className="text-pink-300 font-black">precise breakout predictions</span> ⚡
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 mb-16">
              <Button 
                onClick={onStartAnalysis}
                className="button-modern bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white px-12 py-6 rounded-3xl font-black text-xl hover:scale-110 transform transition-all duration-300 shadow-2xl glow-pulse focus-ring"
                size="lg"
                aria-label="Start analyzing stocks now"
              >
                <BarChart3 className="mr-4" size={28} />
                Start Analysis Now 💎
              </Button>
              <Button 
                onClick={onViewDemo}
                variant="outline"
                className="button-modern border-3 border-white/40 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-white/20 hover:border-white/60 bg-white/10 backdrop-blur-lg hover:scale-110 transform transition-all duration-300 shadow-xl focus-ring"
                size="lg"
                aria-label="Watch interactive demo"
              >
                <PlayCircle className="mr-4" size={28} />
                Watch Demo 🎬
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
