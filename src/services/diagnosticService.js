import axios from 'axios';

// Utiliser directement le préfixe /api car le proxy s'en occupe
const AUTH_URL = '/api/auth/login';

const diagnosticService = {
  testConnection: async () => {
    try {
      const response = await axios.get('/api/auth-test', {
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
      const response = await axios.post(AUTH_URL, {
        email: credentials.email,
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
      const response = await axios.get('/api/server-info');
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
  },

  testApiRoutes: async () => {
    try {
      const testRoutes = [
        { url: '/api/fiches', method: 'GET', description: 'Liste des fiches' },
        { url: '/api/utilisateurs', method: 'GET', description: 'Liste des utilisateurs' },
        { url: '/api/entreprises', method: 'GET', description: 'Liste des entreprises' },
        { url: '/api/dashboard/statistics', method: 'GET', description: 'Statistiques du tableau de bord' }
      ];

      const results = await Promise.all(testRoutes.map(async (route) => {
        try {
          const response = await axios({
            method: route.method,
            url: route.url,
            timeout: 5000
          });

          return {
            route: route.url,
            description: route.description,
            success: true,
            status: response.status
          };
        } catch (error) {
          return {
            route: route.url,
            description: route.description,
            success: false,
            status: error.response?.status,
            error: error.message
          };
        }
      }));

      return {
        success: true,
        results: results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default diagnosticService;
