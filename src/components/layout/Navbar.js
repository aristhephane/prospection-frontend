import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Vérifier si l'utilisateur a le rôle admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <i className="fas fa-chart-line me-2"></i>
          Système de Prospection
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Tableau de bord</Nav.Link>
            <Nav.Link as={Link} to="/prospection">Prospection</Nav.Link>
            <Nav.Link as={Link} to="/fiches">Fiches</Nav.Link>

            {/* Afficher le menu d'administration uniquement pour les admins */}
            {isAdmin && (
              <NavDropdown title="Administration" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/utilisateurs">Gestion des utilisateurs</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/statistiques">Statistiques avancées</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={<><i className="fas fa-user me-1"></i>{user.prenom}</>} id="user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profil">Mon profil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
