import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import userService from '../../services/userService';

const UserForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: []
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Récupérer les rôles disponibles
        const rolesResponse = await userService.getRoles();
        setAvailableRoles(rolesResponse.data);

        // Si en mode édition, récupérer les détails de l'utilisateur
        if (isEditMode && id) {
          const userResponse = await userService.getUserById(id);
          // Ne pas afficher les champs de mot de passe pour l'édition
          setUser({
            ...userResponse.data,
            password: '',
            confirmPassword: ''
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
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setUser(prevState => ({
        ...prevState,
        roles: [...prevState.roles, value]
      }));
    } else {
      setUser(prevState => ({
        ...prevState,
        roles: prevState.roles.filter(role => role !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Vérifier que les mots de passe correspondent
    if ((!isEditMode || user.password) && user.password !== user.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await userService.updateUser(id, user);
        navigate(`/utilisateurs/${id}`, {
          state: { message: 'Utilisateur modifié avec succès' }
        });
      } else {
        const response = await userService.createUser(user);
        navigate(`/utilisateurs/${response.data.id}`, {
          state: { message: 'Utilisateur créé avec succès' }
        });
      }
    } catch (err) {
      setError(`Erreur lors de ${isEditMode ? 'la modification' : 'la création'} de l'utilisateur: ${err.message}`);
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
      <h1 className="mb-4">{isEditMode ? 'Modifier' : 'Créer'} un utilisateur</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="nom">
                  <Form.Label>Nom *</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleChange}
                    placeholder="Nom de l'utilisateur"
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nom est obligatoire
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="prenom">
                  <Form.Label>Prénom *</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="prenom"
                    value={user.prenom}
                    onChange={handleChange}
                    placeholder="Prénom de l'utilisateur"
                  />
                  <Form.Control.Feedback type="invalid">
                    Le prénom est obligatoire
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
              />
              <Form.Control.Feedback type="invalid">
                Veuillez entrer un email valide
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>{isEditMode ? 'Nouveau mot de passe' : 'Mot de passe *'}</Form.Label>
                  <Form.Control
                    required={!isEditMode}
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder={isEditMode ? "Laissez vide pour ne pas changer" : "Mot de passe"}
                  />
                  <Form.Control.Feedback type="invalid">
                    {isEditMode ? '' : 'Le mot de passe est obligatoire'}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirmer le mot de passe {isEditMode ? '' : '*'}</Form.Label>
                  <Form.Control
                    required={!isEditMode}
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmez le mot de passe"
                  />
                  <Form.Control.Feedback type="invalid">
                    {isEditMode ? '' : 'La confirmation du mot de passe est obligatoire'}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Rôles *</Form.Label>
              {availableRoles.map(role => (
                <Form.Check
                  key={role.id || role.nom}
                  type="checkbox"
                  id={`role-${role.id || role.nom}`}
                  label={role.description || role.nom}
                  value={role.nom}
                  checked={user.roles.includes(role.nom)}
                  onChange={handleRoleChange}
                  className="mb-2"
                />
              ))}
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
                onClick={() => navigate('/utilisateurs')}
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

export default UserForm;
