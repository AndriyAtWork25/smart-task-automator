const router = require('express').Router();
const ctrl = require('../controllers/ruleController');
const auth = require('../utils/authMiddleware');

router.use(auth);
router.post('/', ctrl.createRule);
router.get('/', ctrl.listRules);
router.put('/:id', ctrl.updateRule);
router.delete('/:id', ctrl.deleteRule);

module.exports = router;
