import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <Container>
        <Row className="mb-3">
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Système de Prospection</h5>
            <p className="small text-muted text-white-50">
              Plateforme de gestion de prospection développée pour l'UPJV.
              Optimisez vos processus et suivez efficacement vos actions de développement.
            </p>
          </Col>

          <Col lg={2} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Liens rapides</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-home me-2"></i>Accueil
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-tachometer-alt me-2"></i>Tableau de bord
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/fiches" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-folder-open me-2"></i>Fiches
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/rapports" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-chart-bar me-2"></i>Rapports
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Ressources</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-book me-2"></i>Documentation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-question-circle me-2"></i>FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-video me-2"></i>Tutoriels
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  <i className="fas fa-file-alt me-2"></i>Termes et conditions
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-3">Contact</h5>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50">
                <i className="fas fa-map-marker-alt me-2"></i>
                Université de Picardie Jules Verne<br />
                <span className="ms-4">Amiens, France</span>
              </li>
              <li className="mb-2 text-white-50">
                <i className="fas fa-envelope me-2"></i>
                contact@upjv-prospection.fr
              </li>
              <li className="mb-2 text-white-50">
                <i className="fas fa-phone me-2"></i>
                +33 (0)3 22 82 89 00
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-3 bg-secondary" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="small text-muted mb-0">
              &copy; {currentYear} UPJV Prospection. Tous droits réservés.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-white-50 hover-white">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white-50 hover-white">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white-50 hover-white">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-white-50 hover-white">
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hover-white:hover {
          color: white !important;
          transition: color 0.3s ease;
        }
        .footer {
          box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
