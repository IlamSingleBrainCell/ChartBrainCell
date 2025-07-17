import type { VercelRequest, VercelResponse } from '@vercel/node';
import yahooFinance from 'yahoo-finance2';

const marketSymbols = [
  { symbol: '^GSPC', name: 'S&P 500', exchange: 'SPX' },
  { symbol: '^DJI', name: 'Dow Jones', exchange: 'DJI' },
  { symbol: '^IXIC', name: 'NASDAQ', exchange: 'NASDAQ' },
  { symbol: '^NSEI', name: 'NIFTY 50', exchange: 'NSE' },
  { symbol: '^BSESN', name: 'SENSEX', exchange: 'BSE' }
];

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
      const marketData = await Promise.all(
        marketSymbols.map(async (market) => {
          try {
            const quote = await yahooFinance.quote(market.symbol);
            return {
              symbol: market.symbol,
              name: market.name,
              price: quote.regularMarketPrice || 0,
              change: quote.regularMarketChange || 0,
              changePercent: quote.regularMarketChangePercent || 0,
              exchange: market.exchange,
              marketState: quote.marketState || 'REGULAR'
            };
          } catch (error) {
            console.error(`Error fetching ${market.symbol}:`, error);
            return null;
          }
        })
      );

      res.status(200).json(marketData.filter(Boolean));
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
