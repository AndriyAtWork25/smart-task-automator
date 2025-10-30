// src/services/actionService.js
async function executeActionForRule(rule, event) {
  try {
    // 🔹 1. Логування (існуюче)
    if (rule.actionType === 'log') {
      return {
        ok: true,
        message: `Logged event ${event.eventId} for rule ${rule._id}`
      };
    }

    // 🔹 2. Телеграм (mock)
    if (rule.actionType === 'telegram') {
      const chatId = rule.actionConfig?.chatId || 'unknown_chat';
      return {
        ok: true,
        message: `(mock) Sent telegram to ${chatId}`
      };
    }

    // 🔹 3. HTTP-запит (реальна дія)
    if (rule.actionType === 'http_request') {
      const url = rule.actionConfig?.url;
      const method = rule.actionConfig?.method || 'GET';
      const body = rule.actionConfig?.body || {};

      if (!url) {
        return { ok: false, message: 'Missing URL in actionConfig' };
      }

      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (method.toUpperCase() === 'POST') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const text = await response.text();

      return {
        ok: response.ok,
        message: `HTTP ${method} to ${url} → ${response.status} ${response.statusText}`,
        detail: text.slice(0, 300) // максимум 300 символів, щоб не засмічувати логи
      };
    }

    // Якщо тип не відомий
    return { ok: false, message: `Unknown action type: ${rule.actionType}` };

  } catch (err) {
    console.error('❌ Action execution failed:', err);
    return { ok: false, message: err.message };
  }
}

module.exports = { executeActionForRule };
