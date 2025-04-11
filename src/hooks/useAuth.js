import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Contexte d'authentification
const AuthContext = createContext(null);

// Intervalle de vérification de l'état d'authentification (5 minutes)
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

/**
 * Fournisseur du contexte d'authentification basé sur les sessions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkTimer, setCheckTimer] = useState(null);

  // Vérification périodique de l'état d'authentification
  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      return !!userData;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Configuration de la vérification périodique
  useEffect(() => {
    if (isAuthenticated && !checkTimer) {
      const timerId = setInterval(checkAuthStatus, AUTH_CHECK_INTERVAL);
      setCheckTimer(timerId);
    }

    return () => {
      if (checkTimer) {
        clearInterval(checkTimer);
        setCheckTimer(null);
      }
    };
  }, [isAuthenticated, checkAuthStatus, checkTimer]);

  // Vérification initiale
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setError(null);

      try {
        // Tenter de récupérer l'utilisateur du stockage local pour un affichage rapide
        const cachedUser = authService.getUserFromStorage();
        if (cachedUser) {
          setUser(cachedUser);
          setIsAuthenticated(true);
        }

        // Vérifier l'état d'authentification avec le serveur
        await checkAuthStatus();
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [checkAuthStatus]);

  // Fonction de connexion
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);

      // Configurer un timer pour la vérification d'auth si nécessaire
      if (!checkTimer) {
        const timerId = setInterval(checkAuthStatus, AUTH_CHECK_INTERVAL);
        setCheckTimer(timerId);
      }

      return userData;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.message || 'Échec de l\'authentification';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setLoading(true);

    try {
      // Nettoyage du timer de vérification
      if (checkTimer) {
        clearInterval(checkTimer);
        setCheckTimer(null);
      }

      // Déconnexion côté serveur
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Mise à jour de l'état, même en cas d'erreur
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth: checkAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
