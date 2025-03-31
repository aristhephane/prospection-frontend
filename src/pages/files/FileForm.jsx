import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import fileService from '../../services/fileService';

const FileForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState({
    dateVisite: new Date().toISOString().slice(0, 10),
    commentaires: '',
    entreprise: ''
  });
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer la liste des entreprises
        const enterprisesResponse = await fileService.getEnterprises();
        setEnterprises(enterprisesResponse.data || []);

        // Si en mode édition, récupérer les détails de la fiche
        if (isEditMode && id) {
          const fileResponse = await fileService.getFileById(id);
          const fileData = fileResponse.data;

          setFile({
            ...fileData,
            dateVisite: new Date(fileData.dateVisite).toISOString().slice(0, 10),
            entreprise: fileData.entreprise?.id || ''
          });
        }

        setError('');
      } catch (err) {
        setError(`Erreur lors du chargement des données: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await fileService.updateFile(id, file);
        navigate(`/fiches/${id}`, {
          state: { message: 'Fiche modifiée avec succès' }
        });
      } else {
        const response = await fileService.createFile(file);
        navigate(`/fiches/${response.data.id}`, {
          state: { message: 'Fiche créée avec succès' }
        });
      }
    } catch (err) {
      setError(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de la fiche: ${err.message}`);
      console.error(err);
    } finally {
      setSubmitting(false);
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

  return (
    <Container>
      <h1 className="mb-4">{isEditMode ? 'Modifier' : 'Créer'} une fiche</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="entreprise">
              <Form.Label>Entreprise *</Form.Label>
              <Form.Select
                required
                name="entreprise"
                value={file.entreprise}
                onChange={handleChange}
              >
                <option value="">Sélectionner une entreprise</option>
                {enterprises.map((enterprise) => (
                  <option key={enterprise.id} value={enterprise.id}>
                    {enterprise.raisonSociale}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Veuillez sélectionner une entreprise
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="dateVisite">
              <Form.Label>Date de visite *</Form.Label>
              <Form.Control
                required
                type="date"
                name="dateVisite"
                value={file.dateVisite}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Veuillez indiquer une date de visite
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="commentaires">
              <Form.Label>Commentaires</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="commentaires"
                value={file.commentaires || ''}
                onChange={handleChange}
                placeholder="Ajoutez des commentaires..."
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? 'Modification...' : 'Création...'}
                  </>
                ) : (
                  isEditMode ? 'Modifier' : 'Créer'
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/fiches')}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FileForm;
