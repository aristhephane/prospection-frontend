import axios from 'axios';

// Configuration globale d'Axios
axios.defaults.timeout = 10000; // Timeout réduit à 10 secondes
axios.defaults.baseURL = 'http://api.upjv-prospection-vps.amourfoot.fr';
axios.defaults.withCredentials = true;

// Configuration pour les préfixes API
axios.interceptors.request.use(
  (config) => {
    // Ne pas ajouter de préfixe /api/ quand on utilise le sous-domaine api.*
    // Simplifier la logique d'ajout de préfixe
    if (config.url && !config.url.startsWith('/') && !config.url.startsWith('http')) {
      config.url = `/${config.url}`;
    }

    const token = localStorage.getItem('auth_token');
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        // Rediriger vers la page de connexion seulement si nous ne sommes pas déjà sur cette page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
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

// Export un objet vide pour permettre l'import dans index.js
export default {};
