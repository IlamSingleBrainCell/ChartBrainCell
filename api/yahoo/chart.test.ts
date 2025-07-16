import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import listen from 'test-listen';
import handler from './chart';
import fetch from 'node-fetch';

describe('GET /api/yahoo/chart/:symbol', () => {
  it('should return 400 if symbol is not provided', async () => {
    const server = createServer((req, res) => {
      return apiResolver(req, res, { symbol: '' }, handler, {} as any, false);
    });
    const url = await listen(server);
    const response = await fetch(url);
    expect(response.status).toBe(400);
    server.close();
  });

  it('should return 404 if symbol is not found', async () => {
    const server = createServer((req, res) => {
      return apiResolver(req, res, { symbol: 'INVALID' }, handler, {} as any, false);
    });
    const url = await listen(server);
    const response = await fetch(url);
    expect(response.status).toBe(404);
    server.close();
  });

  it('should return 200 and chart data for a valid symbol', async () => {
    const server = createServer((req, res) => {
      return apiResolver(req, res, { symbol: 'TSLA' }, handler, {} as any, false);
    });
    const url = await listen(server);
    const response = await fetch(url);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    server.close();
  });
});
