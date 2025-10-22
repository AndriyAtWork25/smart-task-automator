const Rule = require('../models/Rule');
const { ruleSchema } = require('../validators/ruleValidator'); 

exports.createRule = async (req, res) => {
  try {
    const { error } = ruleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const rule = await Rule.create({ ...req.body, user: req.user._id });
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
    // ✅ Перевірка перед оновленням
    const { error } = ruleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const rule = await Rule.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
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
