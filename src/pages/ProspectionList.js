import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import prospectionService from '../services/prospectionService';

const ProspectionList = () => {
  const [prospections, setProspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProspections = async () => {
      try {
        setLoading(true);
        const response = await prospectionService.getAllProspections();
        setProspections(response.data || []);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des prospections');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProspections();
  }, []);

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Liste des prospections</h1>
        <Button as={Link} to="/prospection/new" variant="primary">
          <i className="fas fa-plus me-2"></i> Nouvelle prospection
        </Button>
      </div>

      {prospections.length === 0 ? (
        <Alert variant="info">Aucune prospection trouvée.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Entreprise</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prospections.map((prospection) => (
              <tr key={prospection.id}>
                <td>{prospection.id}</td>
                <td>{prospection.nom}</td>
                <td>{prospection.entreprise}</td>
                <td>{getStatusBadge(prospection.statut)}</td>
                <td>{new Date(prospection.dateCreation).toLocaleDateString()}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/prospection/${prospection.id}`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProspectionList;
