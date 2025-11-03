// src/routes/rules.js
const router = require('express').Router();
const ctrl = require('../controllers/ruleController');
const authMiddleware = require('../utils/authMiddleware');
const { handleTrigger } = require('../services/triggerService');

/**
 * @swagger
 * tags:
 *   name: Rules
 *   description: Manage automation rules (create, update, delete, trigger)
 */

/**
 * @swagger
 * /api/rules:
 *   get:
 *     summary: Get all rules for the current user
 *     tags: [Rules]
 *     responses:
 *       200:
 *         description: List of rules retrieved successfully
 *   post:
 *     summary: Create a new rule
 *     tags: [Rules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               triggerType:
 *                 type: string
 *                 enum: [time, event, webhook]
 *               triggerValue:
 *                 type: string
 *               actionType:
 *                 type: string
 *                 enum: [log, telegram, http_request]
 *               actionConfig:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Rule created successfully
 *
 * /api/rules/{id}:
 *   get:
 *     summary: Get a single rule by ID
 *     tags: [Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rule ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule details retrieved successfully
 *   put:
 *     summary: Update a rule by ID
 *     tags: [Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rule ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *   delete:
 *     summary: Delete a rule by ID
 *     tags: [Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rule ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rule deleted successfully
 *
 * /api/rules/{id}/trigger:
 *   post:
 *     summary: Trigger a specific rule manually (webhook)
 *     tags: [Rules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Rule ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Optional custom payload
 *     responses:
 *       200:
 *         description: Rule triggered successfully
 */

// use auth middleware for all routes below
if (process.env.NODE_ENV !== 'test') {
  router.use(authMiddleware);
} else {
  // Mock auth middleware for tests
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

// webhook trigger route
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
