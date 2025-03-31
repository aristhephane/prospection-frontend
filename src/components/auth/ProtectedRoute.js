import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Si l'authentification est en cours de vérification, afficher un spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un rôle spécifique est requis, vérifier si l'utilisateur a ce rôle
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(user.roles) &&
      (user.roles.includes(requiredRole) || user.roles.includes('ROLE_ADMIN'));

    if (!hasRequiredRole) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Accès refusé</h4>
            <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
          </div>
        </div>
      );
    }
  }

  // Si toutes les vérifications passent, rendre le composant enfant
  return children;
};

export default ProtectedRoute;
