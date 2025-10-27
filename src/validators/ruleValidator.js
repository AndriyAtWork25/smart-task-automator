// src/validators/ruleValidator.js
const Joi = require('joi');

const ruleSchema = Joi.object({
  user: Joi.any().required(),
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow('').default(''),
  triggerType: Joi.string().valid('time', 'event').required(),
  triggerValue: Joi.string().required(),
  // робимо actionType необов’язковим, із дефолтом
  actionType: Joi.string().valid('log', 'telegram').default('log'),
  actionConfig: Joi.object().default({}),
  isActive: Joi.boolean().default(true)
});

module.exports = { ruleSchema };
