import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge, Spinner, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import prospectionService from '../services/prospectionService';
import { FaSearch, FaPlus, FaEye } from 'react-icons/fa';

const ProspectionList = () => {
  const [prospections, setProspections] = useState([]);
  const [filteredProspections, setFilteredProspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProspections = async () => {
      try {
        setLoading(true);
        const response = await prospectionService.getAllProspections();

        if (response.success && Array.isArray(response.fiches)) {
          setProspections(response.fiches);
          setFilteredProspections(response.fiches);
        } else {
          console.error('Format de réponse incorrect:', response);
          setError('Format de réponse incorrect. Veuillez réessayer.');
          setProspections([]);
          setFilteredProspections([]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des prospections');
        console.error(err);
        setProspections([]);
        setFilteredProspections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProspections();
  }, []);

  // Filtrer les prospections quand le terme de recherche change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProspections(prospections);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = prospections.filter(prospection => {
        return (
          (prospection.entreprise?.raisonSociale?.toLowerCase().includes(lowercasedFilter)) ||
          (prospection.commentaires?.toLowerCase().includes(lowercasedFilter)) ||
          (prospection.statut?.toLowerCase().includes(lowercasedFilter))
        );
      });
      setFilteredProspections(filtered);
    }
  }, [searchTerm, prospections]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col md={8}>
          <h1>Liste des prospections</h1>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button as={Link} to="/prospection/new" variant="primary">
            <FaPlus className="me-2" /> Nouvelle prospection
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
      </Row>

      {filteredProspections.length === 0 ? (
        <Alert variant="info">Aucune prospection trouvée.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Entreprise</th>
              <th>Date visite</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProspections.map((prospection) => (
              <tr key={prospection.id}>
                <td>{prospection.id}</td>
                <td>{prospection.entreprise?.raisonSociale || 'Non spécifiée'}</td>
                <td>{new Date(prospection.dateVisite).toLocaleDateString('fr-FR')}</td>
                <td>{getStatusBadge(prospection.statut)}</td>
                <td>{new Date(prospection.dateCreation).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/prospection/${prospection.id}`}
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    <FaEye className="me-1" /> Détails
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProspectionList;
