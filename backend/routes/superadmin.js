const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SuperAdmin = require('../models/SuperAdmin');

const router = express.Router();

// Helpers
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// POST /api/superadmin/register
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
  const { superadminName, email, password } = req.body || {};

    if (!superadminName || superadminName.length < 2) {
      return res.status(400).json({ message: 'Invalid superadmin name' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }


    // // Ensure email unique
    const existing = await SuperAdmin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await SuperAdmin.create({ superadminName, email, passwordHash });

    return res.status(201).json({
      message: 'SuperAdmin registered successfully',
      user: { id: user._id, superadminName: user.superadminName, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/superadmin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !validateEmail(email) || !password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = await SuperAdmin.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'superadmin' },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, superadminName: user.superadminName, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
