// src/models/Rule.js
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    //owner of the rule
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // name of the rule
    name: { type: String, required: true },

    // short description
    description: { type: String },

    // trigger type: now supports 'time', 'event', 'webhook'
    triggerType: {
      type: String,
      enum: ['time', 'event', 'webhook'],
      default: 'time',
      required: true
    },

    // added trigger value (e.g., cron expression, event keyword, webhook URL)
    triggerValue: { type: String, default: '' },

    // action type: supports 'log', 'telegram', 'http_request'
    actionType: {
      type: String,
      enum: ['log', 'telegram', 'http_request'],
      default: 'log',
      required: true
    },

    // config for the action
    actionConfig: { type: Object, default: {} },

    // if the rule is active
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rule', ruleSchema);
