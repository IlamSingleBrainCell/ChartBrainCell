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
  const { toast } = useToast();

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
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
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connect();
        }, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

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
    disconnect
  };
}