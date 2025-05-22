const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Check Authorization header format
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    // Extract and verify token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token and check expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check token expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }

    // Support both userId and adminId for admin tokens
    if (!decoded.userId && decoded.adminId) {
      decoded.userId = decoded.adminId;
    }

    // Validate required fields
    if (!decoded.userId && !decoded.adminId) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Authentication error' });
  }
};

module.exports = auth;