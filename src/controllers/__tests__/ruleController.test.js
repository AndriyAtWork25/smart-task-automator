// src/controllers/__tests__/ruleController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = require('../../app');
const User = require('../../models/User');
const Rule = require('../../models/Rule');

let token;
let testUserId;

beforeAll(async () => {
  await User.deleteMany({});
  await Rule.deleteMany({});

  // створюємо користувача
  const hash = await bcrypt.hash('123456', 10);
  const user = await User.create({ email: 'user@example.com', passwordHash: hash });

  // запам’ятовуємо id для моків
  testUserId = user._id.toString();
  global.__testUserId = testUserId;

  // створюємо токен (для узгодженості з middleware)
  const secret = process.env.JWT_SECRET || 'testsecret';
  token = jwt.sign({ id: testUserId, email: user.email }, secret, { expiresIn: '7d' });
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({});
      await Rule.deleteMany({});
      await mongoose.connection.close();
    }
  } catch (err) {
    console.warn('⚠️  Cleanup skipped: Mongo already disconnected.');
  }
});


describe('RuleController Integration Tests', () => {
  it('should create a new rule', async () => {
    const res = await request(app)
      .post('/api/rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My Rule',
        triggerType: 'time',
        triggerValue: new Date().toISOString(),
        actionType: 'log'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('My Rule');
    expect(res.body.user.toString()).toBe(testUserId);
  });

  it('should retrieve all rules for the user', async () => {
    await request(app)
      .post('/api/rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rule1',
        triggerType: 'time',
        triggerValue: new Date().toISOString(),
        actionType: 'log'
      });

    const res = await request(app)
      .get('/api/rules')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user.toString()).toBe(testUserId);
  });

  it('should update a rule', async () => {
    const createRes = await request(app)
      .post('/api/rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'RuleToUpdate',
        triggerType: 'time',
        triggerValue: new Date().toISOString(),
        actionType: 'log'
      });

    const ruleId = createRes.body._id;

    const res = await request(app)
      .put(`/api/rules/${ruleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Rule',
        triggerType: 'time',
        triggerValue: new Date().toISOString(),
        actionType: 'log'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Rule');
    expect(res.body.user.toString()).toBe(testUserId);
  });

  it('should delete a rule', async () => {
    const createRes = await request(app)
      .post('/api/rules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'RuleToDelete',
        triggerType: 'time',
        triggerValue: new Date().toISOString(),
        actionType: 'log'
      });

    const ruleId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/rules/${ruleId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Rule deleted');
  });
});

