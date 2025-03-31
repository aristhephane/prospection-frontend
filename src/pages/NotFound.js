import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-1 text-muted">404</h1>
          <h2 className="mb-4">Page non trouvée</h2>
          <p className="lead mb-5">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button as={Link} to="/dashboard" variant="primary" size="lg">
            Retour au tableau de bord
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
