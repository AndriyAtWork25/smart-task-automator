// src/utils/idempotency.js
async function isAlreadyProcessed(rule, eventId) {
  return rule.lastProcessedEventId === eventId;
}

async function markProcessed(rule, eventId) {
  rule.lastProcessedEventId = eventId;
  await rule.save();
}

module.exports = { isAlreadyProcessed, markProcessed };
