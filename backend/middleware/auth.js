const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

// Auth middleware for protecting routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if superadmin exists
    const superadmin = await SuperAdmin.findById(decoded.id);
    if (!superadmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, access denied'
      });
    }

    // Add superadmin info to request
    req.superadmin = {
      id: superadmin._id,
      superadminName: superadmin.superadminName,
      email: superadmin.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, access denied'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please login again'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const superadmin = await SuperAdmin.findById(decoded.id);
      
      if (superadmin) {
        req.superadmin = {
          id: superadmin._id,
          superadminName: superadmin.superadminName,
          email: superadmin.email
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    console.warn('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
