require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const ruleRoutes = require('./routes/rules');

const app = express();
app.use(express.json());

// 🧠 Підключення до бази робиться лише в продакшені/локальному режимі.
// У тестах цим керує jest-mongo-setup.js.
if (process.env.NODE_ENV !== 'test') {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-automator';
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('[DB] Connected'))
    .catch((err) => console.error('[DB] Connection error:', err));
}

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => res.send('Smart Automator API running'));

module.exports = app;
