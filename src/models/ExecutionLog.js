// src/models/ExecutionLog.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  rule: { type: mongoose.Schema.Types.ObjectId, ref: 'Rule' },
  eventId: { type: String },
  status: { type: String, enum: ['success','failed'] },
  detail: { type: Object },
  error: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ExecutionLog', logSchema);
