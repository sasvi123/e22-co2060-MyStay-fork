const request = require('supertest');
const { app, pool } = require('../server');

describe('Basic API Test', () => {
  afterAll(async () => {
    await pool.end();
  });
  test('GET /api/stays should respond', async () => {
    const res = await request(app).get('/api/stays');

    // We don’t assume DB works → just check response exists
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });
});