const Joi = require('joi');

const ruleSchema = Joi.object({
  user: Joi.string().optional(),
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow(''),
  triggerType: Joi.string().valid('time', 'event').required(),
  triggerValue: Joi.string().required(),
  actionType: Joi.string().valid('log', 'telegram').required(),
  actionConfig: Joi.object().default({}),
  isActive: Joi.boolean().default(true)  
});


module.exports = { ruleSchema };
