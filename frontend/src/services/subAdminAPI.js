// services/subAdminAPI.js
class SubAdminAPIService {
  constructor() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Ensure base ends with /api exactly once
  this.baseURL = /\/api\/?$/.test(raw) ? raw.replace(/\/$/, '') : raw.replace(/\/$/, '') + '/api';
    this.endpoints = {
      subAdmins: '/cricket/sub-admins',
      createSubAdmin: '/cricket/sub-admins/create',
      updateSubAdmin: '/cricket/sub-admins/update',
      deleteSubAdmin: '/cricket/sub-admins/delete',
      validateSubAdmin: '/cricket/sub-admins/validate'
    };
  }

  // Helper method for API calls
  async apiCall(endpoint, options = {}) {
    try {
    const token = localStorage.getItem('superadmin_token');
  const url = `${this.baseURL}${endpoint}`;
  // Debug: expose in console to trace 404 issues
  if (import.meta.env.DEV) console.debug('[SubAdminAPI] Request:', url, options.method || 'GET');
  const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message, status: 500 };
    }
  }

  // Login cricket sub-admin (DB-backed)
  async loginCricketSubAdmin(email, password) {
    try {
      return await this.apiCall('/cricket/sub-admins/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all sub-admins
  async getAllSubAdmins() {
    try {
      return await this.apiCall(this.endpoints.subAdmins, {
        method: 'GET'
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new sub-admin
  async createSubAdmin(subAdminData) {
    try {
      // Validate data before sending
      this.validateSubAdminData(subAdminData);
      
      // Let backend assign dates; send minimal fields
      const payload = {
        ...subAdminData,
        createdBy: 'Dsp2810'
      };
      const res = await this.apiCall(this.endpoints.createSubAdmin, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!res.success) {
        const backendMsg = res.data?.error || res.data?.message;
        return { ...res, error: backendMsg || 'Failed to create sub-admin' };
      }
      return res;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update sub-admin
  async updateSubAdmin(subAdminId, updateData) {
    try {
      return await this.apiCall(`${this.endpoints.updateSubAdmin}/${subAdminId}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updateData,
          updatedBy: 'Dsp2810',
          updatedAt: '2025-08-24 12:35:01'
        })
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete sub-admin
  async deleteSubAdmin(subAdminId) {
    try {
      return await this.apiCall(`${this.endpoints.deleteSubAdmin}/${subAdminId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Validate sub-admin data
  validateSubAdminData(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email address is required');
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Valid phone number is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    return true;
  }

  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  isValidPhone(phone) {
    const phoneRegex = /^[\\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Toggle sub-admin status
  async toggleSubAdminStatus(subAdminId, currentStatus) {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    return await this.updateSubAdmin(subAdminId, { status: newStatus });
  }

  // Get sub-admin by email
  async getSubAdminByEmail(email) {
    try {
      return await this.apiCall(`${this.endpoints.subAdmins}/email/${email}`, {
        method: 'GET'
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Bulk operations
  async bulkCreateSubAdmins(subAdminsArray) {
    try {
      return await this.apiCall(`${this.endpoints.subAdmins}/bulk-create`, {
        method: 'POST',
        body: JSON.stringify({
          subAdmins: subAdminsArray,
          createdBy: 'Dsp2810',
          createdAt: '2025-08-24 12:35:01'
        })
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const subAdminAPIService = new SubAdminAPIService();
export default subAdminAPIService;