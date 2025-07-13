import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, PlayCircle, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewDemo: () => void;
}

export function HeroSection({ onStartAnalysis, onViewDemo }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-modern text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center bg-gradient-glass rounded-full px-6 py-3 animate-pulse-glow">
              <Rocket className="text-yellow-300 mr-3 animate-float" size={18} />
              <span className="text-sm font-semibold tracking-wide">Enhanced Analysis Now Available</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
                Advanced Stock Pattern Recognition
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed font-light">
                Analyze <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">stocks from NSE, NYSE & NASDAQ</span> with real-time Yahoo Finance data, confidence scores, breakout timing, and key level identification.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartAnalysis}
                className="group bg-white text-blue-600 px-10 py-5 rounded-xl font-bold hover:bg-gray-50 transition-all-smooth hover:scale-105 hover:shadow-xl text-lg"
                size="lg"
              >
                <BarChart3 className="mr-3 group-hover:scale-110 transition-transform" size={22} />
                Start Analysis
              </Button>
              <Button 
                onClick={onViewDemo}
                variant="outline"
                className="group border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold hover:bg-white/20 transition-all-smooth hover:scale-105 bg-white/10 backdrop-blur-sm text-lg"
                size="lg"
              >
                <PlayCircle className="mr-3 group-hover:scale-110 transition-transform" size={22} />
                View Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold">Live Data</div>
                  <div className="text-xs text-blue-200">Yahoo Finance API</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold">Real-Time Data</div>
                  <div className="text-xs text-blue-200">Yahoo Finance</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold">95%+ Accuracy</div>
                  <div className="text-xs text-blue-200">Pattern Recognition</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:ml-8">
            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional trading workspace with multiple monitors" 
                className="rounded-2xl shadow-2xl w-full h-auto transform group-hover:scale-105 transition-all-smooth"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats Cards */}
            <div className="absolute -bottom-8 -left-8 bg-gradient-glass backdrop-blur-md rounded-2xl shadow-2xl p-6 text-white border border-white/20 animate-float">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-success">95.5%</div>
              <div className="text-sm text-gray-200 font-medium">Pattern Accuracy</div>
              <div className="w-8 h-1 bg-gradient-success rounded-full mt-2"></div>
            </div>
            
            <div className="absolute -top-8 -right-8 bg-gradient-glass backdrop-blur-md rounded-2xl shadow-2xl p-6 text-white border border-white/20 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-warning">3</div>
              <div className="text-sm text-gray-200 font-medium">Global Exchanges</div>
              <div className="w-8 h-1 bg-gradient-warning rounded-full mt-2"></div>
            </div>
            
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-gradient-glass backdrop-blur-md rounded-2xl shadow-2xl p-4 text-white border border-white/20 animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-lg font-bold text-green-400">LIVE</div>
              <div className="text-xs text-gray-200">Real-time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
