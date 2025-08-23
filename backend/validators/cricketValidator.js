const { body, param, query, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.validationError(res, errors.array());
  }
  next();
};

// Team validation rules
const validateTeamCreation = [
  body('name')
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters')
    .trim(),
    
  body('shortName')
    .notEmpty()
    .withMessage('Short name is required')
    .isLength({ min: 2, max: 10 })
    .withMessage('Short name must be between 2 and 10 characters')
    .trim(),
    
  body('captain')
    .notEmpty()
    .withMessage('Captain name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Captain name must be between 2 and 50 characters')
    .trim(),
    
  body('coach')
    .notEmpty()
    .withMessage('Coach name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Coach name must be between 2 and 50 characters')
    .trim(),
    
  body('established')
    .notEmpty()
    .withMessage('Established year is required')
    .isLength({ min: 4, max: 4 })
    .withMessage('Established year must be 4 digits')
    .isNumeric()
    .withMessage('Established year must be a number'),
    
  body('homeGround')
    .notEmpty()
    .withMessage('Home ground is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Home ground must be between 2 and 100 characters')
    .trim(),
    
  body('contactEmail')
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('contactPhone')
    .notEmpty()
    .withMessage('Contact phone is required')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('logo')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('data:image/')) {
        throw new Error('Logo must be a valid base64 image');
      }
      return true;
    }),
    
  handleValidationErrors
];

const validateTeamUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid team ID'),
    
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters')
    .trim(),
    
  body('shortName')
    .optional()
    .isLength({ min: 2, max: 10 })
    .withMessage('Short name must be between 2 and 10 characters')
    .trim(),
    
  body('captain')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Captain name must be between 2 and 50 characters')
    .trim(),
    
  body('coach')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Coach name must be between 2 and 50 characters')
    .trim(),
    
  body('established')
    .optional()
    .isLength({ min: 4, max: 4 })
    .withMessage('Established year must be 4 digits')
    .isNumeric()
    .withMessage('Established year must be a number'),
    
  body('homeGround')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Home ground must be between 2 and 100 characters')
    .trim(),
    
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('contactPhone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('logo')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('data:image/')) {
        throw new Error('Logo must be a valid base64 image');
      }
      return true;
    }),
    
  handleValidationErrors
];

// Player validation rules
const validatePlayerCreation = [
  param('teamId')
    .isMongoId()
    .withMessage('Invalid team ID'),
    
  body('name')
    .notEmpty()
    .withMessage('Player name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Player name must be between 2 and 50 characters')
    .trim(),
    
  body('role')
    .notEmpty()
    .withMessage('Player role is required')
    .isIn([
      'Captain/Batsman', 'Captain/Bowler', 'Captain/All-rounder', 'Captain/Wicket Keeper',
      'Batsman', 'Fast Bowler', 'Spin Bowler', 'All-rounder', 'Wicket Keeper',
      'Opening Batsman', 'Middle Order Batsman', 'Finisher'
    ])
    .withMessage('Please select a valid player role'),
    
  body('age')
    .notEmpty()
    .withMessage('Player age is required')
    .isInt({ min: 16, max: 45 })
    .withMessage('Player age must be between 16 and 45'),
    
  body('jerseyNumber')
    .notEmpty()
    .withMessage('Jersey number is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),
    
  body('experience')
    .notEmpty()
    .withMessage('Experience is required')
    .isLength({ min: 1, max: 20 })
    .withMessage('Experience must be between 1 and 20 characters')
    .trim(),
    
  body('contactPhone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('matches')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Matches must be a non-negative integer'),
    
  body('runs')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Runs must be a non-negative integer'),
    
  body('wickets')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Wickets must be a non-negative integer'),
    
  body('catches')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Catches must be a non-negative integer'),
    
  body('stumps')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stumps must be a non-negative integer'),
    
  body('average')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Average must be a non-negative number'),
    
  body('strikeRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Strike rate must be a non-negative number'),
    
  body('economy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Economy must be a non-negative number'),
    
  body('photo')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('data:image/')) {
        throw new Error('Photo must be a valid base64 image');
      }
      return true;
    }),
    
  handleValidationErrors
];

const validatePlayerUpdate = [
  param('teamId')
    .isMongoId()
    .withMessage('Invalid team ID'),
    
  param('playerId')
    .isMongoId()
    .withMessage('Invalid player ID'),
    
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Player name must be between 2 and 50 characters')
    .trim(),
    
  body('role')
    .optional()
    .isIn([
      'Captain/Batsman', 'Captain/Bowler', 'Captain/All-rounder', 'Captain/Wicket Keeper',
      'Batsman', 'Fast Bowler', 'Spin Bowler', 'All-rounder', 'Wicket Keeper',
      'Opening Batsman', 'Middle Order Batsman', 'Finisher'
    ])
    .withMessage('Please select a valid player role'),
    
  body('age')
    .optional()
    .isInt({ min: 16, max: 45 })
    .withMessage('Player age must be between 16 and 45'),
    
  body('jerseyNumber')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),
    
  body('experience')
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage('Experience must be between 1 and 20 characters')
    .trim(),
    
  body('contactPhone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
    
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('matches')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Matches must be a non-negative integer'),
    
  body('runs')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Runs must be a non-negative integer'),
    
  body('wickets')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Wickets must be a non-negative integer'),
    
  body('catches')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Catches must be a non-negative integer'),
    
  body('stumps')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stumps must be a non-negative integer'),
    
  body('average')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Average must be a non-negative number'),
    
  body('strikeRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Strike rate must be a non-negative number'),
    
  body('economy')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Economy must be a non-negative number'),
    
  body('photo')
    .optional()
    .custom((value) => {
      if (value && !value.startsWith('data:image/')) {
        throw new Error('Photo must be a valid base64 image');
      }
      return true;
    }),
    
  handleValidationErrors
];

// Common validation rules
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateTeamCreation,
  validateTeamUpdate,
  validatePlayerCreation,
  validatePlayerUpdate,
  validateMongoId,
  validatePagination
};
