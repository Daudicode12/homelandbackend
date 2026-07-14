import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';

describe('Authentication API', () => {
  afterAll(async () => {
    // Clean up connections
    await pool.end();
  });

  const testUser = {
    name: 'Test Freelancer',
    email: `test_${Date.now()}@example.com`,
    phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: 'Password123',
    role: 'freelancer'
  };

  it('Test 1: Successful Registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name', testUser.name);
    expect(res.body.data).toHaveProperty('email', testUser.email);
    expect(res.body.data).toHaveProperty('role', testUser.role);
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('Test 2: Login with Wrong Password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Unauthorized.');
  });
});
