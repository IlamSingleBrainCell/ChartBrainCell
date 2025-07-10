import { Brain, Calendar, Clock, Globe, Upload, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Advanced Pattern Recognition",
      description: "Neural network algorithms analyze chart patterns with 95%+ accuracy, identifying Cup & Handle, Ascending Triangles, and more complex formations.",
      gradient: "bg-gradient-modern",
      accentColor: "text-blue-500",
    },
    {
      icon: Calendar,
      title: "Multi-Timeframe Analysis",
      description: "Comprehensive historical analysis across 3 months to 10 years of price data for pattern validation and trend confirmation.",
      gradient: "bg-gradient-success",
      accentColor: "text-green-500",
    },
    {
      icon: Clock,
      title: "Breakout Timing Prediction",
      description: "Predict potential breakout timing with dynamic confidence scoring, support/resistance levels, and momentum indicators.",
      gradient: "bg-gradient-warning",
      accentColor: "text-purple-500",
    },
    {
      icon: Globe,
      title: "Global Market Coverage",
      description: "Real-time data for 96+ stocks from NSE, NYSE, and BSE markets powered by Yahoo Finance API integration.",
      gradient: "bg-brand-orange",
      accentColor: "text-orange-500",
    },
    {
      icon: Upload,
      title: "Custom Chart Analysis",
      description: "Upload your own chart screenshots for instant pattern analysis with our proprietary recognition algorithms.",
      gradient: "bg-red-500",
      accentColor: "text-red-500",
    },
    {
      icon: TrendingUp,
      title: "Live Market Analysis",
      description: "Real-time WebSocket connections deliver live price updates and instant pattern recognition with confidence metrics.",
      gradient: "bg-indigo-500",
      accentColor: "text-indigo-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-blue-100 text-blue-600 rounded-full px-6 py-3 mb-6 font-semibold text-sm">
            Professional Trading Tools
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 leading-tight">
            Enterprise-Grade Analysis Features
          </h2>
          <p className="text-xl text-brand-gray max-w-4xl mx-auto leading-relaxed">
            Cutting-edge pattern recognition technology meets real-time market data to deliver 
            professional-grade analysis for modern traders and investors
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all-smooth hover:scale-105 border border-gray-100"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-brand-dark mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-brand-gray leading-relaxed text-lg group-hover:text-gray-700">
                  {feature.description}
                </p>
                
                {/* Decorative accent */}
                <div className={`w-12 h-1 ${feature.accentColor} bg-current rounded-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              
              {/* Floating decoration */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-modern rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-modern text-white rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all-smooth hover:scale-105">
            <TrendingUp className="mr-3" size={24} />
            <span className="text-lg font-semibold">Start analyzing patterns in seconds</span>
          </div>
        </div>
      </div>
    </section>
  );
}
