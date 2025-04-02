import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import fileService from '../services/fileService';
import userService from '../services/userService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    fiches: 0,
    utilisateurs: 0,
    recentFilesData: [],
    loading: true,
    error: null
  });

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les fiches récentes
        const filesResponse = await fileService.getAllFiles();
        const filesData = filesResponse.data || [];

        let utilisateursCount = 0;
        // Récupérer le nombre d'utilisateurs (admin seulement)
        if (isAdmin) {
          try {
            const usersResponse = await userService.getUsers();
            utilisateursCount = (usersResponse.data || []).length;
          } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
          }
        }

        setStats({
          fiches: filesData.length,
          utilisateurs: utilisateursCount,
          recentFilesData: filesData.slice(0, 5), // 5 dernières fiches
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: "Erreur lors du chargement des données"
        }));
      }
    };

    fetchData();
  }, [isAdmin]);

  if (stats.loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="my-4">Tableau de bord</h1>

      {stats.error && <Alert variant="danger">{stats.error}</Alert>}

      <Row className="mb-4">
        <Col md={isAdmin ? 6 : 12} lg={isAdmin ? 4 : 6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Fiches</Card.Title>
              <Card.Text className="display-4">{stats.fiches}</Card.Text>
              <Link to="/fiches" className="btn btn-sm btn-primary">
                Voir toutes les fiches
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {isAdmin && (
          <Col md={6} lg={4} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Utilisateurs</Card.Title>
                <Card.Text className="display-4">{stats.utilisateurs}</Card.Text>
                <Link to="/utilisateurs" className="btn btn-sm btn-primary">
                  Gérer les utilisateurs
                </Link>
              </Card.Body>
            </Card>
          </Col>
        )}

        <Col md={isAdmin ? 12 : 6} lg={isAdmin ? 4 : 6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Actions rapides</Card.Title>
              <div className="d-grid gap-2">
                <Link to="/fiches/ajouter" className="btn btn-outline-primary">
                  <i className="fas fa-plus-circle me-2"></i>
                  Nouvelle fiche
                </Link>
                {isAdmin && (
                  <Link to="/utilisateurs/ajouter" className="btn btn-outline-primary">
                    <i className="fas fa-user-plus me-2"></i>
                    Nouvel utilisateur
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mb-3">Fiches récentes</h2>
      <Row>
        {stats.recentFilesData.length > 0 ? (
          stats.recentFilesData.map((file) => (
            <Col md={6} lg={4} key={file.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{file.entreprise?.raisonSociale || "Sans nom"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Visite le {new Date(file.dateVisite).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>
                    {file.commentaires?.substring(0, 100) || "Pas de commentaire"}
                    {file.commentaires?.length > 100 ? "..." : ""}
                  </Card.Text>
                  <Link to={`/fiches/${file.id}`} className="btn btn-sm btn-info">
                    Voir détails
                  </Link>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    Créée le {new Date(file.dateCreation).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">
              Aucune fiche disponible.{' '}
              <Link to="/fiches/ajouter">Créer une nouvelle fiche</Link>
            </Alert>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard;
