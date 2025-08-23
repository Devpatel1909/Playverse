// Environment Configuration
const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || '',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // CORS Configuration
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || '*',
  
  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // SuperAdmin Configuration
  SUPERADMIN_CODE: process.env.SUPERADMIN_CODE || '',
  
  // Email Configuration (if needed in future)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || '',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',
  
  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  
  // API Configuration
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // Development flags
  ENABLE_API_DOCS: process.env.ENABLE_API_DOCS === 'true' || false,
  ENABLE_REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING === 'true' || true,
};

// Validation function
const validateConfig = () => {
  const requiredFields = [];
  
  if (config.NODE_ENV === 'production') {
    requiredFields.push('MONGO_URI', 'JWT_SECRET');
  }
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required environment variables: ${missingFields.join(', ')}`);
  }
  
  console.log('✅ Configuration validated successfully');
  return true;
};

// Export configuration
module.exports = {
  ...config,
  validateConfig,
  
  // Helper functions
  isDevelopment: () => config.NODE_ENV === 'development',
  isProduction: () => config.NODE_ENV === 'production',
  isTest: () => config.NODE_ENV === 'test',
};
