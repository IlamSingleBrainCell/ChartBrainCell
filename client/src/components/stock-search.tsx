import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Stock {
  id: number;
  symbol: string;
  name: string;
  market: string;
  currentPrice: number;
  changePercent: number;
}

interface StockSearchProps {
  onStockSelect: (symbol: string) => void;
  placeholder?: string;
}

export function StockSearch({ onStockSelect, placeholder = "Search stocks..." }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get all stocks for typeahead
  const { data: allStocks = [] } = useQuery<Stock[]>({
    queryKey: ['/api/stocks'],
  });

  // Filter stocks based on query
  const filteredStocks = query.length >= 1 
    ? allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10) // Limit to 10 results
    : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredStocks.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredStocks.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredStocks.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredStocks[selectedIndex]) {
          handleStockSelect(filteredStocks[selectedIndex]);
        } else if (filteredStocks.length > 0) {
          handleStockSelect(filteredStocks[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onStockSelect(stock.symbol);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 1);
    setSelectedIndex(-1);
  };

  const formatPrice = (price: number, market: string) => {
    const symbol = market === 'Indian' ? '₹' : '$';
    return `${symbol}${price.toFixed(2)}`;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
        />
      </div>

      {isOpen && filteredStocks.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredStocks.map((stock, index) => (
            <div
              key={stock.symbol}
              onClick={() => handleStockSelect(stock)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {stock.symbol}
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      {stock.market === 'Indian' ? 'NSE/BSE' : 'NYSE/NASDAQ'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate max-w-xs">
                    {stock.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatPrice(stock.currentPrice, stock.market)}
                  </div>
                  <div className={`text-sm flex items-center ${
                    stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.changePercent >= 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 1 && filteredStocks.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 text-gray-500 text-center">
            No stocks found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}