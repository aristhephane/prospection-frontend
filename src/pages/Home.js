import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

// Composants fictifs pour simuler les données
const DashboardStats = () => {
  // État local pour les statistiques
  const [stats, setStats] = useState({
    totalFiches: 0,
    totalEntreprises: 0,
    fichesRecentes: 0,
    actionsNecessaires: 0
  });

  // Simuler un chargement des données
  useEffect(() => {
    // Dans une application réelle, cela serait un appel API
    setTimeout(() => {
      setStats({
        totalFiches: 128,
        totalEntreprises: 63,
        fichesRecentes: 12,
        actionsNecessaires: 5
      });
    }, 800);
  }, []);

  return (
    <Row className="mt-4">
      <Col md={3}>
        <Card className="text-center mb-4 shadow-sm border-0" bg="primary" text="white">
          <Card.Body>
            <h2>{stats.totalFiches}</h2>
            <Card.Text>Fiches totales</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center mb-4 shadow-sm border-0" bg="success" text="white">
          <Card.Body>
            <h2>{stats.totalEntreprises}</h2>
            <Card.Text>Entreprises</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center mb-4 shadow-sm border-0" bg="info" text="white">
          <Card.Body>
            <h2>{stats.fichesRecentes}</h2>
            <Card.Text>Fiches récentes</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center mb-4 shadow-sm border-0" bg="warning" text="white">
          <Card.Body>
            <h2>{stats.actionsNecessaires}</h2>
            <Card.Text>Actions nécessaires</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const RecentActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement des données
    setTimeout(() => {
      setActivities([
        { id: 1, type: 'creation', date: '2025-04-01', user: 'Jean Dupont', entity: 'Fiche #127', description: 'Nouvelle fiche de prospection' },
        { id: 2, type: 'modification', date: '2025-03-31', user: 'Marie Martin', entity: 'Entreprise #45', description: 'Mise à jour des coordonnées' },
        { id: 3, type: 'validation', date: '2025-03-30', user: 'Lucas Bernard', entity: 'Fiche #120', description: 'Validation de la fiche' },
        { id: 4, type: 'creation', date: '2025-03-29', user: 'Sophia Lefebvre', entity: 'Entreprise #62', description: 'Nouvelle entreprise ajoutée' },
        { id: 5, type: 'rapport', date: '2025-03-28', user: 'Thomas Dubois', entity: 'Listing #23', description: 'Génération rapport trimestriel' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <ListGroup variant="flush">
      {activities.map(activity => (
        <ListGroup.Item key={activity.id} className="d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{activity.entity}</div>
            {activity.description} - <span className="text-muted">par {activity.user}</span>
          </div>
          <div className="text-muted small">
            {new Date(activity.date).toLocaleDateString('fr-FR')}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Déterminer le message d'accueil en fonction de l'heure
    const hour = new Date().getHours();
    let message = '';

    if (hour < 12) {
      message = 'Bonjour';
    } else if (hour < 18) {
      message = 'Bon après-midi';
    } else {
      message = 'Bonsoir';
    }

    setWelcomeMessage(message);
  }, []);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5">
            {welcomeMessage}, {user?.prenom || 'Utilisateur'} !
          </h1>
          <p className="lead text-muted">
            Bienvenue sur le système de gestion de prospection de l'UPJV.
          </p>
        </Col>
      </Row>

      <Alert variant="info" className="d-flex align-items-center">
        <i className="fas fa-info-circle me-3 fs-4"></i>
        <div>
          Découvrez les <strong>nouvelles fonctionnalités</strong> de gestion des fiches et profitez des tableaux de bord améliorés.
        </div>
      </Alert>

      {/* Statistiques */}
      <DashboardStats />

      <Row className="mt-4">
        <Col md={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header as="h5" className="bg-white">
              <i className="fas fa-history me-2"></i>
              Activités récentes
            </Card.Header>
            <Card.Body className="p-0">
              <RecentActivityList />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header as="h5" className="bg-white">
              <i className="fas fa-bolt me-2"></i>
              Accès rapide
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col xs={6}>
                  <Button as={Link} to="/fiches" variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center">
                    <i className="fas fa-folder-open fs-3 mb-2"></i>
                    Consulter les fiches
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button as={Link} to="/fiches/ajouter" variant="outline-success" className="w-100 py-3 d-flex flex-column align-items-center">
                    <i className="fas fa-plus-circle fs-3 mb-2"></i>
                    Nouvelle fiche
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button as={Link} to="/rapports" variant="outline-info" className="w-100 py-3 d-flex flex-column align-items-center">
                    <i className="fas fa-chart-bar fs-3 mb-2"></i>
                    Rapports
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button as={Link} to="/prospection" variant="outline-secondary" className="w-100 py-3 d-flex flex-column align-items-center">
                    <i className="fas fa-search fs-3 mb-2"></i>
                    Prospection
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 