import axios from 'axios';

// URL de l'API - Utilisation des variables d'environnement
const API_URL = process.env.REACT_APP_API_URL || 'https://upjv-prospection-vps.amourfoot.fr/api';
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/auth/login';
const AUTH_STATUS_URL = process.env.REACT_APP_AUTH_STATUS_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/auth/status';
const LOGOUT_URL = process.env.REACT_APP_LOGOUT_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/auth/logout';

// Clé pour stocker les informations utilisateur dans localStorage
const USER_KEY = 'user';

// Instance axios configurée pour les requêtes API
const apiAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Important pour les cookies d'authentification
  withCredentials: true,
  timeout: 15000
});

const authService = {
  login: async (credentials) => {
    try {
      console.log('Tentative de connexion avec:', credentials.email);

      // Le cookie de session sera automatiquement stocké par le navigateur
      const response = await apiAxios.post(AUTH_URL, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data && response.data.user) {
        // Stocker les informations utilisateur (sans token)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      }

      throw new Error('Informations utilisateur non trouvées dans la réponse');
    } catch (error) {
      console.error('Erreur de connexion:', error);

      if (error.response) {
        console.error('Détails de la réponse:', error.response.data);
        throw new Error(error.response.data.message || error.response.data.error || 'Erreur d\'authentification');
      } else if (error.message === 'Network Error') {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion Internet ou contactez l\'administrateur.');
      }

      throw error;
    }
  },

  logout: async () => {
    try {
      // Demander au serveur de supprimer la session et le cookie
      await apiAxios.post(LOGOUT_URL);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Supprimer les données utilisateur locales
      localStorage.removeItem(USER_KEY);
    }
    return true;
  },

  getCurrentUser: async () => {
    try {
      // Vérifier l'état d'authentification avec le serveur
      const response = await apiAxios.get(AUTH_STATUS_URL);

      if (response.data && response.data.authenticated) {
        // Mettre à jour les informations utilisateur
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data.user;
      } else {
        // Session expirée ou invalide
        localStorage.removeItem(USER_KEY);
        return null;
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  getUserFromStorage: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  },

  // Test de connexion API
  testApiConnection: async () => {
    try {
      const response = await apiAxios.get(`${API_URL}/auth-test`);
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

export default authService;
export { apiAxios };
