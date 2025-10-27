const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No authorization header' });

    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid auth format' });

    const secret = process.env.JWT_SECRET || 'testsecret';
    const payload = jwt.verify(token, secret);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = { _id: user._id, email: user.email };
    next();
  } catch (err) {
    console.error('auth middleware error', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
