import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import prospectionService from '../services/prospectionService';

const ProspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prospection, setProspection] = useState(null);
  const [possibleTransitions, setPossibleTransitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prospectionData = await prospectionService.getProspectionById(id);
        setProspection(prospectionData.fiche || prospectionData);

        const transitionsData = await prospectionService.getPossibleTransitions(id);
        setPossibleTransitions(transitionsData.transitions || []);

        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleTransitionClick = (transition) => {
    setSelectedTransition(transition);
    setShowTransitionModal(true);
  };

  const applyTransition = async () => {
    try {
      const result = await prospectionService.applyTransition(id, selectedTransition);
      setProspection(result.fiche);

      // Refresh possible transitions
      const transitionsData = await prospectionService.getPossibleTransitions(id);
      setPossibleTransitions(transitionsData.transitions || []);

      setShowTransitionModal(false);
    } catch (err) {
      setError('Erreur lors de l\'application de la transition');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'nouveau':
        return <Badge bg="primary">Nouveau</Badge>;
      case 'en_contact':
        return <Badge bg="info">En contact</Badge>;
      case 'rendez_vous':
        return <Badge bg="warning">Rendez-vous</Badge>;
      case 'proposition':
        return <Badge bg="secondary">Proposition</Badge>;
      case 'client':
        return <Badge bg="success">Client</Badge>;
      case 'perdu':
        return <Badge bg="danger">Perdu</Badge>;
      default:
        return <Badge bg="light" text="dark">{status}</Badge>;
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!prospection) {
    return <Alert variant="warning">Prospection non trouvée</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Détails de la prospection</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/prospection')}>
          <i className="fas fa-arrow-left me-2"></i> Retour
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="m-0">{prospection.nom}</h2>
          {getStatusBadge(prospection.statut)}
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Entreprise:</strong> {prospection.entreprise}</p>
              <p><strong>Email:</strong> {prospection.email || 'Non renseigné'}</p>
              <p><strong>Téléphone:</strong> {prospection.telephone || 'Non renseigné'}</p>
            </Col>
            <Col md={6}>
              <p><strong>Date de création:</strong> {new Date(prospection.dateCreation).toLocaleDateString()}</p>
              <p><strong>Dernière modification:</strong> {new Date(prospection.dateModification).toLocaleDateString()}</p>
              <p><strong>Secteur:</strong> {prospection.secteur || 'Non renseigné'}</p>
            </Col>
          </Row>

          <h5>Notes</h5>
          <p>{prospection.notes || 'Aucune note.'}</p>
        </Card.Body>
        <Card.Footer>
          <h5 className="mb-3">Actions disponibles</h5>
          {possibleTransitions.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {possibleTransitions.map((transition) => (
                <Button
                  key={transition}
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleTransitionClick(transition)}
                >
                  {transition.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aucune transition disponible.</p>
          )}
        </Card.Footer>
      </Card>

      {/* Modal de confirmation de transition */}
      <Modal show={showTransitionModal} onHide={() => setShowTransitionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer le changement d'état</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir appliquer la transition <strong>{selectedTransition.replace(/_/g, ' ')}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransitionModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={applyTransition}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProspectionDetail;
