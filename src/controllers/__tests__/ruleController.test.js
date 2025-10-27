// src/controllers/__tests__/ruleController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

let app;
const User = require('../../models/User');
const Rule = require('../../models/Rule');

let mongoServer;
let userId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Створюємо тестового користувача
  const passwordHash = await bcrypt.hash('testpassword', 10);
  const user = await User.create({ email: 'test@test.com', passwordHash });
  userId = user._id;
  global.__testUserId = userId; // 🔥 додаємо глобальну змінну

  // Підключаємо додаток
  app = require('../../app');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('RuleController Integration Tests', () => {
  it('should create a new rule', async () => {
    const res = await request(app)
      .post('/api/rules')
      .send({
        name: 'TestRule',
        triggerType: 'time',
        triggerValue: '* * * * *',
        actionType: 'log',
        isActive: true,
        actionConfig: { message: 'Hello world' }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('TestRule');
    expect(res.body.user).toBe(userId.toString());
  });

  it('should retrieve all rules for the user', async () => {
    await Rule.create({
      name: 'Rule2',
      triggerType: 'time',
      triggerValue: '* * * * *',
      actionType: 'log',
      isActive: true,
      user: userId,
      actionConfig: { message: 'Test message' },
    });

    const res = await request(app).get('/api/rules');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should retrieve a single rule by id', async () => {
    const rule = await Rule.create({
      name: 'Rule3',
      triggerType: 'time',
      triggerValue: '* * * * *',
      actionType: 'log',
      isActive: true,
      user: userId,
      actionConfig: { message: 'Test message' },
    });

    const res = await request(app).get(`/api/rules/${rule._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Rule3');
  });

  it('should update a rule', async () => {
    const rule = await Rule.create({
      name: 'Rule4',
      triggerType: 'time',
      triggerValue: '* * * * *',
      actionType: 'log',
      isActive: true,
      user: userId,
      actionConfig: { message: 'Old message' },
    });

    const res = await request(app)
      .put(`/api/rules/${rule._id}`)
      .send({
        name: 'UpdatedRule4',
        triggerType: 'time',
        triggerValue: '* * * * *',
        actionType: 'log',
        isActive: false,
        actionConfig: { message: 'Updated message' }
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('UpdatedRule4');
    expect(res.body.isActive).toBe(false);
  });

  it('should delete a rule', async () => {
    const rule = await Rule.create({
      name: 'RuleToDelete',
      triggerType: 'time',
      triggerValue: '* * * * *',
      actionType: 'log',
      isActive: true,
      user: userId,
      actionConfig: { message: 'To delete' },
    });

    const res = await request(app).delete(`/api/rules/${rule._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Rule deleted');
  });
});
