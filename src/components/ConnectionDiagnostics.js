import React, { useState, useEffect } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import authService from '../services/authService';

/**
 * Composant pour diagnostiquer les problèmes de connexion à l'API
 */
const ConnectionDiagnostics = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosisResults, setDiagnosisResults] = useState({
    apiConnection: null,
    cookiesEnabled: null,
    corsConfig: null,
    authEndpoint: null,
    loading: false
  });

  const runDiagnostics = async () => {
    setDiagnosisResults({
      ...diagnosisResults,
      loading: true
    });

    try {
      // Test de connexion à l'API
      const apiTest = await authService.testApiConnection();

      // Test des cookies
      const cookiesTest = testCookiesEnabled();

      // Test CORS
      const corsTest = await testCorsConfiguration();

      // Test endpoint d'authentification
      const authTest = await testAuthEndpoint();

      setDiagnosisResults({
        apiConnection: apiTest,
        cookiesEnabled: cookiesTest,
        corsConfig: corsTest,
        authEndpoint: authTest,
        loading: false
      });
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setDiagnosisResults({
        ...diagnosisResults,
        error: error.message,
        loading: false
      });
    }
  };

  // Test si les cookies sont activés dans le navigateur
  const testCookiesEnabled = () => {
    const cookiesEnabled = navigator.cookieEnabled;

    return {
      success: cookiesEnabled,
      message: cookiesEnabled
        ? 'Les cookies sont activés dans votre navigateur'
        : 'Les cookies sont désactivés - ils sont requis pour l\'authentification',
      details: {
        userAgent: navigator.userAgent,
        cookiesEnabled: cookiesEnabled
      }
    };
  };

  // Test de la configuration CORS
  const testCorsConfiguration = async () => {
    try {
      // Tente une requête OPTIONS vers l'API pour tester CORS
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://upjv-prospection-vps.amourfoot.fr/api'}/auth-test`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin
        },
        credentials: 'include'  // Important pour les cookies
      });

      const corsHeadersPresent = response.headers.get('Access-Control-Allow-Origin') !== null;
      const credentialsAllowed = response.headers.get('Access-Control-Allow-Credentials') === 'true';

      return {
        success: response.ok && corsHeadersPresent && credentialsAllowed,
        status: response.status,
        message: corsHeadersPresent && credentialsAllowed
          ? 'Configuration CORS correcte avec support des cookies'
          : 'Problème de configuration CORS pour les cookies',
        headers: {
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
          'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du test CORS',
        error: error.message
      };
    }
  };

  // Test de l'endpoint d'authentification
  const testAuthEndpoint = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_AUTH_URL || 'https://upjv-prospection-vps.amourfoot.fr/api/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin
        },
        credentials: 'include'  // Important pour les cookies
      });

      return {
        success: response.ok,
        status: response.status,
        message: response.ok
          ? 'Endpoint d\'authentification accessible'
          : 'Problème d\'accès à l\'endpoint d\'authentification',
        headers: {
          'Content-Type': response.headers.get('Content-Type'),
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du test de l\'endpoint d\'authentification',
        error: error.message
      };
    }
  };

  useEffect(() => {
    // Si l'utilisateur ouvre le diagnostic, lance automatiquement les tests
    if (showDiagnostics && !diagnosisResults.apiConnection && !diagnosisResults.loading) {
      runDiagnostics();
    }
  }, [showDiagnostics]);

  const getStatusColor = (status) => {
    return status?.success ? 'success' : 'danger';
  };

  return (
    <div className="mt-4">
      <Button
        variant="link"
        size="sm"
        onClick={() => setShowDiagnostics(!showDiagnostics)}
        className="text-muted p-0"
      >
        {showDiagnostics ? 'Masquer le diagnostic' : 'Diagnostic de connexion'}
      </Button>

      {showDiagnostics && (
        <Card className="mt-2">
          <Card.Body>
            <h6 className="mb-3">Diagnostic de connexion à l'API</h6>

            {diagnosisResults.loading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2 small">Test des connexions en cours...</p>
              </div>
            ) : (
              <>
                <ListGroup variant="flush" className="small">
                  <ListGroup.Item className={`d-flex justify-content-between align-items-start ${diagnosisResults.apiConnection ? `text-${getStatusColor(diagnosisResults.apiConnection)}` : ''}`}>
                    <div>Connexion à l'API</div>
                    <div>{diagnosisResults.apiConnection?.success ? '✓' : '✗'}</div>
                  </ListGroup.Item>

                  <ListGroup.Item className={`d-flex justify-content-between align-items-start ${diagnosisResults.cookiesEnabled ? `text-${getStatusColor(diagnosisResults.cookiesEnabled)}` : ''}`}>
                    <div>Cookies activés</div>
                    <div>{diagnosisResults.cookiesEnabled?.success ? '✓' : '✗'}</div>
                  </ListGroup.Item>

                  <ListGroup.Item className={`d-flex justify-content-between align-items-start ${diagnosisResults.corsConfig ? `text-${getStatusColor(diagnosisResults.corsConfig)}` : ''}`}>
                    <div>Configuration CORS</div>
                    <div>{diagnosisResults.corsConfig?.success ? '✓' : '✗'}</div>
                  </ListGroup.Item>

                  <ListGroup.Item className={`d-flex justify-content-between align-items-start ${diagnosisResults.authEndpoint ? `text-${getStatusColor(diagnosisResults.authEndpoint)}` : ''}`}>
                    <div>Endpoint d'authentification</div>
                    <div>{diagnosisResults.authEndpoint?.success ? '✓' : '✗'}</div>
                  </ListGroup.Item>
                </ListGroup>

                {(diagnosisResults.apiConnection || diagnosisResults.corsConfig || diagnosisResults.cookiesEnabled || diagnosisResults.authEndpoint) && (
                  <div className="mt-3">
                    <details>
                      <summary className="text-muted small">Détails du diagnostic</summary>
                      <pre className="bg-light p-2 mt-2" style={{ fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto' }}>
                        {JSON.stringify({
                          api: diagnosisResults.apiConnection,
                          cookies: diagnosisResults.cookiesEnabled,
                          cors: diagnosisResults.corsConfig,
                          auth: diagnosisResults.authEndpoint
                        }, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                <div className="mt-3">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={runDiagnostics}
                    disabled={diagnosisResults.loading}
                  >
                    Relancer le diagnostic
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ConnectionDiagnostics;
