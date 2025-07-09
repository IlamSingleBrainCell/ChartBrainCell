import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, PlayCircle, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onStartAnalysis: () => void;
  onViewDemo: () => void;
}

export function HeroSection({ onStartAnalysis, onViewDemo }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-6">
              <Rocket className="text-yellow-300 mr-2" size={16} />
              <span className="text-sm font-medium">Enhanced Analysis Now Available</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Advanced Stock Pattern Recognition
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Analyze live stock charts with enhanced pattern recognition and breakout timing prediction. 
              Supporting 65+ stocks from NSE, NYSE, and BSE markets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={onStartAnalysis}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                size="lg"
              >
                <BarChart3 className="mr-2" size={20} />
                Start Analysis
              </Button>
              <Button 
                onClick={onViewDemo}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors bg-transparent"
                size="lg"
              >
                <PlayCircle className="mr-2" size={20} />
                View Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span>65+ Stock Database</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span>3-Month Analysis</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-400 mr-2" size={16} />
                <span>Breakout Predictions</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional trading workspace with multiple monitors" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 text-brand-dark">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-brand-gray">Pattern Accuracy</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-4 text-brand-dark">
              <div className="text-2xl font-bold text-blue-600">65+</div>
              <div className="text-sm text-brand-gray">Supported Stocks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
