const router = require('express').Router();
const ctrl = require('../controllers/ruleController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware); // всі маршрути захищені

router.post('/', ctrl.createRule);
router.get('/', ctrl.getRules);
router.get('/:id', ctrl.getRule);
router.put('/:id', ctrl.updateRule);
router.delete('/:id', ctrl.deleteRule);

module.exports = router;
