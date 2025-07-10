import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CloudUpload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StockSearch } from "./stock-search";

interface DemoSectionProps {
  onStockAnalyzed: (analysis: any) => void;
}

export function DemoSection({ onStockAnalyzed }: DemoSectionProps) {
  const [selectedStock, setSelectedStock] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const popularStocks = [
    "AAPL", "GOOGL", "MSFT", "TSLA", "TCS", "RELIANCE", "HDFCBANK", "INFY"
  ];

  const searchStockMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const response = await apiRequest("POST", `/api/stocks/${symbol}/analyze`);
      return response.json();
    },
    onSuccess: (data) => {
      onStockAnalyzed(data);
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

  const uploadChartMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('chart', file);
      
      const response = await fetch('/api/upload-chart', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onStockAnalyzed(data.analysis);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Chart Analyzed",
        description: "Your chart has been successfully analyzed.",
      });
    },
    onError: () => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload Failed",
        description: "Failed to upload and analyze chart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    searchStockMutation.mutate(symbol);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);

    uploadChartMutation.mutate(file);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <section id="demo" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Ccircle cx='50' cy='50' r='25'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-modern text-white rounded-full px-6 py-3 mb-6 font-semibold text-sm shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            Interactive Analysis Tools
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-dark mb-6 leading-tight">
            Start Your Pattern Analysis
          </h2>
          <p className="text-xl text-brand-gray leading-relaxed max-w-4xl mx-auto">
            Choose your preferred method: search from our comprehensive database of 96+ global stocks 
            or upload your own chart images for custom AI-powered pattern recognition
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Stock Search Section */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-10 hover:shadow-3xl transition-all-smooth hover:scale-105">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-modern rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="text-white text-2xl font-bold">📊</div>
              </div>
              <div className="ml-4">
                <h3 className="text-3xl font-bold text-brand-dark">Live Stock Analysis</h3>
                <p className="text-brand-gray-light font-medium">Real-time pattern recognition</p>
              </div>
            </div>
            
            <p className="text-brand-gray mb-8 text-lg leading-relaxed">
              Instant analysis of live stock charts from NASDAQ, NYSE, and NSE markets with authentic Yahoo Finance data
            </p>
            
            <div className="space-y-4">
              <StockSearch 
                onStockSelect={handleStockSelect}
                placeholder="Search stocks (e.g., AAPL, TCS, Reliance, HDFC)"
              />
              
              {selectedStock && (
                <div className="text-sm text-gray-600">
                  Selected: <strong>{selectedStock}</strong>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-brand-dark mb-4">Popular Stocks:</h4>
              <div className="flex flex-wrap gap-2">
                {popularStocks.map((stock) => (
                  <Button
                    key={stock}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStockSelect(stock)}
                    className="px-3 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white"
                  >
                    {stock}
                  </Button>
                ))}
              </div>
              
              <p className="text-sm text-brand-gray mt-4">
                <strong>Examples:</strong> Try "TCS" (Indian IT), "Reliance" (Indian Oil), "AAPL" (US Tech), 
                "HDFC" (Indian Banking), "NVDA" (US Semiconductors), or "Wipro" (Indian IT)
              </p>
            </div>
          </div>
          
          {/* Chart Upload Section */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-10 hover:shadow-3xl transition-all-smooth hover:scale-105">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-white" size={28} />
              </div>
              <div className="ml-4">
                <h3 className="text-3xl font-bold text-brand-dark">Custom Chart Analysis</h3>
                <p className="text-brand-gray-light font-medium">AI-powered image recognition</p>
              </div>
            </div>
            
            <p className="text-brand-gray mb-8 text-lg leading-relaxed">
              Upload your own trading charts for instant pattern analysis using our proprietary AI algorithms
            </p>
            
            <div 
              className="group/upload border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all-smooth cursor-pointer backdrop-blur-sm"
              onClick={handleBrowseFiles}
            >
              <div className="relative">
                <CloudUpload className="text-6xl text-blue-400 mb-6 mx-auto group-hover/upload:scale-110 transition-transform" size={64} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full opacity-0 group-hover/upload:opacity-100 transition-opacity animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-brand-dark mb-3">Drop your chart image here</p>
              <p className="text-brand-gray mb-6 text-lg">or click to browse from your device</p>
              <Button className="bg-gradient-success text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all-smooth shadow-lg text-lg">
                📁 Browse Files
              </Button>
              <p className="text-sm text-brand-gray-light mt-6 font-medium">
                Supports JPG, PNG, GIF • Maximum 10MB • Instant AI analysis
              </p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
            
            {isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-brand-dark">Uploading chart...</span>
                  <span className="text-sm text-brand-gray">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
