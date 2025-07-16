// Create this file: api/yahoo/market-summary.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

const mockMarketData = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 4783.35 + (Math.random() - 0.5) * 50,
    change: (Math.random() - 0.5) * 30,
    changePercent: (Math.random() - 0.5) * 2,
    exchange: 'SPX',
    marketState: 'REGULAR'
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    price: 37863.80 + (Math.random() - 0.5) * 300,
    change: (Math.random() - 0.5) * 200,
    changePercent: (Math.random() - 0.5) * 1.5,
    exchange: 'DJI',
    marketState: 'REGULAR'
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    price: 15310.97 + (Math.random() - 0.5) * 200,
    change: (Math.random() - 0.5) * 100,
    changePercent: (Math.random() - 0.5) * 2.5,
    exchange: 'NASDAQ',
    marketState: 'REGULAR'
  },
  {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    price: 21731.40 + (Math.random() - 0.5) * 200,
    change: (Math.random() - 0.5) * 150,
    changePercent: (Math.random() - 0.5) * 2,
    exchange: 'NSE',
    marketState: 'REGULAR'
  },
  {
    symbol: '^BSESN',
    name: 'SENSEX',
    price: 72240.26 + (Math.random() - 0.5) * 500,
    change: (Math.random() - 0.5) * 300,
    changePercent: (Math.random() - 0.5) * 1.8,
    exchange: 'BSE',
    marketState: 'REGULAR'
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Add random variations to simulate market movements
      const marketData = mockMarketData.map(market => ({
        ...market,
        price: Number((market.price + (Math.random() - 0.5) * 10).toFixed(2)),
        change: Number(((Math.random() - 0.5) * 20).toFixed(2)),
        changePercent: Number(((Math.random() - 0.5) * 2).toFixed(2))
      }));

      res.status(200).json(marketData);
    } catch (error) {
      console.error('Error in market summary API:', error);
      res.status(500).json({ 
        message: 'Failed to fetch market summary',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
