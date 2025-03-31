import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStatistics();
        setStats(response);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h1 className="mb-4">Tableau de bord</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total des prospections</Card.Title>
              <h2 className="display-4 text-primary">{stats?.totalProspections || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Prospections en cours</Card.Title>
              <h2 className="display-4 text-info">{stats?.prospectionsEnCours || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Prospections converties</Card.Title>
              <h2 className="display-4 text-success">{stats?.prospectionsConverties || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Autres statistiques ici */}
    </div>
  );
};

export default Dashboard;
