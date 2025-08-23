# Cricket Management System - Backend API

A comprehensive RESTful API backend for managing cricket teams, players, and SuperAdmin functionalities. Built with Node.js, Express.js, MongoDB, and JWT authentication.

## 🏏 Features

### Core Functionalities
- **Team Management**: Create, read, update, and delete cricket teams
- **Player Management**: Manage team players with statistics tracking
- **SuperAdmin System**: Administrative user management with role-based permissions
- **Authentication & Authorization**: JWT-based secure authentication
- **File Upload**: Support for team logos and player photos (base64 & file upload)
- **Statistics & Analytics**: Comprehensive team and player statistics
- **Validation & Error Handling**: Robust input validation and error responses

### Advanced Features
- **15-Player Team Limit**: Enforced business rule for team composition
- **Jersey Number Uniqueness**: Prevents duplicate jersey numbers within teams
- **Password Security**: Bcrypt hashing with salt rounds
- **File Management**: Automated file upload, storage, and cleanup
- **API Documentation**: Comprehensive endpoint documentation
- **Testing Suite**: Unit and integration tests with Jest
- **Logging**: Winston-based logging system
- **CORS Support**: Cross-origin resource sharing configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/cricket_management
   MONGO_TEST_URI=mongodb://localhost:27017/cricket_management_test
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   
   # File Upload Configuration
   MAX_FILE_SIZE=5MB
   UPLOAD_DIR=uploads
   
   # Logging Configuration
   LOG_LEVEL=info
   LOG_FILE=logs/app.log
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── config.js        # Environment-based configuration
│   ├── database.js      # MongoDB connection setup
│   └── logger.js        # Winston logger configuration
├── controllers/         # Request handlers
│   ├── cricketController.js      # Cricket team/player operations
│   ├── superAdminController.js   # SuperAdmin operations
│   └── sportsOverviewController.js # Dashboard statistics
├── middleware/          # Express middlewares
│   └── auth.js         # JWT authentication middleware
├── models/             # Mongoose schemas
│   ├── CricketTeam.js  # Team and Player schemas
│   └── SuperAdmin.js   # SuperAdmin schema
├── routes/             # API route definitions
│   ├── cricket.js      # Cricket management routes
│   ├── superadmin.js   # SuperAdmin routes
│   └── sportsOverview.js # Statistics routes
├── services/           # Business logic layer
│   ├── cricketService.js    # Cricket operations service
│   └── superAdminService.js # SuperAdmin operations service
├── utils/              # Utility functions
│   ├── apiResponse.js  # Standardized API responses
│   ├── fileUpload.js   # File upload utilities
│   └── helpers.js      # General helper functions
├── validators/         # Input validation rules
│   ├── cricketValidator.js    # Cricket data validation
│   └── superAdminValidator.js # SuperAdmin data validation
├── uploads/            # File storage directories
│   ├── teams/         # Team logos
│   └── players/       # Player photos
├── logs/              # Application logs
├── tests/             # Test suites
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── setup.js       # Test configuration
├── docs/              # Documentation
│   └── API_DOCUMENTATION.md
├── index.js           # Express app configuration
├── server.js          # Server entry point
├── package.json       # Project dependencies
├── jest.config.js     # Testing configuration
└── README.md          # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/superadmin/login` - SuperAdmin login
- `POST /api/superadmin/forgot-password` - Password reset request
- `POST /api/superadmin/reset-password` - Password reset confirmation

### SuperAdmin Management
- `GET /api/superadmin` - Get all SuperAdmins
- `POST /api/superadmin` - Create new SuperAdmin
- `GET /api/superadmin/:id` - Get SuperAdmin by ID
- `PUT /api/superadmin/:id` - Update SuperAdmin
- `DELETE /api/superadmin/:id` - Delete SuperAdmin
- `GET /api/superadmin/profile` - Get current profile
- `PUT /api/superadmin/profile` - Update current profile
- `PUT /api/superadmin/:id/change-password` - Change password

### Cricket Team Management
- `GET /api/cricket/teams` - Get all teams (with pagination & search)
- `POST /api/cricket/teams` - Create new team
- `GET /api/cricket/teams/:id` - Get team by ID
- `PUT /api/cricket/teams/:id` - Update team
- `DELETE /api/cricket/teams/:id` - Delete team

