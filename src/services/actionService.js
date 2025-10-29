// src/services/actionService.js
async function executeActionForRule(rule, event) {
  try {
    if (rule.actionType === 'log') {
      // Просто збережемо в логах
      return {
        ok: true,
        message: `Logged event ${event.eventId} for rule ${rule._id}`
      };
    }

    if (rule.actionType === 'telegram') {
      // config: { chatId, botToken } - поки що mock
      const chatId = rule.actionConfig?.chatId || 'unknown_chat';
      return {
        ok: true,
        message: `(mock) Sent telegram to ${chatId}`
      };
    }

    return { ok: false, message: `Unknown action type: ${rule.actionType}` };
  } catch (err) {
    console.error('❌ Action execution failed:', err);
    return { ok: false, message: err.message };
  }
}

module.exports = { executeActionForRule };
