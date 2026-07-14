import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';

describe('Jobs API', () => {
  let freelancerToken = '';

  beforeAll(async () => {
    // Register and login a freelancer
    const testUser = {
      name: 'Freelancer Job Test',
      email: `freelancer_${Date.now()}@example.com`,
      phone: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'Password123',
      role: 'freelancer'
    };

    await request(app).post('/api/auth/register').send(testUser);
    
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });
    
    freelancerToken = loginRes.body.data?.accessToken;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Test 3: Freelancer Cannot Create Job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${freelancerToken}`)
      .send({
        title: 'New Website Needed',
        description: 'Need a complete new website built with Node and React.',
        category: 'Web Development',
        location: 'Remote',
        budget: 50000,
        deadline: '2030-12-31T00:00:00.000Z'
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Access denied.');
  });
});
