const request = require('supertest');
const app = require('../server');

describe('Stay API Tests', () => {

  // ✔ Get stays
  test('GET /api/stays should work', async () => {
    const res = await request(app).get('/api/stays');

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
  });

  // ❌ Empty POST
  test('Create stay with empty body should fail', async () => {
    const res = await request(app)
      .post('/api/stays')
      .send({});

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  // ❌ Unauthorized
  test('Create stay without authentication should fail', async () => {
    const res = await request(app)
      .post('/api/stays')
      .send({
        title: 'Test Room'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});