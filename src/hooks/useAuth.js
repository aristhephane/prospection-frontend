import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshToken = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await authService.refreshToken();
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      // Si le rafraîchissement échoue, déconnexion
      if (error.response && error.response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Configuration du rafraîchissement périodique du token
    const intervalId = setInterval(() => {
      refreshToken();
    }, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [refreshToken]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      setError(null);

      try {
        // Vérifier d'abord le stockage local
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }

        // Puis valider avec le backend
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } else if (storedUser) {
          // Si le backend ne reconnait pas l'utilisateur mais qu'il est en stockage local
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        setError(error.message || "Erreur d'authentification");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error("Échec de l'authentification");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError(error.message || "Échec de l'authentification");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
