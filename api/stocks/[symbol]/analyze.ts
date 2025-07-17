import type { VercelRequest, VercelResponse } from '@vercel/node';
import yahooFinance from 'yahoo-finance2';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const symbol = req.query.symbol as string;
      
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
      }

      // Fetch current quote
      const quote = await yahooFinance.quote(symbol);
      
      // Fetch historical data for analysis
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      
      const historical = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      });

      // Your existing pattern analysis logic here
      const analysis = {
        symbol: quote.symbol,
        name: quote.displayName || quote.shortName,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap,
        pe: quote.trailingPE,
        historicalData: historical,
        // Add your pattern analysis results
        pattern: 'Ascending Triangle', // Replace with actual pattern detection
        confidence: 85, // Replace with actual confidence calculation
        recommendation: 'BUY' // Replace with actual recommendation logic
      };

      res.status(200).json(analysis);
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stock data',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

