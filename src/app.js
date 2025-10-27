// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const ruleRoutes = require('./routes/rules');

const app = express();
app.use(express.json());

// ⚙️ Тестовий middleware для підстави користувача
// ВАЖЛИВО: він стоїть ПЕРЕД підключенням routes
if (process.env.NODE_ENV === 'test') {
  const { Types } = require('mongoose');
  app.use((req, res, next) => {
    if (!req.user) req.user = { _id: global.__testUserId || new Types.ObjectId() };
    next();
  });
}

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => res.send('Smart Automator API running'));

module.exports = app;
