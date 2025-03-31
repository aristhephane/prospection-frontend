import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Table, Alert } from 'react-bootstrap';
import fileService from '../../services/fileService';

const FileHistory = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les détails de la fiche
        const fileResponse = await fileService.getFileById(id);
        setFile(fileResponse.data);

        // Récupérer l'historique de la fiche
        const historyResponse = await fileService.getFileHistory(id);
        setHistory(historyResponse.data || []);

        setError('');
      } catch (err) {
        setError("Erreur lors du chargement de l'historique");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
        <h1>Historique des modifications</h1>
        <Link to={`/fiches/${id}`} className="btn btn-outline-secondary">
          Retour aux détails
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Header>Fiche: {file.entreprise?.raisonSociale}</Card.Header>
        <Card.Body>
          <dl className="row">
            <dt className="col-sm-3">Date de visite</dt>
            <dd className="col-sm-9">{formatDate(file.dateVisite)}</dd>

            <dt className="col-sm-3">Créée le</dt>
            <dd className="col-sm-9">{formatDate(file.dateCreation)}</dd>

            <dt className="col-sm-3">Statut</dt>
            <dd className="col-sm-9">
              <span className={`badge ${file.statut === 'nouveau' ? 'bg-primary' :
                  file.statut === 'en_cours' ? 'bg-info' :
                    file.statut === 'termine' ? 'bg-success' : 'bg-secondary'
                }`}>
                {file.statut}
              </span>
            </dd>
          </dl>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {history.length === 0 ? (
        <Alert variant="info">Aucune modification enregistrée pour cette fiche</Alert>
      ) : (
        <Card>
          <Card.Header>Liste des modifications</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Utilisateur</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.dateModification)}</td>
                    <td>{item.utilisateur?.nom} {item.utilisateur?.prenom}</td>
                    <td>{item.detailsModification}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default FileHistory;
