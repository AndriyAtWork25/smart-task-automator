// src/actions/actionExecutor.js

const axios = require('axios');

exports.executeAction = async (rule) => {
  try {
    switch (rule.actionType) {
      case 'log':
        console.log(`[Rule:${rule.name}] LOG ACTION =>`, rule.actionConfig?.message || 'No message provided');
        break;

      case 'telegram':
        if (!rule.actionConfig?.botToken || !rule.actionConfig?.chatId || !rule.actionConfig?.message) {
          console.error(`[Rule:${rule.name}] Missing Telegram config`);
          return;
        }

        await axios.post(`https://api.telegram.org/bot${rule.actionConfig.botToken}/sendMessage`, {
          chat_id: rule.actionConfig.chatId,
          text: rule.actionConfig.message,
        });
        console.log(`[Rule:${rule.name}] Sent message to Telegram`);
        break;

      default:
        console.warn(`[Rule:${rule.name}] Unknown action type: ${rule.actionType}`);
    }
  } catch (err) {
    console.error(`[Rule:${rule.name}] Action execution failed:`, err.message);
  }
};
