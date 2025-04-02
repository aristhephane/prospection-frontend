import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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

      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth-status');

        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');

        if (err.response) {
          setError(err.response.data.message || 'Erreur d\'authentification');
        } else {
          setError('Impossible de contacter le serveur');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/login_check', {
        username: email,
        password: password
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);

        // Récupérer les informations de l'utilisateur
        const userResponse = await axios.get('/api/auth-status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (userResponse.data.authenticated) {
          setIsAuthenticated(true);
          setUser(userResponse.data.user);
        } else {
          throw new Error('Impossible de récupérer les informations utilisateur');
        }
      } else {
        throw new Error('Authentification échouée');
      }

      return true;
    } catch (err) {
      console.error('Erreur de connexion:', err);

      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Identifiants invalides');
      } else {
        setError('Erreur de connexion au serveur');
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
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