// src/services/actionService.js
async function executeActionForRule(rule, event) {
  if (rule.action.type === 'log') {
    // Просто збережемо в логах
    return { ok: true, message: `Logged event ${event.eventId} for rule ${rule._id}` };
  }
  if (rule.action.type === 'telegram') {
    // config: { chatId, botToken } - тут mock: просто повертаємо success
    return { ok: true, message: `(mock) Sent telegram to ${rule.action.config?.chatId}` };
  }
  return { ok: false, message: 'Unknown action' };
}

module.exports = { executeActionForRule };
