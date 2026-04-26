const request = require('supertest');
const app = require('../server');

describe('Security Tests', () => {

  // ❌ SQL Injection
  test('SQL Injection attempt should fail', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "' OR 1=1 --",
        password: "123"
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  // ❌ XSS Attack
  test('XSS input should not be accepted', async () => {
    const res = await request(app)
      .post('/api/stays')
      .send({
        title: "<script>alert('xss')</script>"
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

});