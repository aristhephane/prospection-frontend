import React, { useState } from 'react';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';
import authService from '../services/authService';

const ConnectionDiagnostics = () => {
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      // Vérifier que authService.testApiConnection est bien une fonction
      if (typeof authService.testApiConnection === 'function') {
        const result = await authService.testApiConnection();
        setDiagnosticResult(result);
      } else {
        setDiagnosticResult({
          success: false,
          error: 'authService.testApiConnection n\'est pas une fonction',
        });
      }
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
      <h5>Diagnostics de connexion</h5>
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
            <Alert variant={diagnosticResult.success ? 'success' : 'danger'}>
              {diagnosticResult.success ? 'Connexion réussie!' : 'Échec de la connexion'}
            </Alert>
            <div className="mt-2">
              <strong>Détails:</strong>
              <pre style={{ fontSize: '0.8rem', maxHeight: '200px', overflow: 'auto' }}>
                {JSON.stringify(diagnosticResult, null, 2)}
              </pre>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ConnectionDiagnostics;
