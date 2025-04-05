import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import './App.css';

// Thème personnalisé
import theme from './theme/theme';

// Composants de mise en page
import Layout from './components/layout/Layout';

// Composants d'authentification
import Login from './pages/auth/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Interfaces utilisateur
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Composants communs
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

// Pages administrateur
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import DatabaseBackup from './pages/admin/DatabaseBackup';
import AdvancedSettings from './pages/admin/AdvancedSettings';

// Pages utilisateur
import UserDashboard from './pages/user/Dashboard';
import ProfileSettings from './pages/user/ProfileSettings';
import AppSettings from './pages/user/AppSettings';

// Composants fiches (communs)
import FichesList from './pages/fiches/FichesList';
import FicheEdit from './pages/fiches/FicheEdit';
import FicheCreate from './pages/fiches/FicheCreate';
import FicheHistory from './pages/fiches/FicheHistory';

// Composants rapports (communs)
import Reports from './pages/reports/Reports';
import Statistics from './pages/reports/Statistics';

// Pages de notification (communs)
import NotificationsList from './pages/notifications/NotificationsList';

// Configure Axios avec le token d'authentification
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Composant de protection des routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Composant de redirection selon le rôle
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (user && user.typeInterface === 'administrateur') {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route d'authentification */}
            <Route path="/login" element={<Login />} />

            {/* Redirection en fonction du rôle */}
            <Route path="/" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />

            {/* Routes administrateur */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="ROLE_ADMINISTRATEUR">
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="fiches/consultation" element={<FichesList isAdmin={true} />} />
                    <Route path="fiches/modification" element={<FicheEdit isAdmin={true} />} />
                    <Route path="fiches/generation" element={<FicheCreate isAdmin={true} />} />
                    <Route path="fiches/historique" element={<FicheHistory isAdmin={true} />} />
                    <Route path="utilisateurs/gestion" element={<UserManagement />} />
                    <Route path="utilisateurs/roles" element={<RoleManagement />} />
                    <Route path="database/backup" element={<DatabaseBackup />} />
                    <Route path="parametres/secteurs" element={<AdvancedSettings section="secteurs" />} />
                    <Route path="notifications/liste" element={<NotificationsList isAdmin={true} />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Routes utilisateur standard */}
            <Route path="/*" element={
              <ProtectedRoute>
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="fiches/consultation" element={<FichesList />} />
                    <Route path="fiches/modification" element={<FicheEdit />} />
                    <Route path="fiches/generation" element={<FicheCreate />} />
                    <Route path="fiches/historique" element={<FicheHistory />} />
                    <Route path="rapports/statistiques" element={<Statistics />} />
                    <Route path="rapports/listings" element={<Reports />} />
                    <Route path="notifications/liste" element={<NotificationsList />} />
                    <Route path="parametres/profil" element={<ProfileSettings />} />
                    <Route path="parametres/application" element={<AppSettings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </UserLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 