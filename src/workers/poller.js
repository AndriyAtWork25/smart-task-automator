// src/workers/poller.js
const Rule = require('../models/Rule');
const ExecutionLog = require('../models/ExecutionLog');
const { fetchEventsForRule } = require('../services/triggerService');
const { executeActionForRule } = require('../services/actionService');
const { isAlreadyProcessed, markProcessed } = require('../utils/idempotency');

async function pollOnce() {
  try {
    const rules = await Rule.find({ enabled: true }).limit(100);
    for (const rule of rules) {
      const events = await fetchEventsForRule(rule);
      for (const evt of events) {
        try {
          if (await isAlreadyProcessed(rule, evt.eventId)) {
            // пропускаємо дублікат
            continue;
          }
          const result = await executeActionForRule(rule, evt);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: result.ok ? 'success' : 'failed',
            detail: result.message,
            error: result.ok ? null : result.message
          });
          if (result.ok) await markProcessed(rule, evt.eventId);
        } catch (e) {
          console.error('action error', e);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: 'failed',
            error: e.message
          });
        }
      }
    }
  } catch (err) {
    console.error('poller error', err);
  }
}

function startPoller(intervalMs = 10000) { // кожні 10s для тесту
  console.log('Poller started, interval', intervalMs);
  pollOnce();
  setInterval(pollOnce, intervalMs);
}

module.exports = { startPoller };
