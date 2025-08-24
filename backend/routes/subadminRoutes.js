// routes/subadminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SubAdmin = require('../models/SubAdmin');
// Import the authenticated superadmin middleware correctly
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cricket/sub-admins
// @desc    Get all cricket sub-admins
// @access  Protected (SuperAdmin token required)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find({ sport: 'cricket' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: subAdmins,
      count: subAdmins.length,
      message: 'Sub-admins retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching sub-admins:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to fetch sub-admins'
    });
  }
});

// @route   POST /api/cricket/sub-admins/create
// @desc    Create new cricket sub-admin
// @access  Protected (SuperAdmin token required)
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      permissions,
      createdBy
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }

    // Check if email already exists
    const existingSubAdmin = await SubAdmin.findOne({ email: email.toLowerCase() });
    if (existingSubAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Email address is already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create sub-admin
    const newSubAdmin = new SubAdmin({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone?.trim() || '',
      specialization: specialization || 'General Management',
      sport: 'cricket',
      permissions: {
        manageTeams: permissions?.manageTeams || false,
        managePlayers: permissions?.managePlayers || false,
        viewReports: permissions?.viewReports || false,
        manageMatches: permissions?.manageMatches || false,
        ...permissions
      },
      status: 'Active',
      createdBy: createdBy || 'Dsp2810',
      createdAt: new Date().toISOString(),
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: null
    });

    const savedSubAdmin = await newSubAdmin.save();

    // Remove password from response
    const subAdminResponse = savedSubAdmin.toObject();
    delete subAdminResponse.password;

    res.status(201).json({
      success: true,
      data: subAdminResponse,
      message: `Sub-admin ${name} created successfully`
    });

  } catch (error) {
    console.error('Error creating sub-admin:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email address is already registered'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to create sub-admin'
    });
  }
});

// @route   PUT /api/cricket/sub-admins/update/:id
// @desc    Update cricket sub-admin
// @access  Protected (SuperAdmin token required)
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated this way
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;
    delete updates.createdBy;

    // Add update metadata
    updates.updatedAt = new Date().toISOString();
    updates.updatedBy = req.user?.username || 'Dsp2810';

    const updatedSubAdmin = await SubAdmin.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedSubAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Sub-admin not found'
      });
    }

    res.json({
      success: true,
      data: updatedSubAdmin,
      message: 'Sub-admin updated successfully'
    });

  } catch (error) {
    console.error('Error updating sub-admin:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to update sub-admin'
    });
  }
});

// @route   DELETE /api/cricket/sub-admins/delete/:id
// @desc    Delete cricket sub-admin
// @access  Protected (SuperAdmin token required)
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const subAdmin = await SubAdmin.findById(id);
    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Sub-admin not found'
      });
    }

    await SubAdmin.findByIdAndDelete(id);

    res.json({
      success: true,
      message: `Sub-admin ${subAdmin.name} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting sub-admin:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to delete sub-admin'
    });
  }
});

// @route   POST /api/cricket/sub-admins/login
// @desc    Sub-admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Find sub-admin
    const subAdmin = await SubAdmin.findOne({ 
      email: email.toLowerCase(),
      sport: 'cricket'
    });

    if (!subAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, subAdmin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    subAdmin.lastLogin = new Date().toISOString();
    await subAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: subAdmin._id,
        email: subAdmin.email,
        role: 'sub_admin',
        sport: 'cricket'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const subAdminResponse = subAdmin.toObject();
    delete subAdminResponse.password;

    res.json({
      success: true,
      data: {
        subAdmin: subAdminResponse,
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Sub-admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to login'
    });
  }
});

// @route   GET /api/cricket/sub-admins/email/:email
// @desc    Get sub-admin by email
// @access  Protected (SuperAdmin token required)
router.get('/email/:email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    const subAdmin = await SubAdmin.findOne({ 
      email: email.toLowerCase(),
      sport: 'cricket'
    }).select('-password');

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Sub-admin not found'
      });
    }

    res.json({
      success: true,
      data: subAdmin,
      message: 'Sub-admin found'
    });

  } catch (error) {
    console.error('Error finding sub-admin:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to find sub-admin'
    });
  }
});

// @route   POST /api/cricket/sub-admins/bulk-create
// @desc    Bulk create sub-admins
// @access  Protected (SuperAdmin token required)
router.post('/bulk-create', authMiddleware, async (req, res) => {
  try {
    const { subAdmins, createdBy } = req.body;

    if (!Array.isArray(subAdmins) || subAdmins.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of sub-admins'
      });
    }

    const processedSubAdmins = [];
    const errors = [];

    for (let i = 0; i < subAdmins.length; i++) {
      const subAdminData = subAdmins[i];
      
      try {
        // Check if email exists
        const existingSubAdmin = await SubAdmin.findOne({ 
          email: subAdminData.email.toLowerCase() 
        });
        
        if (existingSubAdmin) {
          errors.push(`Sub-admin ${i + 1}: Email ${subAdminData.email} already exists`);
          continue;
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(subAdminData.password, salt);

        const newSubAdmin = new SubAdmin({
          ...subAdminData,
          email: subAdminData.email.toLowerCase().trim(),
          password: hashedPassword,
          sport: 'cricket',
          createdBy: createdBy || 'Dsp2810',
          createdAt: new Date().toISOString(),
          joinedDate: new Date().toISOString().split('T')[0]
        });

        const saved = await newSubAdmin.save();
        const response = saved.toObject();
        delete response.password;
        
        processedSubAdmins.push(response);

      } catch (error) {
        errors.push(`Sub-admin ${i + 1}: ${error.message}`);
      }
    }

    res.status(201).json({
      success: true,
      data: processedSubAdmins,
      errors: errors,
      created: processedSubAdmins.length,
      failed: errors.length,
      message: `Bulk creation completed. ${processedSubAdmins.length} sub-admins created successfully`
    });

  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error - Unable to bulk create sub-admins'
    });
  }
});

module.exports = router;