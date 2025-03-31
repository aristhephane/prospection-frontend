import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Alert, Card } from 'react-bootstrap';
import fileService from '../../services/fileService';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fileService.getAllFiles();
        setFiles(response.data || []);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des fiches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

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

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Fiches entreprises</h1>
        <Link to="/fiches/ajouter" className="btn btn-success">
          <i className="fas fa-plus me-2"></i> Nouvelle fiche
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {files.length === 0 ? (
        <Alert variant="info">Aucune fiche trouvée</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Date de visite</th>
                  <th>Création</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>{file.entreprise?.raisonSociale || "N/A"}</td>
                    <td>{formatDate(file.dateVisite)}</td>
                    <td>{formatDate(file.dateCreation)}</td>
                    <td>
                      <span className={`badge ${file.statut === 'nouveau' ? 'bg-primary' :
                        file.statut === 'en_cours' ? 'bg-info' :
                          file.statut === 'termine' ? 'bg-success' : 'bg-secondary'
                        }`}>
                        {file.statut}
                      </span>
                    </td>
                    <td>
                      <Link to={`/fiches/${file.id}`} className="btn btn-sm btn-info me-1">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/fiches/${file.id}/modifier`} className="btn btn-sm btn-warning me-1">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <Link to={`/fiches/${file.id}/historique`} className="btn btn-sm btn-secondary">
                        <i className="fas fa-history"></i>
                      </Link>
                    </td>
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

export default FileList;
