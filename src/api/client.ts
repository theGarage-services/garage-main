import { User } from "./auth";

// API client for Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  baseURL: any;
  accessToken: string | null;
  refreshToken: string | null;
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = sessionStorage.getItem('access_token');
    this.refreshToken = sessionStorage.getItem('refresh_token');
  }

  // Store tokens
  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (accessToken) {
      sessionStorage.setItem('access_token', accessToken);
    } else {
      sessionStorage.removeItem('access_token');
    }
    if (refreshToken) {
      sessionStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.removeItem('refresh_token');
    }
  }

  // Clear tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }

  // Make authenticated requests
  async request(endpoint: string, options: RequestInit & { skipAuth?: boolean } = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Only set default Content-Type if not FormData and not already set
    const defaultHeaders: Record<string, string> = {};
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }
    
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...options.headers as Record<string, string>,
    };

    // Add authorization header if token exists and caller didn't opt out
    const skipAuth = (options as any).skipAuth === true;
    if (this.accessToken && !skipAuth) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    // Handle 401 Unauthorized - try to refresh token (but NOT for auth endpoints)
    if (response.status === 401 && this.refreshToken && !endpoint.includes('/auth/')) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const retryHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${this.accessToken}`,
        };
        const retryConfig: RequestInit = {
          ...config,
          headers: retryHeaders,
        };
        return fetch(url, retryConfig);
      }
    }

    return response;
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.access;
        sessionStorage.setItem('access_token', data.access);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  // Authentication methods
  async login(email: string, password: string, _role?: string) {
    const url = `${this.baseURL}/auth/login/`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      this.setTokens(data.access, data.refresh);
      return data;
    } else {
      // Parse error safely: use a clone to attempt JSON parse, fall back to text
      try {
        const clone = response.clone();
        const errorJson = await clone.json();
        throw new Error(JSON.stringify(errorJson));
      } catch (error_) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
    }
  }

  async requestPasswordReset(email: string) {
    const response = await this.request('/accounts/password/reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true as any,
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send password reset email');
    }
  }

  private async parseErrorResponse(response: Response): Promise<Error> {
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const errorJson: unknown = await response.json();
      if (typeof errorJson === 'string') {
        return new TypeError(errorJson);
      }
      if (errorJson && typeof errorJson === 'object') {
        const obj = errorJson as Record<string, unknown>;
        if (typeof obj.detail === 'string') {
          return new Error(obj.detail);
        }
        if (typeof obj.message === 'string') {
          return new Error(obj.message);
        }
        const errorMessages = Object.entries(obj).map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${value.join(', ')}`;
          }
          return `${key}: ${value}`;
        });
        return new Error(errorMessages.join('; '));
      }
    }

    const text = await response.text();
    const trimmedText = text.trim().toLowerCase();
    if (trimmedText.startsWith('<!doctype html') || trimmedText.startsWith('<html')) {
      return new Error(`Server error (${response.status}). Please try again.`);
    }
    return new Error(text || `HTTP ${response.status}`);
  }

  async register(userData: { username: string; email: string; password: string; password_confirm: string; first_name: string; last_name: string; } | FormData) {
    const response = await this.request('/accounts/register/', {
      method: 'POST',
      body: userData instanceof FormData ? userData : JSON.stringify(userData),
      headers: userData instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      skipAuth: true as any,
    });

    if (response.ok) {
      const data = await response.json();
      // Auto-login: store tokens if returned by backend
      if (data.access && data.refresh) {
        this.setTokens(data.access, data.refresh);
      }
      return data;
    }
    throw await this.parseErrorResponse(response);
  }

  async logout() {
    this.clearTokens();
  }

  // User profile methods
  async getProfile() {
    const response = await this.request('/accounts/profile/');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch profile');
  }

  async updateProfile(userData: Partial<User>) {
    const response = await this.request('/accounts/profile/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update profile');
  }

  // Jobs management
  async getJobs() {
    const response = await this.request('/accounts/jobs/');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch jobs');
  }

  async createJob(jobData: any) {
    const response = await this.request('/accounts/jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to create job');
  }

  async updateJob(jobId: any, jobData: any) {
    const response = await this.request(`/accounts/jobs/${jobId}/`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update job');
  }

  async deleteJob(jobId: any) {
    const response = await this.request(`/accounts/jobs/${jobId}/`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return true;
    }
    throw new Error('Failed to delete job');
  }

  // Queues management
  async getQueues() {
    const response = await this.request('/accounts/queues/');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch queues');
  }

  async createQueue(queueData: any) {
    const response = await this.request('/accounts/queues/', {
      method: 'POST',
      body: JSON.stringify(queueData),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to create queue');
  }

  // User statistics
  async getStats() {
    const response = await this.request('/accounts/stats/');
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch stats');
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;
