import { useEffect, useRef, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface StockPrice {
  symbol: string;
  currentPrice: number;
  changePercent: number;
  lastUpdated: string;
}

interface WebSocketMessage {
  type: 'STOCK_PRICES' | 'PRICE_UPDATE';
  data: StockPrice[];
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [stockPrices, setStockPrices] = useState<Map<string, StockPrice>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Check if we're on Vercel or production environment
  const isProduction = typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('netlify.app') ||
    process.env.NODE_ENV === 'production'
  );

  // Polling fallback for production/Vercel
  const startPolling = useCallback(() => {
    const fetchStockPrices = async () => {
      try {
        const response = await fetch('/api/stocks');
        if (response.ok) {
          const stocks = await response.json();
          
          // Convert to the same format as WebSocket message
          setStockPrices(prevPrices => {
            const newPrices = new Map(prevPrices);
            stocks.forEach((stock: any) => {
              newPrices.set(stock.symbol, {
                symbol: stock.symbol,
                currentPrice: stock.currentPrice || 0,
                changePercent: stock.changePercent || 0,
                lastUpdated: stock.lastUpdated || new Date().toISOString()
              });
            });
            return newPrices;
          });
          
          setIsConnected(true);
        } else {
          console.warn('Failed to fetch stock prices:', response.status);
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error fetching stock prices:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchStockPrices();

    // Poll every 30 seconds
    pollingIntervalRef.current = setInterval(fetchStockPrices, 30000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // WebSocket connection for development
  const connect = useCallback(() => {
    if (isProduction) {
      console.log('WebSocket disabled in production - using polling instead');
      startPolling();
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'STOCK_PRICES' || message.type === 'PRICE_UPDATE') {
            setStockPrices(prevPrices => {
              const newPrices = new Map(prevPrices);
              message.data.forEach(stock => {
                newPrices.set(stock.symbol, stock);
              });
              return newPrices;
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        
        // Only attempt to reconnect in development
        if (!isProduction) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connect();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        
        // Fallback to polling if WebSocket fails
        if (!isProduction) {
          console.log('WebSocket failed, falling back to polling...');
          startPolling();
        }
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
      
      // Fallback to polling
      console.log('WebSocket connection failed, using polling fallback...');
      startPolling();
    }
  }, [isProduction, startPolling]);

  const disconnect = useCallback(() => {
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Stop polling
    stopPolling();
    
    setIsConnected(false);
  }, [stopPolling]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const getStockPrice = useCallback((symbol: string): StockPrice | undefined => {
    return stockPrices.get(symbol);
  }, [stockPrices]);

  const getAllStockPrices = useCallback((): StockPrice[] => {
    return Array.from(stockPrices.values());
  }, [stockPrices]);

  return {
    isConnected,
    stockPrices: getAllStockPrices(),
    getStockPrice,
    connect,
    disconnect,
    // Add info about connection type for debugging
    connectionType: isProduction ? 'polling' : 'websocket'
  };
}
