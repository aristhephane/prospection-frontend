import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge, Alert, Modal, Container, Spinner } from 'react-bootstrap';
import prospectionService from '../services/prospectionService';
import { FaArrowLeft, FaHistory, FaEdit, FaTrashAlt } from 'react-icons/fa';

const ProspectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prospection, setProspection] = useState(null);
  const [possibleTransitions, setPossibleTransitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await prospectionService.getProspectionById(id);

        if (response.success && response.fiche) {
          setProspection(response.fiche);

          // Récupérer les transitions possibles
          try {
            const transitionsResponse = await prospectionService.getPossibleTransitions(id);
            if (transitionsResponse.success && Array.isArray(transitionsResponse.transitions)) {
              setPossibleTransitions(transitionsResponse.transitions);
            }
          } catch (err) {
            console.error('Erreur lors de la récupération des transitions:', err);
            setPossibleTransitions([]);
          }

          setError('');
        } else {
          console.error('Format de réponse incorrect:', response);
          setError('Erreur de chargement des données de la fiche');
        }
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
      setLoading(true);
      const result = await prospectionService.applyTransition(id, selectedTransition);

      if (result.success && result.fiche) {
        setProspection(result.fiche);

        // Rafraîchir les transitions possibles
        const transitionsResponse = await prospectionService.getPossibleTransitions(id);
        if (transitionsResponse.success) {
          setPossibleTransitions(transitionsResponse.transitions || []);
        }
      } else {
        throw new Error(result.message || 'Erreur lors de l\'application de la transition');
      }
    } catch (err) {
      setError('Erreur lors de l\'application de la transition');
      console.error(err);
    } finally {
      setLoading(false);
      setShowTransitionModal(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await prospectionService.deleteProspection(id);

      if (result.success) {
        navigate('/fiches');
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la fiche');
      console.error(err);
      setLoading(false);
    }
    setShowDeleteModal(false);
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
      <Container className="mt-4">
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!prospection) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Fiche non trouvée</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Détails de la fiche</h1>
        <div>
          <Button variant="outline-secondary" onClick={() => navigate('/fiches')} className="me-2">
            <FaArrowLeft className="me-2" /> Retour
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate(`/fiches/${id}/historique`)}
            className="me-2"
          >
            <FaHistory className="me-2" /> Historique
          </Button>
          <Button
            variant="outline-success"
            onClick={() => navigate(`/fiches/${id}/modifier`)}
            className="me-2"
          >
            <FaEdit className="me-2" /> Modifier
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrashAlt className="me-2" /> Supprimer
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2 className="m-0">Fiche N°{prospection.id}</h2>
          {getStatusBadge(prospection.statut)}
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong>Entreprise :</strong> {prospection.entreprise?.raisonSociale}</p>
              <p><strong>Date de visite :</strong> {new Date(prospection.dateVisite).toLocaleDateString('fr-FR')}</p>
              {prospection.dateVisiteSuivante && (
                <p><strong>Prochaine visite prévue :</strong> {new Date(prospection.dateVisiteSuivante).toLocaleDateString('fr-FR')}</p>
              )}
              <p><strong>Niveau d'intérêt :</strong> {prospection.niveauInteret || 'Non évalué'}/5</p>
            </Col>
            <Col md={6}>
              <p><strong>Date de création :</strong> {new Date(prospection.dateCreation).toLocaleDateString('fr-FR')}</p>
              <p><strong>Dernière modification :</strong> {new Date(prospection.dateModification).toLocaleDateString('fr-FR')}</p>
              <p><strong>Créé par :</strong> {prospection.creePar?.prenom} {prospection.creePar?.nom}</p>
              {prospection.modifiePar && (
                <p><strong>Modifié par :</strong> {prospection.modifiePar?.prenom} {prospection.modifiePar?.nom}</p>
              )}
            </Col>
          </Row>

          <h5>Commentaires</h5>
          <p>{prospection.commentaires || 'Aucun commentaire.'}</p>

          {prospection.resultatsVisite && (
            <>
              <h5>Résultats de la visite</h5>
              <p>{prospection.resultatsVisite}</p>
            </>
          )}

          {prospection.besoinsExprimes && (
            <>
              <h5>Besoins exprimés</h5>
              <p>{prospection.besoinsExprimes}</p>
            </>
          )}

          {prospection.actionsASuivre && (
            <>
              <h5>Actions à suivre</h5>
              <p>{prospection.actionsASuivre}</p>
            </>
          )}
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
                  className="me-2 mb-2"
                >
                  {transition.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aucune transition disponible pour l'état actuel.</p>
          )}
        </Card.Footer>
      </Card>

      {/* Modal de confirmation de transition */}
      <Modal show={showTransitionModal} onHide={() => setShowTransitionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer le changement d'état</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir passer la fiche à l'état <strong>{selectedTransition.replace(/_/g, ' ')}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransitionModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={applyTransition} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Confirmer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer définitivement cette fiche ? Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProspectionDetail;
