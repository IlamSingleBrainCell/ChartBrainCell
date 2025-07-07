import { CheckCircle } from "lucide-react";

export function EducationalSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-6">
              Enhanced by Advanced AI Pattern Recognition
            </h2>
            <p className="text-xl text-brand-gray mb-8 leading-relaxed">
              Our cutting-edge AI technology analyzes complex market patterns, providing you with 
              institutional-grade insights for smarter trading decisions.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">3-Month Historical Analysis</h3>
                  <p className="text-brand-gray">Comprehensive pattern analysis using 90 days of price data for accurate predictions.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">Dynamic Confidence Scoring</h3>
                  <p className="text-brand-gray">Real-time confidence metrics help you understand the reliability of each analysis.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">Breakout Timing Predictions</h3>
                  <p className="text-brand-gray">Advanced algorithms predict potential breakout timing with high accuracy.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Advanced financial analytics dashboard with multiple data visualizations" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-brand-dark">AI Certified</span>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-brand-dark">Secure Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
