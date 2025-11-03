// src/services/triggerService.js
const eventBus = require('../utils/eventBus');

// ---------------- FETCH EVENTS ----------------
async function fetchEventsForRule(rule) {
  const now = new Date();

  // ---- Type 1: event-based ----
  if (rule.triggerType === 'event') {
    const keyword = rule.triggerValue || 'invoice';
    if (Math.random() < 0.3) {
      const id = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const events = [{ eventId: id, payload: { subject: `New ${keyword}`, body: '...' } }];
      eventBus.emit(`trigger:event`, { userId: rule.user, ruleId: rule._id, events });
      return events;
    }
    return [];
  }

  // ---- Type 2: cron/time ----
  if (rule.triggerType === 'time') {
    const intervalSec = parseInt(rule.triggerValue || '60', 10);
    if (!rule._lastExecution || now - rule._lastExecution > intervalSec * 1000) {
      const id = `time_${Date.now()}`;
      const events = [{ eventId: id, payload: { time: now.toISOString() } }];
      eventBus.emit(`trigger:time`, { userId: rule.user, ruleId: rule._id, events });
      rule._lastExecution = now; 
      return events;
    }
    return [];
  }

  // ---- Type 3: webhook ----
  

  return [];
}

// ---------------- MANUAL TRIGGER ----------------
function handleTrigger(triggerType, payload) {
  eventBus.emit(`trigger:${triggerType}`, payload);
}

module.exports = { fetchEventsForRule, handleTrigger };
