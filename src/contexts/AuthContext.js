import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);

      try {
        // Utiliser le service d'authentification pour vérifier l'utilisateur
        const userData = await authService.getCurrentUser();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setIsAuthenticated(false);
        setUser(null);

        if (err.message) {
          setError(err.message);
        } else {
          setError('Erreur de connexion au serveur');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  // Valeur du contexte
  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 