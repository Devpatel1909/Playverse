const SuperAdmin = require('../models/SuperAdmin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class SuperAdminService {
  // Authentication Services
  async login(email, password) {
    // Find super admin by email
    const superAdmin = await SuperAdmin.findOne({ email }).select('+password');
    if (!superAdmin) {
      throw new Error('Invalid email or password');
    }

    // Check if account is active
    if (!superAdmin.isActive) {
      throw new Error('Account is deactivated. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      // Update failed login attempts
      superAdmin.lastFailedLogin = new Date();
      superAdmin.failedLoginAttempts += 1;
      await superAdmin.save();
      throw new Error('Invalid email or password');
    }

    // Reset failed login attempts and update last login
    superAdmin.failedLoginAttempts = 0;
    superAdmin.lastLogin = new Date();
    await superAdmin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: superAdmin._id, 
        email: superAdmin.email, 
        permissions: superAdmin.permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Remove password from response
    const superAdminData = superAdmin.toObject();
    delete superAdminData.password;

    return {
      token,
      superAdmin: superAdminData
    };
  }

  async refreshToken(superAdminId) {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin || !superAdmin.isActive) {
      throw new Error('Invalid token or inactive account');
    }

    const token = jwt.sign(
      { 
        id: superAdmin._id, 
        email: superAdmin.email, 
        permissions: superAdmin.permissions 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return { token };
  }

  // Super Admin Management Services
  async createSuperAdmin(adminData) {
    // Check if super admin with same email exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email: adminData.email });
    if (existingSuperAdmin) {
      throw new Error('Super Admin with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await SuperAdmin.findOne({ username: adminData.username });
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    adminData.password = hashedPassword;

    const superAdmin = new SuperAdmin(adminData);
    await superAdmin.save();

    // Remove password from response
    const superAdminData = superAdmin.toObject();
    delete superAdminData.password;

    return superAdminData;
  }

  async getAllSuperAdmins(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const superAdmins = await SuperAdmin.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SuperAdmin.countDocuments(query);

    return {
      superAdmins,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalSuperAdmins: total
    };
  }

  async getSuperAdminById(superAdminId) {
    const superAdmin = await SuperAdmin.findById(superAdminId).select('-password');
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }
    return superAdmin;
  }

  async updateSuperAdmin(superAdminId, updateData) {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }

    // Check for duplicate email if updating email
    if (updateData.email && updateData.email !== superAdmin.email) {
      const existingEmail = await SuperAdmin.findOne({ 
        email: updateData.email, 
        _id: { $ne: superAdminId } 
      });
      if (existingEmail) {
        throw new Error('Super Admin with this email already exists');
      }
    }

    // Check for duplicate username if updating username
    if (updateData.username && updateData.username !== superAdmin.username) {
      const existingUsername = await SuperAdmin.findOne({ 
        username: updateData.username, 
        _id: { $ne: superAdminId } 
      });
      if (existingUsername) {
        throw new Error('Username is already taken');
      }
    }

    // Update fields
    Object.assign(superAdmin, updateData);
    await superAdmin.save();

    // Remove password from response
    const superAdminData = superAdmin.toObject();
    delete superAdminData.password;

    return superAdminData;
  }

  async deleteSuperAdmin(superAdminId) {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }

    await SuperAdmin.findByIdAndDelete(superAdminId);
    return { message: 'Super Admin deleted successfully' };
  }

  // Password Management Services
  async changePassword(superAdminId, currentPassword, newPassword) {
    const superAdmin = await SuperAdmin.findById(superAdminId).select('+password');
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, superAdmin.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    superAdmin.password = hashedNewPassword;
    superAdmin.passwordChangedAt = new Date();
    await superAdmin.save();

    return { message: 'Password changed successfully' };
  }

  async requestPasswordReset(email) {
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      // Don't reveal if email exists or not
      return { message: 'If the email exists, a password reset link will be sent.' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry (1 hour)
    superAdmin.passwordResetToken = resetTokenHash;
    superAdmin.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await superAdmin.save();

    // TODO: Send email with reset token
    // For now, return the token (in production, this should be sent via email)
    return { 
      message: 'Password reset token generated',
      resetToken: resetToken // Remove this in production
    };
  }

  async resetPassword(resetToken, newPassword) {
    // Hash the provided token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const superAdmin = await SuperAdmin.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!superAdmin) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    superAdmin.password = hashedNewPassword;
    superAdmin.passwordChangedAt = new Date();
    superAdmin.passwordResetToken = undefined;
    superAdmin.passwordResetExpires = undefined;
    await superAdmin.save();

    return { message: 'Password reset successfully' };
  }

  // Profile Services
  async getProfile(superAdminId) {
    const superAdmin = await SuperAdmin.findById(superAdminId).select('-password');
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }
    return superAdmin;
  }

  async updateProfile(superAdminId, profileData) {
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }

    // Only allow specific fields to be updated
    const allowedFields = ['fullName', 'phoneNumber', 'department'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (profileData[field] !== undefined) {
        updateData[field] = profileData[field];
      }
    });

    Object.assign(superAdmin, updateData);
    await superAdmin.save();

    // Remove password from response
    const superAdminData = superAdmin.toObject();
    delete superAdminData.password;

    return superAdminData;
  }

  // Activity and Statistics Services
  async getSuperAdminActivity(superAdminId) {
    const superAdmin = await SuperAdmin.findById(superAdminId).select(
      'username email lastLogin failedLoginAttempts lastFailedLogin createdAt isActive'
    );
    
    if (!superAdmin) {
      throw new Error('Super Admin not found');
    }

    return {
      profile: superAdmin,
      activitySummary: {
        accountAge: Math.floor((new Date() - superAdmin.createdAt) / (1000 * 60 * 60 * 24)) + ' days',
        status: superAdmin.isActive ? 'Active' : 'Inactive',
        securityStatus: superAdmin.failedLoginAttempts > 0 ? 'Warning' : 'Good'
      }
    };
  }

  async getSystemStatistics() {
    const totalSuperAdmins = await SuperAdmin.countDocuments();
    const activeSuperAdmins = await SuperAdmin.countDocuments({ isActive: true });
    const inactiveSuperAdmins = totalSuperAdmins - activeSuperAdmins;
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentLogins = await SuperAdmin.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    const recentCreated = await SuperAdmin.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      counts: {
        totalSuperAdmins,
        activeSuperAdmins,
        inactiveSuperAdmins
      },
      activity: {
        recentLogins,
        recentCreated
      },
      percentages: {
        activePercentage: totalSuperAdmins > 0 ? Math.round((activeSuperAdmins / totalSuperAdmins) * 100) : 0,
        recentActivityPercentage: totalSuperAdmins > 0 ? Math.round((recentLogins / totalSuperAdmins) * 100) : 0
      }
    };
  }
}

module.exports = new SuperAdminService();
