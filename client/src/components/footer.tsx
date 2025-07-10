import { TrendingUp, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-modern rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  Stock Chart Analyzer
                </h3>
                <p className="text-gray-300 text-lg font-medium">Professional Pattern Recognition</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed max-w-lg text-lg">
              Enterprise-grade AI-powered stock pattern recognition with real-time Yahoo Finance data, 
              95%+ accuracy scoring, and comprehensive breakout timing predictions across global markets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all-smooth hover:scale-110 border border-white/20">
                <Twitter size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all-smooth hover:scale-110 border border-white/20">
                <Linkedin size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all-smooth hover:scale-110 border border-white/20">
                <Github size={24} />
              </a>
            </div>
          </div>
          
          {/* Features Column */}
          <div>
            <h4 className="text-2xl font-bold mb-8 text-white">Core Features</h4>
            <ul className="space-y-4 text-gray-300">
              <li><a href="#" className="hover:text-blue-300 transition-colors flex items-center text-lg"><span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>Real-Time Analysis</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors flex items-center text-lg"><span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>95%+ Pattern Accuracy</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors flex items-center text-lg"><span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>Confidence Scoring</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors flex items-center text-lg"><span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>Breakout Predictions</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors flex items-center text-lg"><span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>96+ Global Stocks</a></li>
            </ul>
          </div>
          
          {/* Markets Column */}
          <div>
            <h4 className="text-2xl font-bold mb-8 text-white">Supported Markets</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center text-lg">
                <span className="text-2xl mr-3">🇺🇸</span>
                <div>
                  <div className="font-semibold">NASDAQ & NYSE</div>
                  <div className="text-sm text-gray-400">US Stock Markets</div>
                </div>
              </li>
              <li className="flex items-center text-lg">
                <span className="text-2xl mr-3">🇮🇳</span>
                <div>
                  <div className="font-semibold">NSE & BSE</div>
                  <div className="text-sm text-gray-400">Indian Stock Markets</div>
                </div>
              </li>
              <li className="flex items-center text-lg">
                <span className="text-2xl mr-3">📈</span>
                <div>
                  <div className="font-semibold">Yahoo Finance</div>
                  <div className="text-sm text-gray-400">Real-time Data API</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Enhanced Bottom Bar */}
        <div className="border-t border-white/20 mt-16 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-lg font-semibold text-white mb-2">© 2025 Stock Chart Analyzer. All rights reserved.</p>
              <p className="text-blue-300 font-medium text-lg">Developed by <span className="font-bold">Ilam</span></p>
              <div className="flex items-center justify-center md:justify-start mt-3 space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Free Service • No Subscription Required
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors font-medium">Trading Disclaimer</a>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">95%+</div>
              <div className="text-sm text-gray-400">Pattern Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">96+</div>
              <div className="text-sm text-gray-400">Global Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">Real-Time</div>
              <div className="text-sm text-gray-400">Yahoo Finance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">Free</div>
              <div className="text-sm text-gray-400">Always</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
