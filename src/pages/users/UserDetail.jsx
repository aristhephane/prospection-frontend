import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Alert, Button } from 'react-bootstrap';
import userService from '../../services/userService';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        setUser(response.data);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'utilisateur');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleDeactivateUser = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deactivateUser(id);
      setUser({ ...user, actif: false });
      setError('');
    } catch (err) {
      setError('Erreur lors de la désactivation de l\'utilisateur');
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      navigate('/utilisateurs', {
        state: { message: 'Utilisateur supprimé avec succès' }
      });
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Alert variant="warning">Utilisateur non trouvé</Alert>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{user.nom} {user.prenom}</h1>
        <div>
          <Link to="/utilisateurs" className="btn btn-outline-secondary me-2">
            Retour à la liste
          </Link>
          <Link to={`/utilisateurs/${id}/modifier`} className="btn btn-warning me-2">
            Modifier
          </Link>
          {user.actif && (
            <Button variant="danger" onClick={handleDeactivateUser} className="me-2">
              Désactiver
            </Button>
          )}
          <Button variant="outline-danger" onClick={handleDeleteUser}>
            Supprimer
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Informations utilisateur</Card.Header>
            <Card.Body>
              <dl className="row">
                <dt className="col-sm-4">Nom</dt>
                <dd className="col-sm-8">{user.nom}</dd>

                <dt className="col-sm-4">Prénom</dt>
                <dd className="col-sm-8">{user.prenom}</dd>

                <dt className="col-sm-4">Email</dt>
                <dd className="col-sm-8">{user.email}</dd>

                <dt className="col-sm-4">Statut</dt>
                <dd className="col-sm-8">
                  <span className={`badge ${user.actif ? 'bg-success' : 'bg-danger'}`}>
                    {user.actif ? 'Actif' : 'Inactif'}
                  </span>
                </dd>

                <dt className="col-sm-4">Date de création</dt>
                <dd className="col-sm-8">
                  {new Date(user.dateCreation).toLocaleDateString()}
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Rôles et permissions</Card.Header>
            <Card.Body>
              <h5>Rôles</h5>
              <div className="mb-3">
                {user.roles.map(role => (
                  <Badge key={role} bg="info" className="me-2 mb-1">{role}</Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetail;
