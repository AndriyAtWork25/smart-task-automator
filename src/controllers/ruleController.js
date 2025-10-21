const Rule = require('../models/Rule');

exports.createRule = async (req, res) => {
  const { name, trigger, action } = req.body;
  const rule = await Rule.create({
    owner: req.user._id,
    name, trigger, action
  });
  res.json(rule);
};

exports.listRules = async (req, res) => {
  const rules = await Rule.find({ owner: req.user._id });
  res.json(rules);
};

exports.updateRule = async (req, res) => {
  const rule = await Rule.findById(req.params.id);
  if (!rule) return res.status(404).json({ message: 'No rule' });
  if (!rule.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(rule, req.body);
  await rule.save();
  res.json(rule);
};

exports.deleteRule = async (req, res) => {
  const rule = await Rule.findById(req.params.id);
  if (!rule) return res.status(404).json({ message: 'No rule' });
  if (!rule.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await rule.remove();
  res.json({ ok: true });
};
