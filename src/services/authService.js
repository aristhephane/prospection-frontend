import axios from 'axios';

// URL de l'API - Définition améliorée
// En mode développement, utilisez le domaine API sans préfixe /api supplémentaire
const API_URL = 'https://api.upjv-prospection-vps.amourfoot.fr';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

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

      // IMPORTANT: Enlever tous les préfixes /api puisqu'on utilise le sous-domaine api.*
      const response = await authAxios.post(`/api/token/authenticate`, {
        email: credentials.email,
        password: credentials.password
      });
      console.log('Réponse du serveur:', response);

      if (response.data && response.data.token) {
        // Stocker le token
        localStorage.setItem(TOKEN_KEY, response.data.token);

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
        throw new Error(error.response.data.message || 'Erreur d\'authentification');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      // Essayer de révoquer le token sur le serveur
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Corriger le chemin de déconnexion (sans /api)
        await authAxios.post('/api/logout', {}, {
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
    }
    return true;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    try {
      // Corriger le chemin (sans /api)
      const response = await authAxios.post('/api/token/refresh', {
        refresh_token: refreshToken
      });

      if (response.data && response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);

        if (response.data.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
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

      // Configurer le token pour cette requête spécifique
      // Corriger le chemin (sans /api)
      const response = await authAxios.get(`/api/auth-status`, {
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

      await authService.logout();
      return null;
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
    authAxios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Éviter les boucles infinies
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              // Mettre à jour le token dans la requête d'origine
              const token = localStorage.getItem(TOKEN_KEY);
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              // Réessayer la requête d'origine avec le nouveau token
              return authAxios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Échec du rafraîchissement automatique:', refreshError);
            await authService.logout();
            window.location = '/login';
            return Promise.reject(error);
          }
        }

        if (error.response && error.response.status === 401) {
          await authService.logout();
          window.location = '/login';
        }

        return Promise.reject(error);
      }
    );

    // Également configurer le même intercepteur pour l'instance axios globale
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              const token = localStorage.getItem(TOKEN_KEY);
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Échec du rafraîchissement automatique (axios global):', refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  },

  // Test de connexion API
  testApiConnection: async () => {
    try {
      const response = await authAxios.get('/api/auth-test');  // Enlever le préfixe /api
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
  }
};

// Configurer les intercepteurs au chargement du service
authService.setupAxiosInterceptors();

export default authService;
