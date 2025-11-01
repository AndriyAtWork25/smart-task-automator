require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const ruleRoutes = require('./routes/rules');
const testRoutes = require('./routes/test');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Automator API',
      version: '1.0.0',
      description: 'API documentation for Smart Automator project (rules, triggers, actions)',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());

// ✅ 1. Спочатку Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ 2. Потім API-маршрути
app.use('/api/auth', authRoutes);
app.use('/api/rules', ruleRoutes);
app.use('/api/test', testRoutes);

// ✅ 3. Після цього — фронтенд
app.use('/', express.static(path.join(__dirname, '../public')));

// ✅ 4. Fallback лише для звичайних сторінок, але не для API
app.get(/^\/(?!api|api-docs).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
