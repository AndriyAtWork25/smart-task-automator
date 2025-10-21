// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const ruleRoutes = require('./routes/rules');

const app = express();
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/rules', ruleRoutes);

app.get('/', (req, res) => res.send('Smart Automator API running'));

module.exports = app;
