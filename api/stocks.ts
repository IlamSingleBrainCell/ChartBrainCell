import type { VercelRequest, VercelResponse } from '@vercel/node';
import yahooFinance from 'yahoo-finance2';

const stockSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'US' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'US' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', market: 'US' },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'US' },
  { symbol: 'META', name: 'Meta Platforms Inc.', market: 'US' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', market: 'Indian' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Limited', market: 'Indian' }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const stocks = await Promise.all(
        stockSymbols.map(async (stock) => {
          try {
            const quote = await yahooFinance.quote(stock.symbol);
            return {
              symbol: stock.symbol,
              name: stock.name,
              currentPrice: quote.regularMarketPrice || 0,
              changePercent: quote.regularMarketChangePercent || 0,
              lastUpdated: new Date().toISOString(),
              market: stock.market
            };
          } catch (error) {
            console.error(`Error fetching ${stock.symbol}:`, error);
            return null;
          }
        })
      );

      res.status(200).json(stocks.filter(Boolean));
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
