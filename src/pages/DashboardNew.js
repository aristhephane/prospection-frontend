import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Nav, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

// Composant de graphique fictif (dans une application réelle, utilisez Chart.js, Recharts ou autre)
const ChartWidget = ({ type, title, description, data }) => {
  // Simuler un composant graphique
  return (
    <Card className="shadow-sm border-0 h-100 mb-4">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        <div className="btn-group">
          <Button variant="outline-secondary" size="sm">
            <i className="fas fa-download"></i>
          </Button>
          <Button variant="outline-secondary" size="sm">
            <i className="fas fa-expand"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {description && <p className="text-muted small mb-3">{description}</p>}

        {/* Simulation du graphique (remplacer par votre lib de graphiques) */}
        <div className="chart-container" style={{ position: 'relative', height: '220px' }}>
          {type === 'bar' && (
            <div className="d-flex align-items-end justify-content-around h-100 px-4 pb-3">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="bg-primary rounded-top"
                  style={{
                    width: '40px',
                    height: `${(item.value / Math.max(...data.map(d => d.value))) * 180}px`,
                    opacity: 0.7 + (index * 0.05)
                  }}
                  title={`${item.label}: ${item.value}`}
                ></div>
              ))}
            </div>
          )}

          {type === 'line' && (
            <div className="position-relative h-100">
              <div className="position-absolute bottom-0 w-100 border-top border-gray d-flex align-items-end">
                <svg viewBox="0 0 500 200" width="100%" height="200">
                  <polyline
                    fill="none"
                    stroke="#0d6efd"
                    strokeWidth="2"
                    points={data.map((item, index) =>
                      `${(index * 500) / (data.length - 1)},${200 - (item.value / Math.max(...data.map(d => d.value))) * 180}`
                    ).join(' ')}
                  />
                </svg>
              </div>
            </div>
          )}

          {type === 'pie' && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                {data.map((item, index) => {
                  const total = data.reduce((acc, curr) => acc + curr.value, 0);
                  const startAngle = data.slice(0, index).reduce((acc, curr) => acc + curr.value, 0) / total * 360;
                  const angle = item.value / total * 360;

                  return (
                    <div
                      key={index}
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: `conic-gradient(transparent ${startAngle}deg, ${item.color} ${startAngle}deg, ${item.color} ${startAngle + angle}deg, transparent ${startAngle + angle}deg)`,
                        borderRadius: '50%'
                      }}
                      title={`${item.label}: ${Math.round(item.value / total * 100)}%`}
                    ></div>
                  );
                })}
                <div className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle" style={{ width: '120px', height: '120px' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="d-flex flex-wrap justify-content-center mt-3">
          {data.map((item, index) => (
            <div key={index} className="d-flex align-items-center me-3 mb-2">
              <div
                className="me-1"
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: item.color || (type === 'pie' ? item.color : '#0d6efd'),
                  borderRadius: '2px'
                }}
              ></div>
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

// Widget de tâches récentes
const TasksWidget = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Valider les fiches en attente', status: 'pending', priority: 'high', dueDate: '2025-04-05' },
    { id: 2, title: 'Mettre à jour les contacts entreprise', status: 'in-progress', priority: 'medium', dueDate: '2025-04-10' },
    { id: 3, title: 'Préparer le rapport mensuel', status: 'pending', priority: 'high', dueDate: '2025-04-15' },
    { id: 4, title: 'Vérifier les données de prospection', status: 'completed', priority: 'low', dueDate: '2025-04-01' }
  ]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <span className="badge bg-danger">Haute</span>;
      case 'medium': return <span className="badge bg-warning">Moyenne</span>;
      case 'low': return <span className="badge bg-info">Basse</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge bg-secondary">À faire</span>;
      case 'in-progress': return <span className="badge bg-primary">En cours</span>;
      case 'completed': return <span className="badge bg-success">Terminé</span>;
      default: return null;
    }
  };

  return (
    <Card className="shadow-sm border-0 h-100 mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">
          <i className="fas fa-tasks me-2"></i>
          Tâches à effectuer
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Tâche</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Échéance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{getPriorityBadge(task.priority)}</td>
                <td>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="btn-group">
                    <Button variant="outline-secondary" size="sm" title="Modifier">
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button variant="outline-success" size="sm" title="Marquer comme terminé">
                      <i className="fas fa-check"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="bg-white">
        <Button variant="primary" size="sm">
          <i className="fas fa-plus me-1"></i> Ajouter une tâche
        </Button>
      </Card.Footer>
    </Card>
  );
};

