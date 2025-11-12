/**
 * File Upload Utilities
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const config = require('../config/config');

// Create upload directories if they don't exist
const createUploadDirs = async () => {
  const dirs = [
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'uploads', 'teams'),
    path.join(__dirname, '..', 'uploads', 'players'),
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '..', 'uploads');
    
    if (req.route.path.includes('teams')) {
      uploadPath = path.join(uploadPath, 'teams');
    } else if (req.route.path.includes('players')) {
      uploadPath = path.join(uploadPath, 'players');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE, // 10MB
  },
  fileFilter
});

// Base64 utilities
const base64ToFile = async (base64Data, filename, uploadDir = 'uploads') => {
  try {
    // Extract the file data and type
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const type = matches[1];
    const data = matches[2];
    
    // Validate file type
    if (!type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Create buffer from base64
    const buffer = Buffer.from(data, 'base64');
    
    // Validate file size
    if (buffer.length > config.MAX_FILE_SIZE) {
      throw new Error('File size exceeds maximum limit');
    }

    // Generate file extension based on type
    const ext = type.split('/')[1];
    const fileName = `${filename}-${Date.now()}.${ext}`;
    
    // Create full path
    const uploadPath = path.join(__dirname, '..', uploadDir);
    const filePath = path.join(uploadPath, fileName);
    
    // Ensure directory exists
    await fs.mkdir(uploadPath, { recursive: true });
    
    // Save file
    await fs.writeFile(filePath, buffer);
    
    return {
      filename: fileName,
      path: filePath,
      size: buffer.length,
      mimetype: type
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`🗑️  Deleted file: ${filePath}`);
  } catch (error) {
    console.warn(`⚠️  Failed to delete file ${filePath}:`, error.message);
  }
};

// Image processing utilities
const validateImageBase64 = (base64String) => {
  if (!base64String) return false;
  
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return false;
  
  const type = matches[1];
  return type.startsWith('image/');
};

const getBase64Size = (base64String) => {
  if (!base64String) return 0;
  
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return 0;
  
  const data = matches[2];
  return Buffer.from(data, 'base64').length;
};

module.exports = {
  createUploadDirs,
  upload,
  base64ToFile,
  deleteFile,
  validateImageBase64,
  getBase64Size
};
