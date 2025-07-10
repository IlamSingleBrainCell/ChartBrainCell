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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real-Time Market Data
            </h2>
            <p className="text-lg text-gray-600">
              Live prices from NASDAQ, NYSE, and NSE exchanges powered by Yahoo Finance
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
