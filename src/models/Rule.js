// src/models/Rule.js
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    // до кого належить правило
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // назва правила
    name: { type: String, required: true },

    // короткий опис
    description: { type: String },

    // 🔹 тип тригера: тепер підтримує 'time', 'event', 'webhook'
    triggerType: {
      type: String,
      enum: ['time', 'event', 'webhook'],
      default: 'time',
      required: true
    },

    // додаткове значення для тригера (наприклад, інтервал або ключове слово)
    triggerValue: { type: String, default: '' },

    // 🔹 тип дії: тепер підтримує 'log', 'telegram', 'http_request'
    actionType: {
      type: String,
      enum: ['log', 'telegram', 'http_request'],
      default: 'log',
      required: true
    },

    // конфіг об’єкта для конкретної дії (наприклад, { url, method })
    actionConfig: { type: Object, default: {} },

    // чи активне правило
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rule', ruleSchema);
