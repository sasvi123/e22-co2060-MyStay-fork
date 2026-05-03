const request = require('supertest');
const { app, pool } = require('../server');

describe('Authentication Tests', () => {

  afterAll(async () => {
    await pool.end(); // close DB connection
  });

  // ❌ Invalid login
  test('Login with wrong credentials should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@gmail.com',
        password: 'wrong'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  // ❌ Empty input
  test('Login with empty fields should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: ''
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  // ❌ Missing password
  test('Login with missing password should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@gmail.com'
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});