// src/validators/ruleValidator.js
const Joi = require('joi');

const ruleSchema = Joi.object({
  // user should be provided
  user: Joi.any().required(),

  // rule name
  name: Joi.string().min(3).max(50).required(),

  // short description
  description: Joi.string().allow('').default(''),

  //  triggerType now has 3 options: 'time', 'event', 'webhook'
  triggerType: Joi.string().valid('time', 'event', 'webhook').required(),

  // triggerValue can be cron expression, event keyword, or webhook URL
  triggerValue: Joi.string().allow('').default(''),

  // actionType with 3 options: 'log', 'telegram', 'http_request'
  actionType: Joi.string()
    .valid('log', 'telegram', 'http_request')
    .default('log'),

  // config for the action
  actionConfig: Joi.object().default({}),

  // rule active status
  isActive: Joi.boolean().default(true)
});

module.exports = { ruleSchema };
