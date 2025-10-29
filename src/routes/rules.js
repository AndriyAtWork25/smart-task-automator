// src/routes/rules.js
const router = require('express').Router();
const ctrl = require('../controllers/ruleController');
const authMiddleware = require('../utils/authMiddleware');
const { handleTrigger } = require('../services/triggerService');

// 🧩 Використовуємо справжнє middleware лише поза тестами
if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleware);
} else {
  // 🧪 У тестах підставляємо користувача, якого створює тест
  router.use((req, res, next) => {
    if (global.__testUserId) {
      req.user = { _id: global.__testUserId, email: 'user@example.com' };
    } else {
      req.user = { _id: '000000000000000000000001', email: 'test@example.com' };
    }
    next();
  });
}

router.post('/', ctrl.createRule);
router.get('/', ctrl.getRules);
router.get('/:id', ctrl.getRule);
router.put('/:id', ctrl.updateRule);
router.delete('/:id', ctrl.deleteRule);

// 🔹 Webhook для зовнішнього запуску правила
router.post('/:id/trigger', async (req, res) => {
  try {
    const ruleId = req.params.id;
    const payload = {
      userId: req.user._id,
      ruleId,
      events: [
        {
          eventId: `wh_${Date.now()}`,
          payload: req.body || {},
        },
      ],
    };

    handleTrigger('webhook', payload);
    res.json({ message: `Webhook trigger sent for rule ${ruleId}` });
  } catch (err) {
    console.error('Webhook trigger error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
