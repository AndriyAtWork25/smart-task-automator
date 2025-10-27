// src/services/_tests_/actionService.test.js
const { executeActionForRule } = require('../actionService');

describe('actionService', () => {
  it('should execute log action', async () => {
    const rule = { action: { type: 'log', config: { message: 'Hello' } }, _id: 'rule1' };
    const result = await executeActionForRule(rule, { eventId: 'evt1' });
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/Logged event evt1/);
  });

  it('should execute telegram action (mock)', async () => {
    const rule = { action: { type: 'telegram', config: { chatId: '123', botToken: 'abc' } }, _id: 'rule2' };
    const result = await executeActionForRule(rule, { eventId: 'evt2' });
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/\(mock\) Sent telegram/);
  });

  it('should return unknown action for invalid type', async () => {
    const rule = { action: { type: 'unknown' }, _id: 'rule3' };
    const result = await executeActionForRule(rule, { eventId: 'evt3' });
    expect(result.ok).toBe(false);
    expect(result.message).toBe('Unknown action');
  });
});
