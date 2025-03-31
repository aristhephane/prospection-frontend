import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ConnectionDiagnostics from '../components/ConnectionDiagnostics'; // Importer le composant diagnostic

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Important: empêche le formulaire HTML standard de soumettre
    try {
      setError('');
      setDebugInfo(null);
      setLoading(true);

      console.log("Tentative de connexion avec:", { email });

      // Appel de la fonction login avec les identifiants
      const userData = await login({ email, password });
      console.log("Connexion réussie, données utilisateur:", userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Redirection si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: '450px' }} className="shadow">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Connexion</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez votre email"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Entrez votre mot de passe"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </Form>

          {debugInfo && (
            <div className="mt-4">
              <details>
                <summary className="text-muted">Informations de débogage</summary>
                <pre className="mt-2 bg-light p-2" style={{ fontSize: '0.8rem', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Ajouter le composant de diagnostic */}
          <ConnectionDiagnostics />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
