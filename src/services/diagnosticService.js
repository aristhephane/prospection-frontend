import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://upjv-prospection-vps.amourfoot.fr/api'
  : '/api';

const diagnosticService = {
  testConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth-test`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.message,
        data: error.response?.data
      };
    }
  },

  testAuthentication: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login_check`, {
        username: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('Diagnostic d\'authentification échoué:', error);
      return {
        success: false,
        status: error.response?.status,
        error: error.message,
        data: error.response?.data
      };
    }
  },

  getServerInfo: async () => {
    try {
      const response = await axios.get(`${API_URL}/server-info`);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.message
      };
    }
  }
};

export default diagnosticService;
