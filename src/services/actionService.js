// src/services/actionService.js
async function executeActionForRule(rule, event) {
  try {
    // 🔹 1. LOG
    if (rule.actionType === 'log') {
      return {
        ok: true,
        message: `Logged event ${event.eventId} for rule ${rule._id}`
      };
    }

    // 🔹 2. TELEGRAM (REAL)
    if (rule.actionType === 'telegram') {
      const token = process.env.TELEGRAM_BOT_TOKEN; // from .env
      const chatId = rule.actionConfig?.chatId;
      const text =
        rule.actionConfig?.message ||
        `🔔 Triggered rule: ${rule.name}`;

      if (!token) {
        return { ok: false, message: 'Missing TELEGRAM_BOT_TOKEN in .env' };
      }
      if (!chatId) {
        return { ok: false, message: 'Missing chatId in actionConfig' };
      }

      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        const errMsg = data?.description || 'Telegram API error';
        throw new Error(errMsg);
      }

      return { ok: true, message: `✅ Sent Telegram message to chat ${chatId}` };
    }

    // 🔹 3. HTTP REQUEST (REAL)
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
        detail: text.slice(0, 300)
      };
    }

    // 🔹 Unknown action
    return { ok: false, message: `Unknown action type: ${rule.actionType}` };
  } catch (err) {
    console.error('❌ Action execution failed:', err);
    return { ok: false, message: err.message };
  }
}

module.exports = { executeActionForRule };
