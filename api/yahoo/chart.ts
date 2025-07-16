import { VercelRequest, VercelResponse } from '@vercel/node';
import { yahooFinanceService } from '../../server/yahoo-finance';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ message: 'Symbol is required' });
    }

    const chartData = await yahooFinanceService.getHistoricalData(symbol, '3mo');

    if (!chartData || chartData.length === 0) {
      return res.status(404).json({ message: `No chart data found for symbol ${symbol}` });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
}
