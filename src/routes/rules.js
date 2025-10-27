const router = require('express').Router();
const ctrl = require('../controllers/ruleController');
const authMiddleware = require('../utils/authMiddleware');

// застосовуємо middleware лише якщо НЕ тест
if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleware);
}

router.post('/', ctrl.createRule);
router.get('/', ctrl.getRules);
router.get('/:id', ctrl.getRule);
router.put('/:id', ctrl.updateRule);
router.delete('/:id', ctrl.deleteRule);

module.exports = router;
