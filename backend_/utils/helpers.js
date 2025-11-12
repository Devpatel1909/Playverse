/**
 * General Utility Functions
 */

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

// Format phone number
const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX for Indian numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substr(0, 5)} ${cleaned.substr(5)}`;
  }
  
  return phone;
};

// Validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate jersey numbers for team
const generateAvailableJerseyNumbers = (existingNumbers, maxPlayers = 15) => {
  const available = [];
  for (let i = 1; i <= maxPlayers; i++) {
    if (!existingNumbers.includes(i)) {
      available.push(i);
    }
  }
  return available;
};

// Calculate player statistics
const calculatePlayerStats = (player) => {
  const { runs, matches, wickets } = player;
  
  return {
    ...player,
    average: matches > 0 ? (runs / matches).toFixed(2) : 0,
    strikeRate: matches > 0 ? ((runs / matches) * 100).toFixed(2) : 0,
    wicketsPerMatch: matches > 0 ? (wickets / matches).toFixed(2) : 0
  };
};

// Generate team statistics
const calculateTeamStats = (team) => {
  const { players, totalMatches, matchesWon } = team;
  
  const totalRuns = players.reduce((sum, player) => sum + (player.runs || 0), 0);
  const totalWickets = players.reduce((sum, player) => sum + (player.wickets || 0), 0);
  
  return {
    totalPlayers: players.length,
    totalRuns,
    totalWickets,
    winPercentage: totalMatches > 0 ? ((matchesWon / totalMatches) * 100).toFixed(1) : 0,
    averageRunsPerPlayer: players.length > 0 ? (totalRuns / players.length).toFixed(1) : 0,
    averageWicketsPerPlayer: players.length > 0 ? (totalWickets / players.length).toFixed(1) : 0
  };
};

// Pagination helper
const getPaginationData = (page = 1, limit = 10, total = 0) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalItems = parseInt(total) || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;
  
  return {
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

// Sort helper
const getSortOptions = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const order = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  return { [sortBy]: order };
};

// Search helper
const buildSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || fields.length === 0) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  return {
    $or: fields.map(field => ({ [field]: searchRegex }))
  };
};

// Date formatting
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  const d = new Date(date);
  
  switch (format) {
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0];
    case 'DD/MM/YYYY':
      return d.toLocaleDateString('en-GB');
    case 'MM/DD/YYYY':
      return d.toLocaleDateString('en-US');
    default:
      return d.toISOString();
  }
};

// Password strength checker
const checkPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password)
  };
  
  strength = Object.values(checks).filter(Boolean).length;
  
  return {
    strength,
    checks,
    level: strength < 3 ? 'weak' : strength < 4 ? 'medium' : 'strong'
  };
};

// Rate limiting helper
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  asyncHandler,
  generateId,
  isValidObjectId,
  sanitizeString,
  formatPhoneNumber,
  isValidEmail,
  generateAvailableJerseyNumbers,
  calculatePlayerStats,
  calculateTeamStats,
  getPaginationData,
  getSortOptions,
  buildSearchQuery,
  formatDate,
  checkPasswordStrength,
  createRateLimit
};
