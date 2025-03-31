import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner, Card, Badge } from 'react-bootstrap';
import authService from '../services/authService';

const ConnectionDiagnostics = () => {
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [configInfo, setConfigInfo] = useState(null);
  const [expandedView, setExpandedView] = useState(false);

  // Récupération des informations de configuration au chargement
  useEffect(() => {
    const fetchConfigInfo = async () => {
      try {
        const info = await authService.getDebugInfo();
        setConfigInfo(info);
      } catch (error) {
        console.error("Erreur lors de la récupération des infos de configuration:", error);
      }
    };

    fetchConfigInfo();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Vérifier la connexion API
      const apiResult = await authService.testApiConnection();

      // Récupérer à nouveau les informations de configuration
      const configData = await authService.getDebugInfo();
      setConfigInfo(configData);

      // Vérifier si le navigateur bloque les cookies tiers
      const cookiesEnabled = navigator.cookieEnabled;

      // Tester le CORS
      let corsTest = { success: false, error: "Non testé" };
      try {
        const corsResponse = await fetch(configData.apiUrl + '/auth-status', {
          method: 'OPTIONS',
          credentials: 'include',
        });
        corsTest = {
          success: corsResponse.ok,
          status: corsResponse.status,
        };
      } catch (e) {
        corsTest = { success: false, error: e.message };
      }

      setDiagnosticResult({
        api: apiResult,
        config: configData,
        browser: {
          cookiesEnabled,
          userAgent: navigator.userAgent,
          language: navigator.language,
        },
        cors: corsTest,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDiagnosticResult({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Diagnostics de connexion</h5>
        <Button
          variant="link"
          size="sm"
          onClick={() => setExpandedView(!expandedView)}
        >
          {expandedView ? 'Réduire' : 'Détails avancés'}
        </Button>
      </div>

      {configInfo && expandedView && (
        <Alert variant="info" className="mt-2 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <span><strong>API URL:</strong> {configInfo.apiUrl}</span>
            <Badge bg={configInfo.environment === 'production' ? 'danger' : 'warning'}>
              {configInfo.environment}
            </Badge>
          </div>
          <div className="mt-1">
            <strong>Token:</strong> {configInfo.hasToken ?
              <Badge bg="success">Présent</Badge> :
              <Badge bg="danger">Absent</Badge>}
          </div>
          <div className="mt-1">
            <strong>Utilisateur:</strong> {configInfo.hasUser ?
              <Badge bg="success">{configInfo.userEmail}</Badge> :
              <Badge bg="danger">Non connecté</Badge>}
          </div>
        </Alert>
      )}

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={runDiagnostics}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            {' '}Test en cours...
          </>
        ) : 'Tester la connexion API'}
      </Button>

      {diagnosticResult && (
        <Card className="mt-2">
          <Card.Body>
            <Alert variant={diagnosticResult.api?.success ? 'success' : 'danger'}>
              {diagnosticResult.api?.success ? 'Connexion API réussie!' : 'Échec de la connexion API'}
            </Alert>

            {expandedView && (
              <div className="mt-2">
                <strong>Détails complets:</strong>
                <pre style={{ fontSize: '0.8rem', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(diagnosticResult, null, 2)}
                </pre>
              </div>
            )}

            {!expandedView && diagnosticResult.api?.error && (
              <Alert variant="warning" className="mt-2">
                <strong>Erreur:</strong> {diagnosticResult.api.error}
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ConnectionDiagnostics;
