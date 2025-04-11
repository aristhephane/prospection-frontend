import axios from 'axios';

// Configuration globale d'Axios
axios.defaults.timeout = 10000; // Timeout réduit à 10 secondes
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://upjv-prospection-vps.amourfoot.fr/api';
axios.defaults.withCredentials = true;

// Configuration pour les préfixes API
axios.interceptors.request.use(
  (config) => {
    // Ne pas ajouter de préfixe /api/ quand on utilise le sous-domaine api.*
    // Simplifier la logique d'ajout de préfixe
    if (config.url && !config.url.startsWith('/') && !config.url.startsWith('http')) {
      config.url = `/${config.url}`;
    }

    const token = localStorage.getItem('token');
    if (token) {
      // Format correct pour l'en-tête d'autorisation JWT
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur interceptée dans la requête:', error);
    return Promise.reject(error);
  }
);

// Gérer les erreurs d'authentification (401) et autres erreurs
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout de la requête');
      return Promise.reject(new Error('La requête a pris trop de temps à répondre'));
    }

    if (error.response) {
      // Cas spécifique pour les erreurs 401 (non autorisé)
      if (error.response.status === 401) {
        console.warn('Erreur d\'authentification 401 détectée');

        // Ne pas déconnecter immédiatement l'utilisateur
        // Juste logger l'erreur pour le débogage
        console.error('Détails de l\'erreur 401:', error.response.data);

        // Augmenter le seuil de tolérance pour les erreurs 401 pour éviter les déconnexions
        // fréquentes lors des rechargements de page
        const failedAuthAttempts = parseInt(sessionStorage.getItem('failedAuthAttempts') || '0');

        // Augmenter le seuil à 10 tentatives échouées au lieu de 3
        if (failedAuthAttempts >= 10) {
          console.warn('Trop d\'erreurs d\'authentification, redirection vers login');
          sessionStorage.removeItem('failedAuthAttempts');

          // Uniquement dans ce cas, supprimer les données d'authentification
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Et rediriger vers la page de connexion
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        } else {
          // Incrémenter le compteur d'échecs
          sessionStorage.setItem('failedAuthAttempts', (failedAuthAttempts + 1).toString());

          // Ne pas rejeter l'erreur pour les endpoints non critiques
          // Si l'URL contient certains patterns, comme les vérifications de statut
          const url = error.config.url || '';
          if (url.includes('status') || url.includes('auth-test') || url.includes('check')) {
            console.warn('Erreur 401 sur un endpoint non critique, continuons sans déconnecter');
            return Promise.resolve({ data: { authenticated: false } });
          }
        }
      } else {
        // Réinitialiser le compteur pour les autres types d'erreur
        sessionStorage.removeItem('failedAuthAttempts');
      }

      // Log détaillé des erreurs
      console.error(`Erreur API ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse n'a été reçue
      console.error('Erreur réseau - Aucune réponse reçue');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

// Créer une instance d'axios configurée
const axiosInstance = axios;

// Export l'instance configurée
export default axiosInstance;
