import axios from 'axios';

// URL de l'API - Utilisation des variables d'environnement
const API_URL = process.env.REACT_APP_API_URL || 'https://upjv-prospection-vps.amourfoot.fr/api';
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/login_check';
const REFRESH_URL = process.env.REACT_APP_REFRESH_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/token/refresh';
const AUTH_STATUS_URL = process.env.REACT_APP_AUTH_STATUS_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/auth-status';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Création d'une instance axios dédiée pour l'authentification
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000 // Augmenter le timeout à 15s pour les connexions lentes
});

const authService = {
  login: async (credentials) => {
    try {
      console.log('Tentative de connexion avec:', credentials);

      // Utiliser directement l'URL d'authentification complète
      const response = await axios.post(AUTH_URL, {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      console.log('Réponse du serveur:', response);

      if (response.data && response.data.token) {
        // Stocker le token
        localStorage.setItem(TOKEN_KEY, response.data.token);

        // Stocker le refresh token s'il est présent
        if (response.data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        }

        // Stocker les informations utilisateur
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }

        authService.setupAxiosInterceptors();
        return response.data.user;
      }
      throw new Error('Token non trouvé dans la réponse');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      // Logging supplémentaire pour diagnostiquer les problèmes CORS
      if (error.message === 'Network Error') {
        console.error('Erreur réseau potentiellement causée par CORS ou DNS');
      }
      if (error.response) {
        console.error('Détails de la réponse:', error.response.data);
        throw new Error(error.response.data.message || error.response.data.error || 'Erreur d\'authentification');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      // Essayer de révoquer le token sur le serveur
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Ajouter le préfixe /api au chemin
        await authAxios.post(`${API_URL}/logout`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => {
          // Ignorer les erreurs lors du logout côté serveur
          console.log('Logout côté serveur non disponible');
        });
      }
    } finally {
      // Toujours nettoyer les données locales
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      delete authAxios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];
    }
    return true;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    try {
      // Utiliser l'URL de rafraîchissement complète
      const response = await axios.post(REFRESH_URL, {
        refresh_token: refreshToken
      });

      if (response.data && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);

        if (response.data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        }

        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }

        authService.setupAxiosInterceptors();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Échec du rafraîchissement du token:', error);
      return false;
    }
  },

  getCurrentUser: async () => {
    try {
      const user = JSON.parse(localStorage.getItem(USER_KEY));
      const token = localStorage.getItem(TOKEN_KEY);

      if (!user || !token) {
        return null;
      }

      // Vérifier l'état de l'authentification
      const response = await axios.get(AUTH_STATUS_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.authenticated) {
        // Mettre à jour les informations utilisateur si elles ont changé
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          return response.data.user;
        }
        return user;
      } else {
        // Essayer de rafraîchir le token
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          return await authService.getCurrentUser();
        }
        await authService.logout();
        return null;
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);

      // Essayer de rafraîchir le token en cas d'erreur 401
      if (error.response && error.response.status === 401) {
        try {
          const refreshed = await authService.refreshToken();
          if (refreshed) {
            return await authService.getCurrentUser();
          }
        } catch (refreshError) {
          console.error('Échec du rafraîchissement après erreur 401:', refreshError);
        }
      }

      // Ne pas se déconnecter automatiquement en cas d'erreur - retourner l'utilisateur stocké
      return JSON.parse(localStorage.getItem(USER_KEY));
    }
  },

  setupAxiosInterceptors: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Configurer également l'instance axios globale
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Intercepteur pour rafraîchir automatiquement le token expiré
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Éviter les boucles infinies
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log('Tentative de rafraîchissement du token...');
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              // Mettre à jour le token dans la requête d'origine
              const token = localStorage.getItem(TOKEN_KEY);
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              // Réessayer la requête d'origine avec le nouveau token
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Échec du rafraîchissement automatique:', refreshError);
            // Ne pas déconnecter en cas d'échec pour permettre une récupération manuelle
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  },

  // Test de connexion API
  testApiConnection: async () => {
    try {
      // Ajouter le préfixe /api au chemin
      const response = await axios.get(`${API_URL}/auth-test`);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Debug pour tester la configuration
  getDebugInfo: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    return {
      apiUrl: API_URL,
      authUrl: AUTH_URL,
      refreshUrl: REFRESH_URL,
      authStatusUrl: AUTH_STATUS_URL,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      tokenFirstChars: token ? `${token.substring(0, 10)}...` : null,
      refreshTokenFirstChars: refreshToken ? `${refreshToken.substring(0, 10)}...` : null,
      hasUser: !!user,
      userEmail: user ? JSON.parse(user).email : null,
      environment: process.env.NODE_ENV
    };
  }
};

// Initialisation des intercepteurs au démarrage
if (localStorage.getItem(TOKEN_KEY)) {
  authService.setupAxiosInterceptors();
}

export default authService;
