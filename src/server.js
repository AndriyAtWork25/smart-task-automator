// src/server.js
const app = require('./app');
const mongoose = require('mongoose');
const { startPoller } = require('./workers/poller');

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Mongo connected');
    app.listen(PORT, () => {
      console.log('🚀 Server running:');
      console.log(`   🌐 Frontend: http://localhost:${PORT}`);
      console.log(`   📘 Swagger:  http://localhost:${PORT}/api-docs`);
      console.log('------------------------------------------');
    });
  })
  .catch((err) => {
    console.error('❌ Mongo connection error', err);
    process.exit(1);
  });

// 🧠 Worker (poller) кожні 60 секунд
startPoller(60000);
