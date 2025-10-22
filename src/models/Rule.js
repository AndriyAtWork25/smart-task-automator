const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  triggerType: { type: String, enum: ['time', 'event'], default: 'time' },
  triggerValue: { type: String }, // наприклад cron або подія
  actionType: { type: String, enum: ['log', 'telegram'], default: 'log' },
  actionConfig: { type: Object }, // тут налаштування action
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
