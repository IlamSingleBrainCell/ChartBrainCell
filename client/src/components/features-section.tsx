import { Brain, Calendar, Clock, Globe, Upload, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Pattern Recognition",
      description: "Advanced algorithms analyze chart patterns with high accuracy and confidence scoring.",
      color: "bg-blue-600",
    },
    {
      icon: Calendar,
      title: "3-Month Data Analysis",
      description: "Comprehensive historical analysis using 3 months of price data for accurate pattern detection.",
      color: "bg-green-600",
    },
    {
      icon: Clock,
      title: "Breakout Timing",
      description: "Predict potential breakout timing with dynamic confidence scoring and trend analysis.",
      color: "bg-purple-600",
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Support for 65+ stocks from NSE, NYSE, and BSE markets with real-time data integration.",
      color: "bg-orange-500",
    },
    {
      icon: Upload,
      title: "Chart Upload",
      description: "Upload your own chart images for custom analysis with our advanced pattern recognition system.",
      color: "bg-red-500",
    },
    {
      icon: TrendingUp,
      title: "Live Analysis",
      description: "Real-time stock chart analysis with instant pattern recognition and confidence metrics.",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Enhanced Analysis Features</h2>
          <p className="text-xl text-brand-gray max-w-3xl mx-auto">
            Advanced pattern recognition with comprehensive market data analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-4">{feature.title}</h3>
              <p className="text-brand-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