// Widget de notifications
const NotificationsWidget = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', message: 'Nouvelle fiche ajoutée par Marie Martin', date: '2025-04-01T09:30:00' },
    { id: 2, type: 'warning', message: 'Rappel: 3 fiches en attente de validation', date: '2025-04-01T08:15:00' },
    { id: 3, type: 'success', message: 'Rapport mensuel généré avec succès', date: '2025-03-31T16:45:00' },
    { id: 4, type: 'danger', message: 'Échec de la synchronisation des données', date: '2025-03-30T11:20:00' }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'info': return <i className="fas fa-info-circle text-primary"></i>;
      case 'warning': return <i className="fas fa-exclamation-triangle text-warning"></i>;
      case 'success': return <i className="fas fa-check-circle text-success"></i>;
      case 'danger': return <i className="fas fa-times-circle text-danger"></i>;
      default: return <i className="fas fa-bell"></i>;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMins > 0) {
      return `il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else {
      return 'à l\'instant';
    }
  };

  return (
    <Card className="shadow-sm border-0 h-100 mb-4">
      <Card.Header className="bg-white">
        <h5 className="mb-0">
          <i className="fas fa-bell me-2"></i>
          Notifications
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {notifications.map(notification => (
            <ListGroup.Item key={notification.id} className="py-3">
              <div className="d-flex">
                <div className="me-3 fs-5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <div>{notification.message}</div>
                  <small className="text-muted">{formatTime(notification.date)}</small>
                </div>
                <Button variant="link" className="p-0 text-muted">
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="bg-white text-center">
        <Button variant="link" className="text-decoration-none">
          Voir toutes les notifications
        </Button>
      </Card.Footer>
    </Card>
  );
};

// Composant principal du tableau de bord
const DashboardNew = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Données pour les graphiques
  const fichesData = [
    { label: 'Jan', value: 14, color: '#0d6efd' },
    { label: 'Fév', value: 20, color: '#0d6efd' },
    { label: 'Mar', value: 25, color: '#0d6efd' },
    { label: 'Avr', value: 18, color: '#0d6efd' },
    { label: 'Mai', value: 22, color: '#0d6efd' },
    { label: 'Juin', value: 30, color: '#0d6efd' }
  ];

  const sectorsData = [
    { label: 'Informatique', value: 35, color: '#0d6efd' },
    { label: 'Santé', value: 25, color: '#6610f2' },
    { label: 'Éducation', value: 20, color: '#6f42c1' },
    { label: 'Industrie', value: 15, color: '#d63384' },
    { label: 'Autres', value: 5, color: '#fd7e14' }
  ];

  const performanceData = [
    { label: 'Lun', value: 65, color: '#20c997' },
    { label: 'Mar', value: 72, color: '#20c997' },
    { label: 'Mer', value: 85, color: '#20c997' },
    { label: 'Jeu', value: 78, color: '#20c997' },
    { label: 'Ven', value: 90, color: '#20c997' },
    { label: 'Sam', value: 50, color: '#20c997' },
    { label: 'Dim', value: 45, color: '#20c997' }
  ];

  return (
    <Container fluid className="py-4">
      {/* En-tête du tableau de bord */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h1 className="h3 mb-0">Tableau de bord</h1>
        </Col>
        <Col xs="auto">
          <Form.Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="me-2"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </Form.Select>
        </Col>
        <Col xs="auto">
          <Button variant="outline-primary">
            <i className="fas fa-download me-1"></i>
            Exporter
          </Button>
        </Col>
      </Row>

      {/* Onglets du tableau de bord */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Vue d'ensemble
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'prospection'}
            onClick={() => setActiveTab('prospection')}
          >
            Prospection
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'performance'}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Statistiques en haut */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center mb-4 shadow-sm border-0" bg="primary" text="white">
            <Card.Body>
              <h1 className="display-4">128</h1>
              <Card.Text>Fiches totales</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-4 shadow-sm border-0" bg="success" text="white">
            <Card.Body>
              <h1 className="display-4">63</h1>
              <Card.Text>Entreprises</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-4 shadow-sm border-0" bg="info" text="white">
            <Card.Body>
              <h1 className="display-4">89%</h1>
              <Card.Text>Taux de complétion</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-4 shadow-sm border-0" bg="warning" text="white">
            <Card.Body>
              <h1 className="display-4">12</h1>
              <Card.Text>Actions en attente</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contenu du tableau de bord */}
      {activeTab === 'overview' && (
        <>
          <Row>
            <Col lg={8}>
              <ChartWidget
                type="bar"
                title="Évolution des fiches"
                description="Nombre de fiches créées par mois"
                data={fichesData}
              />
            </Col>
            <Col lg={4}>
              <ChartWidget
                type="pie"
                title="Répartition par secteur"
                description="Distribution des entreprises par secteur d'activité"
                data={sectorsData}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <TasksWidget />
            </Col>
            <Col lg={6}>
              <NotificationsWidget />
            </Col>
          </Row>
        </>
      )}

      {activeTab === 'prospection' && (
        <Alert variant="info">
          Contenu du tableau de bord de prospection en cours de développement.
        </Alert>
      )}

      {activeTab === 'performance' && (
        <>
          <Row>
            <Col lg={8}>
              <ChartWidget
                type="line"
                title="Performance hebdomadaire"
                description="Nombre de fiches traitées par jour"
                data={performanceData}
              />
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm border-0 h-100 mb-4">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Top contributeurs</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center py-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">Jean Dupont</div>
                        <div className="text-muted small">32 fiches traitées</div>
                      </div>
                      <span className="badge bg-success">+12%</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center py-3">
                      <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">Marie Martin</div>
                        <div className="text-muted small">28 fiches traitées</div>
                      </div>
                      <span className="badge bg-success">+8%</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center py-3">
                      <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">Lucas Bernard</div>
                        <div className="text-muted small">21 fiches traitées</div>
                      </div>
                      <span className="badge bg-danger">-3%</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DashboardNew; 