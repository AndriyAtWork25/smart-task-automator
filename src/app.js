require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const ruleRoutes = require('./routes/rules');
const testRoutes = require('./routes/test');

const app = express();
app.use(express.json());

// ✅ 1. Статичні файли підключаємо першими
app.use(express.static(path.join(__dirname, '../public')));

// ✅ 2. API після цього
app.use('/api/auth', authRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/test', testRoutes);

// 🧠 3. Підключення до бази
if (process.env.NODE_ENV !== 'test') {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-automator';
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('[DB] Connected'))
    .catch((err) => console.error('[DB] Connection error:', err));
}

// ✅ 4. fallback — якщо жоден API не спрацював, повертаємо index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = app;
