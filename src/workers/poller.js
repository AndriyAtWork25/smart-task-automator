// src/workers/poller.js
const Rule = require('../models/Rule');
const ExecutionLog = require('../models/ExecutionLog');
const { fetchEventsForRule } = require('../services/triggerService');
const { executeActionForRule } = require('../services/actionService');
const { isAlreadyProcessed, markProcessed } = require('../utils/idempotency');
const eventBus = require('../utils/eventBus'); // ✅ NEW

// ---------------- POLLING LOGIC ----------------
async function pollOnce() {
  try {
    console.log('🔄 Poller tick...');
    const rules = await Rule.find().limit(100);

    for (const rule of rules) {
      if (!rule.isActive) {
        console.log(`⚙️ Rule ${rule._id} вимкнено — пропускаємо`);
        continue;
      }

      const events = await fetchEventsForRule(rule);
      for (const evt of events) {
        try {
          if (await isAlreadyProcessed(rule, evt.eventId)) continue;

          const result = await executeActionForRule(rule, evt);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: result.ok ? 'success' : 'failed',
            detail: result.message,
            error: result.ok ? null : result.message
          });

          if (result.ok) await markProcessed(rule, evt.eventId);
        } catch (err) {
          console.error('❌ Action error:', err);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: 'failed',
            error: err.message
          });
        }
      }
    }
  } catch (err) {
    console.error('💥 Poller error:', err);
  }
}

// ---------------- REAL-TIME EVENT LISTENER ----------------
eventBus.on('trigger:event', async (data) => {
  console.log('⚡ Worker got trigger:event:', data);

  try {
    const rules = await Rule.find({ triggerType: 'event', isActive: true });

    for (const rule of rules) {
      for (const evt of data.events) {
        try {
          const result = await executeActionForRule(rule, evt);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: result.ok ? 'success' : 'failed',
            detail: result.message,
            error: result.ok ? null : result.message
          });
        } catch (err) {
          console.error('❌ Worker real-time error:', err);
          await ExecutionLog.create({
            rule: rule._id,
            eventId: evt.eventId,
            status: 'failed',
            error: err.message
          });
        }
      }
    }
  } catch (err) {
    console.error('💥 Worker event handler error:', err);
  }
});

// ---------------- START FUNCTION ----------------
function startPoller(intervalMs = 10000) {
  console.log(`🚀 Poller started (interval ${intervalMs / 1000}s)`);
  pollOnce();
  setInterval(pollOnce, intervalMs);
}

module.exports = { startPoller };
