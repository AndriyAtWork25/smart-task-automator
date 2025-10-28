const express = require('express');
const router = express.Router();
const { handleTrigger } = require('../services/triggerService');

// POST /api/test/trigger
router.post('/trigger', async (req, res) => {
  try {
    const { triggerType = 'event', userId = 'demo-user' } = req.body;

    // тестовий payload
    const payload = {
      userId,
      events: [
        {
          eventId: `evt_manual_${Date.now()}`,
          payload: { subject: 'Manual test trigger', body: 'Triggered manually!' }
        }
      ]
    };

    handleTrigger(triggerType, payload);
    res.json({ message: `Trigger "${triggerType}" emitted`, payload });
  } catch (err) {
    console.error('Trigger test error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
