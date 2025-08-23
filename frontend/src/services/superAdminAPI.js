// SuperAdmin API Service for Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class SuperAdminAPIService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/superadmin`;
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('superadmin_token');
  }

  // Helper method to create headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle different error types
      if (response.status === 401) {
        // Token expired or invalid - clear token and redirect to login
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');
        window.location.href = '/superadmin/login';
      }
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Authentication APIs
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      if (data.token) {
        localStorage.setItem('superadmin_token', data.token);
        localStorage.setItem('superadmin_user', JSON.stringify(data.user));
      }
      
      return {
        success: true,
        data: {
          token: data.token,
          superAdmin: data.user
        },
        message: data.message || 'Login successful'
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      // Clear local storage
      localStorage.removeItem('superadmin_token');
      localStorage.removeItem('superadmin_user');
      
      // Optionally call logout endpoint if exists
      const token = this.getAuthToken();
      if (token) {
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: this.getHeaders()
        });
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local data
      localStorage.removeItem('superadmin_token');
      localStorage.removeItem('superadmin_user');
      return { success: true, message: 'Logged out successfully' };
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${this.baseURL}/refresh-token`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse(response);
      
      if (data.success && data.data.token) {
        localStorage.setItem('superadmin_token', data.data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  // Profile Management
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData)
      });
      
      const data = await this.handleResponse(response);
      
      // Update stored user data
      if (data.success && data.data) {
        localStorage.setItem('superadmin_user', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  // Password Management
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const user = JSON.parse(localStorage.getItem('superadmin_user') || '{}');
      const response = await fetch(`${this.baseURL}/${user._id}/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.baseURL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  }

  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await fetch(`${this.baseURL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // SuperAdmin Management (for managing other super admins)
  async getAllSuperAdmins(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await fetch(`${this.baseURL}?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch super admins:', error);
      throw error;
    }
  }

  async createSuperAdmin(adminData) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        superadminName: adminData.fullName || adminData.superadminName,
        email: adminData.email,
        password: adminData.password
      };

      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return { 
        success: true, 
        data: data.user,
        message: data.message || 'SuperAdmin created successfully'
      };
    } catch (error) {
      console.error('Failed to create super admin:', error);
      throw error;
    }
  }

  async getSuperAdminById(adminId) {
    try {
      const response = await fetch(`${this.baseURL}/${adminId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch super admin:', error);
      throw error;
    }
  }

  async updateSuperAdmin(adminId, adminData) {
    try {
      const response = await fetch(`${this.baseURL}/${adminId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(adminData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update super admin:', error);
      throw error;
    }
  }

  async deleteSuperAdmin(adminId) {
    try {
      const response = await fetch(`${this.baseURL}/${adminId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete super admin:', error);
      throw error;
    }
  }

  // Dashboard and Statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/sports-overview/dashboard`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }

  async getSystemStatistics() {
    try {
      const response = await fetch(`${this.baseURL}/statistics`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch system statistics:', error);
      throw error;
    }
  }

  // Utility Methods
  isAuthenticated() {
    const token = this.getAuthToken();
    const user = localStorage.getItem('superadmin_user');
    return !!(token && user);
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('superadmin_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  hasPermission(permission) {
    const user = this.getCurrentUser();
    return user && user.permissions && user.permissions.includes(permission);
  }

  // Validation helpers
  validateLoginData(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    return true;
  }

  validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('All password fields are required');
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(newPassword)) {
      throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
    }

    return true;
  }

  validateSuperAdminData(adminData) {
    const requiredFields = ['username', 'email', 'password', 'fullName'];
    const missingFields = requiredFields.filter(field => !adminData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      throw new Error('Invalid email format');
    }

    // Username validation
    if (adminData.username.length < 3 || adminData.username.length > 30) {
      throw new Error('Username must be between 3 and 30 characters');
    }

    if (!/^[a-zA-Z0-9]+$/.test(adminData.username)) {
      throw new Error('Username can only contain letters and numbers');
    }

    // Password validation (for new admins)
    if (adminData.password) {
      if (adminData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
      if (!strongPasswordRegex.test(adminData.password)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
      }
    }

    return true;
  }
}

// Create and export a singleton instance
const superAdminAPIService = new SuperAdminAPIService();
export default superAdminAPIService;
