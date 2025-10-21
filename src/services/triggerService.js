// src/services/triggerService.js
// повертає масив подій (eventId та payload)
async function fetchEventsForRule(rule) {
  // для MVP: mock
  if (rule.trigger.type === 'fake_email') {
    // конфіг може мати keyword
    const keyword = rule.trigger.config?.keyword || 'invoice';
    // випадкове генерування події іноді
    if (Math.random() < 0.3) {
      const id = `evt_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      return [{ eventId: id, payload: { subject: `New ${keyword} ${id}`, body: '...' } }];
    } else {
      return [];
    }
  }
  // пізніше: реалізація gmail polling або webhooks
  return [];
}

module.exports = { fetchEventsForRule };
