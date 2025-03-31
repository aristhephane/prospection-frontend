import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Alert, Button } from 'react-bootstrap';
import fileService from '../../services/fileService';

const FileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        setLoading(true);
        const response = await fileService.getFileById(id);
        setFile(response.data);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des détails de la fiche');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) {
      return;
    }

    try {
      await fileService.deleteFile(id);
      navigate('/fiches', {
        state: { message: 'Fiche supprimée avec succès' }
      });
    } catch (err) {
      setError('Erreur lors de la suppression de la fiche');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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

  if (!file) {
    return <Alert variant="warning">Fiche non trouvée</Alert>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Détail de la fiche</h1>
        <div>
          <Link to="/fiches" className="btn btn-outline-secondary me-2">
            Retour à la liste
          </Link>
          <Link to={`/fiches/${id}/modifier`} className="btn btn-warning me-2">
            Modifier
          </Link>
          <Link to={`/fiches/${id}/historique`} className="btn btn-info me-2">
            Historique
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h4 className="mb-0">Informations de l'entreprise</h4>
            </Card.Header>
            <Card.Body>
              <dl className="row">
                <dt className="col-sm-4">Entreprise</dt>
                <dd className="col-sm-8">{file.entreprise?.raisonSociale || "N/A"}</dd>

                <dt className="col-sm-4">Secteur</dt>
                <dd className="col-sm-8">{file.entreprise?.secteurActivite || "N/A"}</dd>

                <dt className="col-sm-4">Téléphone</dt>
                <dd className="col-sm-8">{file.entreprise?.telephone || "N/A"}</dd>

                <dt className="col-sm-4">Email</dt>
                <dd className="col-sm-8">{file.entreprise?.email || "N/A"}</dd>

                <dt className="col-sm-4">Site Web</dt>
                <dd className="col-sm-8">
                  {file.entreprise?.siteWeb ? (
                    <a href={file.entreprise.siteWeb} target="_blank" rel="noopener noreferrer">
                      {file.entreprise.siteWeb}
                    </a>
                  ) : "N/A"}
                </dd>

                <dt className="col-sm-4">Adresse</dt>
                <dd className="col-sm-8">{file.entreprise?.adresse || "N/A"}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Détails de la visite</h4>
            </Card.Header>
            <Card.Body>
              <dl className="row">
                <dt className="col-sm-4">Date de visite</dt>
                <dd className="col-sm-8">{formatDate(file.dateVisite)}</dd>

                <dt className="col-sm-4">Statut</dt>
                <dd className="col-sm-8">
                  <span className={`badge ${file.statut === 'nouveau' ? 'bg-primary' :
                      file.statut === 'en_cours' ? 'bg-info' :
                        file.statut === 'termine' ? 'bg-success' : 'bg-secondary'
                    }`}>
                    {file.statut}
                  </span>
                </dd>

                <dt className="col-sm-4">Création</dt>
                <dd className="col-sm-8">{formatDate(file.dateCreation)}</dd>

                <dt className="col-sm-4">Dernière modification</dt>
                <dd className="col-sm-8">{formatDate(file.dateModification)}</dd>
              </dl>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4 className="mb-0">Commentaires</h4>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">{file.commentaires || "Aucun commentaire."}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FileDetail;
