import yahooFinance from 'yahoo-finance2';

export interface YahooQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap: number;
  trailingPE: number;
  priceToBook: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  shortName: string;
  longName: string;
  currency: string;
  exchange: string;
}

export interface YahooHistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class YahooFinanceService {
  async getQuote(symbol: string): Promise<YahooQuote | null> {
    try {
      const quote = await yahooFinance.quote(symbol);
      
      if (!quote || !quote.regularMarketPrice) {
        return null;
      }

      return {
        symbol: quote.symbol || symbol,
        regularMarketPrice: quote.regularMarketPrice || 0,
        regularMarketChange: quote.regularMarketChange || 0,
        regularMarketChangePercent: quote.regularMarketChangePercent || 0,
        regularMarketDayHigh: quote.regularMarketDayHigh || 0,
        regularMarketDayLow: quote.regularMarketDayLow || 0,
        regularMarketVolume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        trailingPE: quote.trailingPE || 0,
        priceToBook: quote.priceToBook || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
        shortName: quote.shortName || symbol,
        longName: quote.longName || quote.shortName || symbol,
        currency: quote.currency || 'USD',
        exchange: quote.exchange || 'NASDAQ'
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<Record<string, YahooQuote>> {
    const quotes: Record<string, YahooQuote> = {};
    
    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => this.getQuote(symbol));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            quotes[batch[index]] = result.value;
          }
        });
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error fetching batch quotes:', error);
      }
    }
    
    return quotes;
  }

  async getHistoricalData(symbol: string, period: '3mo' | '1y' | '5y' | '10y' = '3mo'): Promise<YahooHistoricalData[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '3mo':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        case '5y':
          startDate.setFullYear(endDate.getFullYear() - 5);
          break;
        case '10y':
          startDate.setFullYear(endDate.getFullYear() - 10);
          break;
      }

      const result = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: '1d'
      });

      return result.map(item => ({
        date: item.date,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        close: item.close || 0,
        volume: item.volume || 0
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  async searchSymbols(query: string): Promise<Array<{symbol: string, name: string, exchange: string}>> {
    try {
      const results = await yahooFinance.search(query);
      
      return results.quotes?.slice(0, 10).map(quote => ({
        symbol: quote.symbol || '',
        name: quote.shortname || quote.longname || '',
        exchange: quote.exchange || ''
      })) || [];
    } catch (error) {
      console.error(`Error searching symbols for ${query}:`, error);
      return [];
    }
  }

  async getNews(symbol: string): Promise<Array<{
    title: string;
    summary: string;
    link: string;
    providerPublishTime: Date;
    publisher: string;
  }>> {
    try {
      const result = await yahooFinance.quoteSummary(symbol, {
        modules: ['recommendationTrend', 'financialData']
      });

      // Yahoo Finance doesn't provide news in quote summary, so we'll return empty array
      // In a real implementation, you might use a separate news API
      return [];
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }
}

export const yahooFinanceService = new YahooFinanceService();