import { AlertTriangle } from "lucide-react";

export function DisclaimerSection() {
  return (
    <section className="py-16 bg-yellow-50 border-t border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">Important Disclaimer</h3>
              <div className="text-brand-gray leading-relaxed space-y-3">
                <p>
                  <strong>Educational Purpose Only:</strong> This application provides enhanced technical analysis for educational purposes only. 
                  Our AI-powered pattern recognition system offers insights based on historical data and should not be considered as financial advice.
                </p>
                <p>
                  <strong>Enhanced Features:</strong> Our platform includes 3-month data analysis, dynamic confidence scoring, 
                  and breakout timing predictions to provide comprehensive market insights.
                </p>
                <p>
                  <strong>Investment Risk:</strong> All investments carry risk. Past performance does not guarantee future results. 
                  Always conduct thorough research and consult qualified financial advisors before making investment decisions.
                </p>
                <p>
                  <strong>Data Accuracy:</strong> While we strive for accuracy, market data and analysis results may contain errors or delays. 
                  Verify all information independently before trading.
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-brand-dark mb-1">Risk Management</div>
                  <div className="text-brand-gray">Always use proper risk management techniques and never invest more than you can afford to lose.</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-brand-dark mb-1">Professional Advice</div>
                  <div className="text-brand-gray">Consult with licensed financial advisors for personalized investment strategies.</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-brand-dark mb-1">Market Volatility</div>
                  <div className="text-brand-gray">Markets can be highly volatile and unpredictable. Trade responsibly.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
