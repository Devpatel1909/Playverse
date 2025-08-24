// Jest global setup for backend tests
// Provides in-memory MongoDB setup if needed placeholder (can integrate mongodb-memory-server later)

jest.setTimeout(30000);

// Basic noop setup so jest.config.js setupFilesAfterEnv resolves without error.

module.exports = {};
