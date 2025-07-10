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
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-4">Try Our Analysis Tools</h2>
          <p className="text-xl text-brand-gray">
            Search for stocks or upload your own charts for instant pattern analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Stock Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded mr-3"></div>
              <h3 className="text-2xl font-semibold text-brand-dark">Get Live Stock Chart</h3>
            </div>
            
            <p className="text-brand-gray mb-6">Search from 65+ stocks from NSE, NYSE, and BSE markets</p>
            
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Upload className="text-green-600 mr-3" size={24} />
              <h3 className="text-2xl font-semibold text-brand-dark">Upload Chart Image</h3>
            </div>
            
            <p className="text-brand-gray mb-6">Upload your own chart images for custom AI analysis</p>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-600 transition-colors cursor-pointer"
              onClick={handleBrowseFiles}
            >
              <CloudUpload className="text-4xl text-brand-gray mb-4 mx-auto" size={48} />
              <p className="text-lg font-medium text-brand-dark mb-2">Drop your chart image here</p>
              <p className="text-brand-gray mb-4">or click to browse</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Browse Files
              </Button>
              <p className="text-sm text-brand-gray mt-4">Supports JPG, PNG, GIF up to 10MB</p>
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
