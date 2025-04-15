import axios from 'axios';

// Configuration globale d'Axios
axios.defaults.timeout = 15000; // Timeout augmenté à 15 secondes
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
axios.defaults.withCredentials = true;

// Intercepteur pour gérer les erreurs 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expiré ou invalide, rediriger vers login
      console.error('Session expirée ou invalide');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Si nous ne sommes pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Créer une instance d'axios configurée
const axiosInstance = axios;

// Export l'instance configurée
export default axiosInstance;
