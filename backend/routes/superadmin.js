const express = require('express');
const bcrypt = require('bcrypt'); // native bcrypt (ensure build tools) – consider bcryptjs if issues
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const SuperAdmin = require('../models/SuperAdmin');
const SubAdmin = require('../models/Subadmin');
const CricketTeam = require('../models/CricketTeam');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Helpers
function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// POST /api/superadmin/register (public)
router.post('/register', async (req, res) => {
  try {
    const { superadminName, email, password } = req.body || {};
    if (!superadminName || superadminName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Invalid superadmin name' });
    }
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existing = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await SuperAdmin.create({ superadminName: superadminName.trim(), email: email.toLowerCase(), passwordHash });
    return res.status(201).json({
      success: true,
      message: 'SuperAdmin registered successfully',
      user: { id: user._id, superadminName: user.superadminName, email: user.email }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/superadmin/login (public)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !validateEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const user = await SuperAdmin.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'superadmin' },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, superadminName: user.superadminName, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/superadmin/logout (protected placeholder)
router.post('/logout', authMiddleware, async (req, res) => {
  return res.json({ success: true, message: 'Logout successful (client should discard token)' });
});

// GET /api/superadmin/profile (protected)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await SuperAdmin.findById(req.superadmin.id);
    if (!user) return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    res.json({ success: true, data: { id: user._id, superadminName: user.superadminName, email: user.email } });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/superadmin/profile (protected)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { superadminName } = req.body || {};
    if (!superadminName || superadminName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Invalid name' });
    }
    const user = await SuperAdmin.findByIdAndUpdate(
      req.superadmin.id,
      { superadminName: superadminName.trim() },
      { new: true }
    );
    res.json({ success: true, message: 'Profile updated', data: { id: user._id, superadminName: user.superadminName, email: user.email } });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/superadmin/:id/change-password (protected)
router.put('/:id/change-password', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (id !== String(req.superadmin.id)) {
      return res.status(403).json({ success: false, message: 'Cannot change password for another user' });
    }
    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All password fields required' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }
    const user = await SuperAdmin.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: 'Current password incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/superadmin (list with pagination & search) protected
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const search = (req.query.search || '').trim();
    const filter = search ? { $or: [ { superadminName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } } ] } : {};
    const [items, total] = await Promise.all([
      SuperAdmin.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      SuperAdmin.countDocuments(filter)
    ]);
    res.json({ success: true, data: items.map(u => ({ id: u._id, superadminName: u.superadminName, email: u.email })), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('List superadmins error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/superadmin/:id (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const user = await SuperAdmin.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    res.json({ success: true, data: { id: user._id, superadminName: user.superadminName, email: user.email } });
  } catch (err) {
    console.error('Get superadmin error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/superadmin/:id (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const { superadminName } = req.body || {};
    const update = {};
    if (superadminName) {
      if (superadminName.trim().length < 2) return res.status(400).json({ success: false, message: 'Invalid name' });
      update.superadminName = superadminName.trim();
    }
    const user = await SuperAdmin.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    res.json({ success: true, message: 'Updated successfully', data: { id: user._id, superadminName: user.superadminName, email: user.email } });
  } catch (err) {
    console.error('Update superadmin error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// DELETE /api/superadmin/:id (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });
    const user = await SuperAdmin.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete superadmin error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/superadmin/statistics (protected)
router.get('/statistics', authMiddleware, async (req, res) => {
  try {
    const [superAdmins, subAdmins, teams] = await Promise.all([
      SuperAdmin.countDocuments(),
      SubAdmin.countDocuments(),
      CricketTeam.countDocuments()
    ]);
    res.json({ success: true, data: { superAdmins, subAdmins, cricketTeams: teams } });
  } catch (err) {
    console.error('Statistics error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Stub endpoints for future (to satisfy frontend without 404) – respond with 501
router.post('/refresh-token', (req, res) => res.status(501).json({ success: false, message: 'Not implemented' }));
router.post('/forgot-password', (req, res) => res.status(501).json({ success: false, message: 'Not implemented' }));
router.post('/reset-password', (req, res) => res.status(501).json({ success: false, message: 'Not implemented' }));

module.exports = router;
