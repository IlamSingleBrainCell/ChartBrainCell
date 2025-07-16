// Create this file: api/stocks.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock stock data - replace with your actual data source later
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 192.53 + (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
    lastUpdated: new Date().toISOString(),
    market: 'US'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 175.89 + (Math.random() - 0.5) * 10,
    changePercent: (Math.random() - 0.5) * 5,
    lastUpdated: new Date().toISOString(),
    market: 'US'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 428.67 + (Math.random() - 0.5) * 20,
    changePercent: (Math.random() - 0.5) * 5,
    lastUpdated: new Date().toISOString(),
    market: 'US'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 436.58 + (Math.random() - 0.5) * 30,
    changePercent: (Math.random() - 0.5) * 8,
    lastUpdated: new Date().toISOString(),
    market: 'US'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    currentPrice: 598.44 + (Math.random() - 0.5) * 25,
    changePercent: (Math.random() - 0.5) * 6,
    lastUpdated: new Date().toISOString(),
    market: 'US'
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    currentPrice: 2756.85 + (Math.random() - 0.5) * 100,
    changePercent: (Math.random() - 0.5) * 4,
    lastUpdated: new Date().toISOString(),
    market: 'Indian'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Limited',
    currentPrice: 4127.30 + (Math.random() - 0.5) * 150,
    changePercent: (Math.random() - 0.5) * 3,
    lastUpdated: new Date().toISOString(),
    market: 'Indian'
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Add small random variations to simulate real-time price changes
      const stocks = mockStocks.map(stock => ({
        ...stock,
        currentPrice: Number((stock.currentPrice + (Math.random() - 0.5) * 2).toFixed(2)),
        changePercent: Number(((Math.random() - 0.5) * 4).toFixed(2)),
        lastUpdated: new Date().toISOString()
      }));

      res.status(200).json(stocks);
    } catch (error) {
      console.error('Error in stocks API:', error);
      res.status(500).json({ 
        message: 'Failed to fetch stocks',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
