import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Vérifier les rôles et permissions de l'utilisateur
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_INFORMATIQUE');
  const canWrite = user?.roles?.some(role => ['ROLE_ADMIN', 'ROLE_INFORMATIQUE', 'ROLE_SERVICE_PROSPECTION', 'ROLE_SECRETARIAT'].includes(role));
  const canViewReports = user?.roles?.some(role => ['ROLE_ADMIN', 'ROLE_INFORMATIQUE', 'ROLE_SERVICE_PROSPECTION', 'ROLE_RESPONSABLE_FORMATION', 'ROLE_DIRECTION', 'ROLE_ORIENTATION', 'ROLE_ENSEIGNANT'].includes(role));

  // Déterminer si un lien est actif
  const isLinkActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Notifications factices
  const notificationCount = 3;

  return (
    <>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container fluid>
          <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <i className="fas fa-chart-line fs-4 me-2"></i>
            <span className="d-none d-md-inline">Système de Prospection</span>
            <span className="d-inline d-md-none">SP</span>
          </BootstrapNavbar.Brand>

          <div className="d-flex align-items-center order-lg-last">
            {/* Icône de notification (visible sur tous les écrans) */}
            <div className="position-relative me-3">
              <Link to="/notifications" className="nav-link text-white">
                <i className="fas fa-bell fs-5"></i>
                {notificationCount > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{ fontSize: '0.6rem', padding: '0.25rem 0.4rem' }}
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Link>
            </div>

            {/* Menu utilisateur (visible sur tous les écrans) */}
            {user ? (
              <NavDropdown
                title={
                  <div className="d-inline-block">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-1"
                      style={{ width: '32px', height: '32px', display: 'inline-flex' }}>
                      <i className="fas fa-user"></i>
                    </div>
                    <span className="d-none d-md-inline ms-1">{user.prenom}</span>
                  </div>
                }
                id="user-dropdown"
                align="end"
                className="me-2"
              >
                <NavDropdown.Item as={Link} to="/profil">
                  <i className="fas fa-user-circle me-2"></i>
                  Mon profil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/notifications">
                  <i className="fas fa-bell me-2"></i>
                  Notifications
                  {notificationCount > 0 && (
                    <Badge bg="danger" className="ms-2">{notificationCount}</Badge>
                  )}
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/preferences">
                  <i className="fas fa-cog me-2"></i>
                  Préférences
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button as={Link} to="/login" variant="outline-light" size="sm" className="me-2">
                <i className="fas fa-sign-in-alt me-1"></i>
                Connexion
              </Button>
            )}

            <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
          </div>

          <BootstrapNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className={isLinkActive('/')}>
                <i className="fas fa-home me-1"></i>
                Accueil
              </Nav.Link>

              <Nav.Link as={Link} to="/dashboard" className={isLinkActive('/dashboard')}>
                <i className="fas fa-tachometer-alt me-1"></i>
                Tableau de bord
              </Nav.Link>

              {/* Menu Gestion des fiches */}
              <NavDropdown
                title={
                  <span>
                    <i className="fas fa-folder-open me-1"></i>
                    Gestion des fiches
                  </span>
                }
                id="fiches-dropdown"
                active={location.pathname.includes('/fiches')}
              >
                <NavDropdown.Item as={Link} to="/fiches">
                  <i className="fas fa-list me-2"></i>
                  Consulter les fiches
                </NavDropdown.Item>
                {canWrite && (
                  <NavDropdown.Item as={Link} to="/fiches/ajouter">
                    <i className="fas fa-plus-circle me-2"></i>
                    Créer une fiche
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/prospection">
                  <i className="fas fa-search me-2"></i>
                  Liste de prospection
                </NavDropdown.Item>
              </NavDropdown>

              {/* Menu Rapports accessible uniquement aux utilisateurs avec la permission */}
              {canViewReports && (
                <NavDropdown
                  title={
                    <span>
                      <i className="fas fa-chart-bar me-1"></i>
                      Rapports
                    </span>
                  }
                  id="rapports-dropdown"
                  active={location.pathname.includes('/rapports')}
                >
                  <NavDropdown.Item as={Link} to="/rapports">
                    <i className="fas fa-file-alt me-2"></i>
                    Générer un rapport
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/rapports/export">
                    <i className="fas fa-file-export me-2"></i>
                    Exporter les données
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/rapports/stats">
                    <i className="fas fa-chart-pie me-2"></i>
                    Statistiques
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* Menu d'administration uniquement pour les admins */}
              {isAdmin && (
                <NavDropdown
                  title={
                    <span>
                      <i className="fas fa-cogs me-1"></i>
                      Administration
                    </span>
                  }
                  id="admin-dropdown"
                  active={location.pathname.includes('/admin') || location.pathname.includes('/utilisateurs') || location.pathname.includes('/systeme')}
                >
                  <NavDropdown.Item as={Link} to="/utilisateurs">
                    <i className="fas fa-users me-2"></i>
                    Gestion des utilisateurs
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/roles">
                    <i className="fas fa-user-tag me-2"></i>
                    Gestion des rôles
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/systeme/sauvegarde">
                    <i className="fas fa-database me-2"></i>
                    Sauvegarde & Restauration
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/systeme/configuration">
                    <i className="fas fa-sliders-h me-2"></i>
                    Configuration du système
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/admin">
                    <i className="fas fa-shield-alt me-2"></i>
                    Tableau de bord admin
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            {/* Formulaire de recherche */}
            <Form className="d-flex mt-2 mt-lg-0" onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Recherche..."
                  aria-label="Recherche"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline-light" type="submit">
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup>
            </Form>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Sous-menu contextuel basé sur la section actuelle */}
      {location.pathname.includes('/fiches') && (
        <div className="bg-light py-2 border-bottom">
          <Container fluid>
            <Nav className="secondary-nav">
              <Nav.Link as={Link} to="/fiches" className={isLinkActive('/fiches') ? 'active fw-bold' : ''}>
                Toutes les fiches
              </Nav.Link>
              {canWrite && (
                <Nav.Link as={Link} to="/fiches/ajouter" className={isLinkActive('/fiches/ajouter') ? 'active fw-bold' : ''}>
                  Nouvelle fiche
                </Nav.Link>
              )}
              <Nav.Link as={Link} to="/fiches/recentes" className={isLinkActive('/fiches/recentes') ? 'active fw-bold' : ''}>
                Récemment modifiées
              </Nav.Link>
              <Nav.Link as={Link} to="/fiches/validees" className={isLinkActive('/fiches/validees') ? 'active fw-bold' : ''}>
                Fiches validées
              </Nav.Link>
              <Nav.Link as={Link} to="/fiches/attente" className={isLinkActive('/fiches/attente') ? 'active fw-bold' : ''}>
                En attente
              </Nav.Link>
            </Nav>
          </Container>
        </div>
      )}

      {/* Styles CSS pour le navbar */}
      <style jsx>{`
        .navbar-custom {
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .nav-link.active {
          font-weight: 500;
        }
        .secondary-nav .nav-link {
          color: #495057;
          padding: 0.25rem 1rem;
          font-size: 0.9rem;
        }
        .secondary-nav .nav-link:hover {
          color: #0d6efd;
        }
        .secondary-nav .nav-link.active {
          color: #0d6efd;
          position: relative;
        }
        .secondary-nav .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 1rem;
          right: 1rem;
          height: 2px;
          background-color: #0d6efd;
        }
      `}</style>
    </>
  );
};

export default Navbar;
