import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { DemoSection } from "@/components/demo-section";
import { AnalysisResults } from "@/components/analysis-results";
import { StocksShowcase } from "@/components/stocks-showcase";
import { EducationalSection } from "@/components/educational-section";
import { DisclaimerSection } from "@/components/disclaimer-section";
import { Footer } from "@/components/footer";
import { MarketSummary } from "@/components/market-summary";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [currentStock, setCurrentStock] = useState<any>(null);

  const { data: stocks } = useQuery({
    queryKey: ["/api/stocks"],
  });

  const handleStockAnalyzed = (analysis: any) => {
    setCurrentAnalysis(analysis);
    // Find the corresponding stock data
    const stock = stocks?.find((s: any) => s.symbol === analysis.stockSymbol);
    setCurrentStock(stock);
    
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('analysis-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleStockSelect = (symbol: string) => {
    // Trigger analysis for selected stock
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartAnalysis = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection 
        onStartAnalysis={handleStartAnalysis}
        onViewDemo={handleViewDemo}
      />
      <FeaturesSection />
      
      {/* Market Summary Section */}
      <section className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0 neural-grid opacity-20"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 gradient-text">
              Real-Time Market Data 📈
            </h2>
            <p className="text-xl lg:text-2xl text-gray-700 font-medium max-w-3xl mx-auto">
              <span className="text-purple-600 font-black">Live prices</span> from NASDAQ, NYSE, and NSE exchanges powered by 
              <span className="text-cyan-600 font-black"> Yahoo Finance API</span> ⚡
            </p>
          </div>
          <MarketSummary />
        </div>
      </section>

      <div id="demo">
        <DemoSection onStockAnalyzed={handleStockAnalyzed} />
      </div>
      
      {currentAnalysis && (
        <div id="analysis-results">
          <AnalysisResults 
            analysis={currentAnalysis} 
            stock={currentStock}
          />
        </div>
      )}
      
      <StocksShowcase onStockSelect={handleStockSelect} />
      <EducationalSection />
      <DisclaimerSection />
      <Footer />
    </div>
  );
}
