import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
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

  // Vérifier les permissions requises basées sur les rôles ou les permissions spécifiques
  if ((requiredRole || requiredPermission) && user) {
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    let hasAccess = false;

    // Vérifier les rôles administratifs qui ont tous les accès
    if (userRoles.includes('ROLE_INFORMATIQUE') || userRoles.includes('ROLE_ADMIN')) {
      hasAccess = true;
    }
    // Vérifier les rôles spécifiques requis
    else if (requiredRole && userRoles.some(role => role === requiredRole)) {
      hasAccess = true;
    }
    // Vérifier les permissions requises basées sur les rôles de l'utilisateur
    else if (requiredPermission) {
      // Mapper les rôles aux permissions selon la matrice
      const rolePermissionMap = {
        'ROLE_SERVICE_PROSPECTION': ['PERMISSION_LECTURE', 'PERMISSION_ECRITURE', 'PERMISSION_RAPPORTS'],
        'ROLE_RESPONSABLE_FORMATION': ['PERMISSION_LECTURE', 'PERMISSION_RAPPORTS'],
        'ROLE_DIRECTION': ['PERMISSION_LECTURE', 'PERMISSION_RAPPORTS'],
        'ROLE_SECRETARIAT': ['PERMISSION_LECTURE', 'PERMISSION_ECRITURE'],
        'ROLE_ORIENTATION': ['PERMISSION_LECTURE', 'PERMISSION_RAPPORTS'],
        'ROLE_INFORMATIQUE': ['PERMISSION_LECTURE', 'PERMISSION_ECRITURE', 'PERMISSION_RAPPORTS', 'PERMISSION_ADMIN'],
        'ROLE_ENSEIGNANT': ['PERMISSION_LECTURE', 'PERMISSION_RAPPORTS'],
        'ROLE_ADMIN': ['PERMISSION_LECTURE', 'PERMISSION_ECRITURE', 'PERMISSION_RAPPORTS', 'PERMISSION_ADMIN']
      };

      // Vérifier si l'un des rôles de l'utilisateur accorde la permission requise
      hasAccess = userRoles.some(role => {
        const permissions = rolePermissionMap[role] || [];
        return permissions.includes(requiredPermission);
      });
    }

    if (!hasAccess) {
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
