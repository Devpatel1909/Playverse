const { body, param, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.validationError(res, errors.array());
  }
  next();
};

// Super Admin validation rules
const validateSuperAdminLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  handleValidationErrors
];

const validateSuperAdminCreation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .trim(),
    
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim(),
    
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('department')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Department must not exceed 50 characters')
    .trim(),
    
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
    
  body('permissions.*')
    .optional()
    .isIn(['create', 'read', 'update', 'delete', 'manage_users', 'manage_teams', 'manage_tournaments'])
    .withMessage('Invalid permission'),
    
  handleValidationErrors
];

const validateSuperAdminUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid super admin ID'),
    
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username can only contain letters and numbers')
    .trim(),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim(),
    
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('department')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Department must not exceed 50 characters')
    .trim(),
    
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Permissions must be an array'),
    
  body('permissions.*')
    .optional()
    .isIn(['create', 'read', 'update', 'delete', 'manage_users', 'manage_teams', 'manage_tournaments'])
    .withMessage('Invalid permission'),
    
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
    
  handleValidationErrors
];

const validatePasswordChange = [
  param('id')
    .isMongoId()
    .withMessage('Invalid super admin ID'),
    
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    
  handleValidationErrors
];

const validatePasswordReset = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  handleValidationErrors
];

const validateTokenAndNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
    
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateSuperAdminLogin,
  validateSuperAdminCreation,
  validateSuperAdminUpdate,
  validatePasswordChange,
  validatePasswordReset,
  validateTokenAndNewPassword
};
