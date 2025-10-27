const Rule = require('../models/Rule');
const { ruleSchema } = require('../validators/ruleValidator');

exports.createRule = async (req, res) => {
  try {
    const body = { ...req.body };

    // Підтримка старого формату
    if (body.trigger && typeof body.trigger === 'object') {
      body.triggerType = body.trigger.type || 'event';
      body.triggerValue = body.trigger.config?.keyword || 'default';
      delete body.trigger;
    }
    if (body.action && typeof body.action === 'object') {
      body.actionType = body.action.type || 'log';
      body.actionConfig = body.action.config || {};
      delete body.action;
    }

    // Підставляємо користувача
    body.user = req.user._id.toString();

   // Валідація
const { error } = ruleSchema.validate(body);
if (error) {
  const message = error.details?.[0]?.message || 'Validation failed';
  console.log('❌ Validation error:', message, body);
  return res.status(400).json({ message });
}


    const rule = await Rule.create(body);
    res.status(201).json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRules = async (req, res) => {
  try {
    const rules = await Rule.find({ user: req.user._id });
    res.json(rules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRule = async (req, res) => {
  try {
    const rule = await Rule.findOne({ _id: req.params.id, user: req.user._id });
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRule = async (req, res) => {
  try {
    const body = { ...req.body };

    // Підтримка старого формату
    if (body.trigger && typeof body.trigger === 'object') {
      body.triggerType = body.trigger.type || 'event';
      body.triggerValue = body.trigger.config?.keyword || 'default';
      delete body.trigger;
    }
    if (body.action && typeof body.action === 'object') {
      body.actionType = body.action.type || 'log';
      body.actionConfig = body.action.config || {};
      delete body.action;
    }

    // Не передаємо user у findOneAndUpdate, він лиш для перевірки
    const { error } = ruleSchema.validate({ ...body, user: req.user._id.toString() });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const rule = await Rule.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      body,
      { new: true }
    );
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const rule = await Rule.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!rule) return res.status(404).json({ message: 'Rule not found' });
    res.json({ message: 'Rule deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

