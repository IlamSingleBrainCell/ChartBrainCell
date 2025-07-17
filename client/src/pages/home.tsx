import { useState, useEffect } from "react";
import { useRoute } from "wouter";
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [currentStock, setCurrentStock] = useState<any>(null);
  const [match, params] = useRoute("/stock/:symbol");
  const { toast } = useToast();

  const { data: stocks } = useQuery({
    queryKey: ["/api/stocks"],
  });

  const searchStockMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const response = await apiRequest("POST", `/api/stocks/${symbol}/analyze`);
      return response.json();
    },
    onSuccess: (data) => {
      handleStockAnalyzed(data);
      toast({
        title: "Analysis Complete",
        description: `Analysis for ${data.stockSymbol} has been completed.`,
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the stock. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (match && params?.symbol) {
      searchStockMutation.mutate(params.symbol);
    }
  }, [match, params?.symbol]);

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
    searchStockMutation.mutate(symbol);
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
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23818cf8' fill-opacity='0.1'%3E%3Cpath d='M20 20h40v40H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-modern text-white rounded-full px-6 py-3 mb-6 font-semibold text-sm shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              Live Market Data
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 leading-tight">
              Real-Time Global Markets
            </h2>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto leading-relaxed">
              Track live prices from NASDAQ, NYSE, and NSE exchanges with authentic Yahoo Finance data 
              updated every 30 seconds during market hours
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
            <MarketSummary />
          </div>
          
          {/* Trust indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Real-Time</div>
              <div className="text-sm text-brand-gray">Data Updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Yahoo Finance</div>
              <div className="text-sm text-brand-gray">Powered API</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Live Data</div>
              <div className="text-sm text-brand-gray">Real-Time Prices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Multi-Exchange</div>
              <div className="text-sm text-brand-gray">NASDAQ, NYSE, NSE</div>
            </div>
          </div>
        </div>
      </section>

      <div id="demo">
        <DemoSection onStockAnalyzed={handleStockAnalyzed} searchStockMutation={searchStockMutation} />
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
