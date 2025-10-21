const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  trigger: {
    type: { type: String },      // e.g. 'fake_email' | 'gmail' (later)
    config: { type: Object }     // trigger-specific config (keywords, intervals)
  },
  action: {
    type: { type: String },      // e.g. 'telegram', 'createTask'
    config: { type: Object }     // action-specific config (chat id, template)
  },
  enabled: { type: Boolean, default: true },
  lastProcessedEventId: { type: String } // for idempotency
}, { timestamps: true });

module.exports = mongoose.model('Rule', ruleSchema);
