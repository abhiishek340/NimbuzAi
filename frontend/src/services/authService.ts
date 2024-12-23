import axios from 'axios';

interface AuthResponse {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export const authService = {
  async authenticatePlatform(platform: string, code: string): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/auth/social', {
        platform,
        code
      });
      
      return {
        success: true,
        accessToken: response.data.accessToken
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  },

  async checkAuthStatus(platform: string): Promise<boolean> {
    try {
      const response = await axios.get(`/api/auth/status/${platform}`);
      return response.data.isAuthenticated;
    } catch (error) {
      return false;
    }
  }
}; 