const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing. Access denied.' });
  }

  // Expect Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format must be Bearer <token>. Access denied.' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforbentolinkhubdashboard');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired. Access denied.' });
  }
};
