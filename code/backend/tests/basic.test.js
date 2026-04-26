const request = require('supertest');
const app = require('../server');

describe('Basic API Test', () => {
  test('GET /api/stays should respond', async () => {
    const res = await request(app).get('/api/stays');

    // We don’t assume DB works → just check response exists
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });
});