// src/services/triggerService.js
// Returns a mock list of events (eventId and payload)
async function fetchEventsForRule(rule) {
  // Mock behavior for now
  if (rule.triggerType === 'event') {
    // Optional keyword from triggerValue
    const keyword = rule.triggerValue || 'invoice';

    // Randomly generate an event sometimes
    if (Math.random() < 0.3) {
      const id = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      return [
        {
          eventId: id,
          payload: { subject: `New ${keyword} ${id}`, body: '...' },
        },
      ];
    } else {
      return [];
    }
  }

  // Later: implement actual polling for cron/time triggers
  return [];
}

module.exports = { fetchEventsForRule };
