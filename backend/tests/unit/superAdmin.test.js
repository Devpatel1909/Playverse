const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const SuperAdmin = require('../../models/SuperAdmin');

describe('Super Admin API Endpoints', () => {
  let testSuperAdminId;
  let testToken;
  
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/cricket_test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await SuperAdmin.deleteMany({});
    
    // Create a test super admin
    const testAdmin = new SuperAdmin({
      username: 'testadmin',
      email: 'test@admin.com',
      password: 'password123',
      fullName: 'Test Admin',
      permissions: ['read', 'write', 'manage_teams']
    });
    
    const savedAdmin = await testAdmin.save();
    testSuperAdminId = savedAdmin._id;
  });

  afterAll(async () => {
    // Clean up and close connection
    await SuperAdmin.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@admin.com',
        password: 'testPassword123!'
      };

      const response = await request(app)
        .post('/api/superadmin/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('superAdmin');
      expect(response.body.data.superAdmin.email).toBe(loginData.email);
      
      testToken = response.body.data.token;
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'test@admin.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/superadmin/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@admin.com',
        password: 'testPassword123!'
      };

      const response = await request(app)
        .post('/api/superadmin/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });
  });

  describe('Super Admin Management', () => {
    beforeEach(async () => {
      // Login to get token for authenticated requests
      const loginResponse = await request(app)
        .post('/api/superadmin/login')
        .send({
          email: 'test@admin.com',
          password: 'testPassword123!'
        });
      
      testToken = loginResponse.body.data.token;
    });

    it('should create a new super admin', async () => {
      const adminData = {
        username: 'newadmin',
        email: 'new@admin.com',
        password: 'newPassword123!',
        fullName: 'New Admin',
        department: 'IT',
        permissions: ['read', 'write']
      };

      const response = await request(app)
        .post('/api/superadmin')
        .set('Authorization', `Bearer ${testToken}`)
        .send(adminData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(adminData.username);
      expect(response.body.data.email).toBe(adminData.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should get all super admins', async () => {
      const response = await request(app)
        .get('/api/superadmin')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.superAdmins).toHaveLength(1);
      expect(response.body.data.superAdmins[0].username).toBe('testadmin');
    });

    it('should get a specific super admin by ID', async () => {
      const response = await request(app)
        .get(`/api/superadmin/${testSuperAdminId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testadmin');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should update a super admin', async () => {
      const updateData = {
        fullName: 'Updated Test Admin',
        department: 'Management'
      };

      const response = await request(app)
        .put(`/api/superadmin/${testSuperAdminId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Test Admin');
      expect(response.body.data.department).toBe('Management');
    });

    it('should delete a super admin', async () => {
      // Create another admin to delete
      const newAdmin = new SuperAdmin({
        username: 'todelete',
        email: 'delete@admin.com',
        password: 'password123',
        fullName: 'To Delete Admin'
      });
      
      const savedAdmin = await newAdmin.save();

      const response = await request(app)
        .delete(`/api/superadmin/${savedAdmin._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');
    });

    it('should not allow duplicate email', async () => {
      const adminData = {
        username: 'duplicate',
        email: 'test@admin.com', // Same as existing admin
        password: 'password123!',
        fullName: 'Duplicate Admin'
      };

      const response = await request(app)
        .post('/api/superadmin')
        .set('Authorization', `Bearer ${testToken}`)
        .send(adminData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email already exists');
    });

    it('should not allow duplicate username', async () => {
      const adminData = {
        username: 'testadmin', // Same as existing admin
        email: 'unique@admin.com',
        password: 'password123!',
        fullName: 'Duplicate Username Admin'
      };

      const response = await request(app)
        .post('/api/superadmin')
        .set('Authorization', `Bearer ${testToken}`)
        .send(adminData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Username is already taken');
    });
  });

  describe('Password Management', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/superadmin/login')
        .send({
          email: 'test@admin.com',
          password: 'testPassword123!'
        });
      
      testToken = loginResponse.body.data.token;
    });

    it('should change password with valid current password', async () => {
      const passwordData = {
        currentPassword: 'testPassword123!',
        newPassword: 'newPassword123!',
        confirmPassword: 'newPassword123!'
      };

      const response = await request(app)
        .put(`/api/superadmin/${testSuperAdminId}/change-password`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password changed successfully');
    });

    it('should reject password change with invalid current password', async () => {
      const passwordData = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123!',
        confirmPassword: 'newPassword123!'
      };

      const response = await request(app)
        .put(`/api/superadmin/${testSuperAdminId}/change-password`)
        .set('Authorization', `Bearer ${testToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Current password is incorrect');
    });

    it('should initiate password reset', async () => {
      const resetData = {
        email: 'test@admin.com'
      };

      const response = await request(app)
        .post('/api/superadmin/forgot-password')
        .send(resetData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('password reset');
    });
  });

  describe('Authorization', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/superadmin')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access token required');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/superadmin')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('Profile Management', () => {
    beforeEach(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/superadmin/login')
        .send({
          email: 'test@admin.com',
          password: 'testPassword123!'
        });
      
      testToken = loginResponse.body.data.token;
    });

    it('should get profile information', async () => {
      const response = await request(app)
        .get('/api/superadmin/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testadmin');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should update profile information', async () => {
      const profileData = {
        fullName: 'Updated Profile Name',
        phoneNumber: '+1234567890',
        department: 'Updated Department'
      };

      const response = await request(app)
        .put('/api/superadmin/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.fullName).toBe('Updated Profile Name');
      expect(response.body.data.phoneNumber).toBe('+1234567890');
    });
  });
});
