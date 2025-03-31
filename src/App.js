import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ProspectionList from './pages/ProspectionList';
import ProspectionDetail from './pages/ProspectionDetail';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// Import des composants de gestion d'utilisateurs
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import UserForm from './pages/users/UserForm';
import UserProfile from './pages/users/UserProfile';

// Import des composants de gestion de fiches
import FileList from './pages/files/FileList';
import FileDetail from './pages/files/FileDetail';
import FileForm from './pages/files/FileForm';
import FileHistory from './pages/files/FileHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="prospection" element={
              <ProtectedRoute>
                <ProspectionList />
              </ProtectedRoute>
            } />
            <Route path="prospection/:id" element={
              <ProtectedRoute>
                <ProspectionDetail />
              </ProtectedRoute>
            } />

            {/* Routes pour la gestion des utilisateurs (admin seulement) */}
            <Route path="utilisateurs" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="utilisateurs/ajouter" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="utilisateurs/:id" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UserDetail />
              </ProtectedRoute>
            } />
            <Route path="utilisateurs/:id/modifier" element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UserForm isEditMode={true} />
              </ProtectedRoute>
            } />

            {/* Route pour le profil utilisateur (accessible à tous les utilisateurs) */}
            <Route path="profil" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />

            {/* Routes pour la gestion des fiches */}
            <Route path="fiches" element={
              <ProtectedRoute>
                <FileList />
              </ProtectedRoute>
            } />
            <Route path="fiches/ajouter" element={
              <ProtectedRoute>
                <FileForm />
              </ProtectedRoute>
            } />
            <Route path="fiches/:id" element={
              <ProtectedRoute>
                <FileDetail />
              </ProtectedRoute>
            } />
            <Route path="fiches/:id/modifier" element={
              <ProtectedRoute>
                <FileForm isEditMode={true} />
              </ProtectedRoute>
            } />
            <Route path="fiches/:id/historique" element={
              <ProtectedRoute>
                <FileHistory />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