### Player Management
- `GET /api/cricket/teams/:teamId/players` - Get team players
- `POST /api/cricket/teams/:teamId/players` - Add player to team
- `GET /api/cricket/teams/:teamId/players/:playerId` - Get specific player
- `PUT /api/cricket/teams/:teamId/players/:playerId` - Update player
- `DELETE /api/cricket/teams/:teamId/players/:playerId` - Delete player

### Statistics & Analytics
- `GET /api/cricket/teams/:id/statistics` - Get team statistics
- `GET /api/cricket/statistics` - Get overall statistics
- `GET /api/sports-overview/dashboard` - Dashboard overview

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage
- Controllers
- Models
- Services
- Utilities
- Middleware

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Input Validation**: Express-validator for request validation
- **CORS Configuration**: Configurable cross-origin policies
- **Error Handling**: Secure error responses (no sensitive data exposure)
- **Rate Limiting**: Built-in protection against abuse
- **File Upload Security**: File type and size validation

## 📊 Data Models

### CricketTeam Schema
```javascript
{
  name: String,           // Team name
  shortName: String,      // Team abbreviation
  captain: String,        // Captain name
  coach: String,          // Coach name
  established: String,    // Year established
  homeGround: String,     // Home ground name
  contactEmail: String,   // Contact email
  contactPhone: String,   // Contact phone
  logo: String,          // Logo file path
  players: [Player],     // Array of players (max 15)
  createdAt: Date,       // Creation timestamp
  updatedAt: Date        // Last update timestamp
}
```

### Player Schema (Embedded)
```javascript
{
  name: String,          // Player name
  role: String,          // Player role/position
  age: Number,           // Player age
  jerseyNumber: Number,  // Jersey number (unique per team)
  experience: String,    // Experience description
  contactPhone: String,  // Contact phone
  contactEmail: String,  // Contact email
  photo: String,         // Photo file path
  // Statistics
  matches: Number,       // Matches played
  runs: Number,          // Total runs
  wickets: Number,       // Total wickets
  catches: Number,       // Total catches
  stumps: Number,        // Total stumps
  average: Number,       // Batting average
  strikeRate: Number,    // Strike rate
  economy: Number        // Bowling economy
}
```

### SuperAdmin Schema
```javascript
{
  username: String,           // Unique username
  email: String,             // Unique email
  password: String,          // Hashed password
  fullName: String,          // Full name
  phoneNumber: String,       // Phone number
  department: String,        // Department
  permissions: [String],     // Array of permissions
  isActive: Boolean,         // Account status
  lastLogin: Date,          // Last login timestamp
  failedLoginAttempts: Number, // Failed login count
  passwordResetToken: String,  // Reset token
  passwordResetExpires: Date,  // Reset token expiry
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production/test)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT token expiry time
- `MAX_FILE_SIZE`: Maximum file upload size
- `LOG_LEVEL`: Logging level (error/warn/info/debug)

### Database Configuration
- MongoDB connection with retry logic
- Automatic indexing for performance
- Connection pooling optimization
- Graceful shutdown handling

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚦 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries with proper indexing
- **Pagination**: Built-in pagination for large datasets
- **File Optimization**: Compressed image handling
- **Memory Management**: Efficient memory usage patterns
- **Caching**: Response caching where applicable
- **Connection Pooling**: MongoDB connection optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages
- Ensure all tests pass

## 📋 Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with hot reload
- `npm test`: Run test suite
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues automatically

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity

2. **JWT Token Invalid**
   - Verify JWT_SECRET in `.env`
   - Check token expiry time
   - Ensure proper token format

3. **File Upload Issues**
   - Check file size limits
   - Verify upload directory permissions
   - Ensure proper file format

4. **Test Failures**
   - Verify test database connection
   - Check test environment variables
   - Ensure clean test state

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review API documentation in `/docs`

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Express.js community for excellent framework
- MongoDB for robust database solutions
- JWT community for authentication standards
- Jest testing framework contributors
- All contributors and maintainers

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Node.js Version**: >=18.0.0
