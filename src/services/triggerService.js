// src/services/triggerService.js
const eventBus = require('../utils/eventBus'); // ✅ NEW

// Returns a mock list of events (eventId and payload)
async function fetchEventsForRule(rule) {
  // Mock behavior for now
  if (rule.triggerType === 'event') {
    // Optional keyword from triggerValue
    const keyword = rule.triggerValue || 'invoice';

    // Randomly generate an event sometimes
    if (Math.random() < 0.3) {
      const id = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const events = [
        {
          eventId: id,
          payload: { subject: `New ${keyword} ${id}`, body: '...' },
        },
      ];

      // ✅ NEW: emit trigger event to the worker
      eventBus.emit(`trigger:${rule.triggerType}`, {
        userId: rule.user,
        ruleId: rule._id,
        events,
      });

      return events;
    } else {
      return [];
    }
  }

  // Later: implement actual polling for cron/time triggers
  return [];
}

// ✅ OPTIONAL: helper for manual trigger (e.g., from controllers)
function handleTrigger(triggerType, payload) {
  eventBus.emit(`trigger:${triggerType}`, payload);
}

module.exports = { fetchEventsForRule, handleTrigger }; // ✅ updated export
