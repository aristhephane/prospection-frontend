import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, Alert, Card } from 'react-bootstrap';
import userService from '../../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers();
        setUsers(response.data);
        setError('');
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeactivateUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deactivateUser(id);
      // Mettre à jour la liste des utilisateurs
      setUsers(users.map(user =>
        user.id === id ? { ...user, actif: false } : user
      ));
      setError('');
    } catch (err) {
      setError('Erreur lors de la désactivation de l\'utilisateur');
      console.error(err);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des utilisateurs</h1>
        <Link to="/utilisateurs/ajouter" className="btn btn-success">
          <i className="fas fa-plus me-2"></i> Nouvel utilisateur
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {users.length === 0 ? (
        <Alert variant="info">Aucun utilisateur trouvé</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôles</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.roles.map(role => (
                        <span key={role} className="badge bg-info me-1">{role}</span>
                      ))}
                    </td>
                    <td>
                      <span className={`badge ${user.actif ? 'bg-success' : 'bg-danger'}`}>
                        {user.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/utilisateurs/${user.id}`} className="btn btn-sm btn-info me-1">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/utilisateurs/${user.id}/modifier`} className="btn btn-sm btn-warning me-1">
                        <i className="fas fa-edit"></i>
                      </Link>
                      {user.actif && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          <i className="fas fa-user-slash"></i>
                        </Button>
                      )}
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

export default UserList;
