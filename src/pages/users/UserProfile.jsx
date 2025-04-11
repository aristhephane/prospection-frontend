import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import userService from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
  const { user: authUser, refreshToken } = useAuth();

  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getCurrentUserProfile();

        // Utiliser une mise à jour fonctionnelle pour éviter la dépendance manquante
        setUser(prevUser => ({
          ...prevUser,
          nom: response.data.nom,
          prenom: response.data.prenom,
          email: response.data.email
        }));

        setError('');
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
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

    // Vérifier que les mots de passe correspondent
    if (user.newPassword && user.newPassword !== user.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await userService.updateProfile({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        currentPassword: user.currentPassword,
        newPassword: user.newPassword
      });

      // Réinitialiser les champs de mot de passe après mise à jour
      setUser({
        ...user,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess('Votre profil a été mis à jour avec succès');

      // Rafraîchir le token pour refléter les changements
      await refreshToken();
    } catch (err) {
      setError(`Erreur lors de la mise à jour du profil : ${err.message}`);
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
      <h1 className="mb-4">Mon profil</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="nom">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le nom est obligatoire
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="prenom">
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="prenom"
                    value={user.prenom}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Le prénom est obligatoire
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Un email valide est requis
              </Form.Control.Feedback>
            </Form.Group>

            <hr className="my-4" />
            <h5>Changer votre mot de passe</h5>

            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label>Mot de passe actuel</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={user.currentPassword}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={user.newPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirmez le nouveau mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Mise à jour...
                </>
              ) : (
                'Mettre à jour mon profil'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;
