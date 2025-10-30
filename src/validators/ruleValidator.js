// src/validators/ruleValidator.js
const Joi = require('joi');

const ruleSchema = Joi.object({
  // користувач — обов’язковий (прив’язує правило до власника)
  user: Joi.any().required(),

  // ім’я правила
  name: Joi.string().min(3).max(50).required(),

  // опис необов’язковий
  description: Joi.string().allow('').default(''),

  // 🔹 triggerType тепер підтримує 'time', 'event' і 'webhook'
  triggerType: Joi.string().valid('time', 'event', 'webhook').required(),

  // triggerValue можна залишити пустим (не завжди потрібен)
  triggerValue: Joi.string().allow('').default(''),

  // 🔹 actionType тепер має 3 можливості: 'log', 'telegram', 'http_request'
  actionType: Joi.string()
    .valid('log', 'telegram', 'http_request')
    .default('log'),

  // config для конкретної дії — може бути будь-яким об’єктом
  actionConfig: Joi.object().default({}),

  // статус правила
  isActive: Joi.boolean().default(true)
});

module.exports = { ruleSchema };
