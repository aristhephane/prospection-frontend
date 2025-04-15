import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  IconButton
} from '@mui/material';
import {
  Business as BusinessIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Search as SearchIcon,
  ImportExport as ExportIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  KeyboardArrowRight as ArrowIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrement des composants ChartJS nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFiches: 0,
    newFiches: 0,
    pendingFiches: 0,
    completedFiches: 0,
    percentChange: 0
  });
  const [recentFiches, setRecentFiches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données du tableau de bord
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En situation réelle, ces appels seraient à l'API
        // Ici nous simulons les réponses pour le prototype

        // Simulation des stats
        const statsData = {
          totalFiches: 235,
          newFiches: 18,
          pendingFiches: 47,
          completedFiches: 170,
          percentChange: 12.5
        };
        setStats(statsData);

        // Simulation des fiches récentes
        const recentFichesData = [
          { id: 1, nom: 'Entreprise ABC', date: '2023-04-10', statut: 'Nouveau' },
          { id: 2, nom: 'Société XYZ', date: '2023-04-08', statut: 'Contacté' },
          { id: 3, nom: 'Compagnie 123', date: '2023-04-05', statut: 'Prospect' },
          { id: 4, nom: 'Établissement DEF', date: '2023-04-02', statut: 'Client' },
          { id: 5, nom: 'Groupe EFG', date: '2023-03-29', statut: 'Prospect' }
        ];
        setRecentFiches(recentFichesData);

        // Simulation des notifications
        const notificationsData = [
          { id: 1, message: 'Nouvelle fiche ajoutée', date: '2023-04-10 15:30', read: false },
          { id: 2, message: 'Rappel: Contacter Entreprise XYZ', date: '2023-04-10 10:15', read: false },
          { id: 3, message: 'Fiche mise à jour par Jean Dupont', date: '2023-04-09 16:45', read: true },
          { id: 4, message: 'Nouvel export disponible', date: '2023-04-08 11:20', read: true }
        ];
        setNotifications(notificationsData);

        // Données pour le graphique
        const chartDataResponse = {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [
            {
              label: 'Fiches créées',
              data: [12, 19, 15, 22, 24, 18],
              backgroundColor: 'rgba(25, 118, 210, 0.8)',
            },
            {
              label: 'Fiches converties',
              data: [8, 12, 10, 15, 17, 10],
              backgroundColor: 'rgba(76, 175, 80, 0.8)',
            }
          ]
        };
        setChartData(chartDataResponse);

      } catch (error) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activité de prospection',
      },
    },
  };

  // Formatage des dates pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total fiches
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalFiches}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {stats.percentChange >= 0 ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    ml: 0.5,
                    color: stats.percentChange >= 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {Math.abs(stats.percentChange)}% vs mois dernier
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography color="inherit" gutterBottom>
                Nouvelles fiches
              </Typography>
              <Typography variant="h4" component="div" color="inherit">
                {stats.newFiches}
              </Typography>
              <Button
                size="small"
                color="inherit"
                endIcon={<ArrowIcon />}
                sx={{ mt: 1 }}
                onClick={() => navigate('/fiches/new')}
              >
                Ajouter
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fiches en attente
              </Typography>
              <Typography variant="h4" component="div">
                {stats.pendingFiches}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                sx={{ mt: 1 }}
                onClick={() => navigate('/fiches?statut=pending')}
              >
                Voir les fiches
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fiches complétées
              </Typography>
              <Typography variant="h4" component="div">
                {stats.completedFiches}
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                sx={{ mt: 1 }}
                onClick={() => navigate('/fiches?statut=completed')}
              >
                Voir les fiches
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques et listes */}
      <Grid container spacing={3}>
        {/* Graphique d'activité */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Évolution des fiches</Typography>
              <IconButton size="small">
                <MoreIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: 320 }}>
              <Bar options={chartOptions} data={chartData} height={320} />
            </Box>
          </Paper>
        </Grid>

        {/* Actions rapides */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Actions rapides
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              <ListItem
                button
                onClick={() => navigate('/fiches/new')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon>
                  <AddIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Nouvelle fiche" />
                <ArrowIcon fontSize="small" color="action" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/recherche')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon>
                  <SearchIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Recherche avancée" />
                <ArrowIcon fontSize="small" color="action" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/export')}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon>
                  <ExportIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Export de données" />
                <ArrowIcon fontSize="small" color="action" />
              </ListItem>

              <ListItem
                button
                onClick={() => navigate('/notifications')}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Voir les notifications" />
                <ArrowIcon fontSize="small" color="action" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Fiches récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Fiches récentes</Typography>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/fiches')}
              >
                Voir toutes
              </Button>
            </Box>
            <List>
              {recentFiches.map((fiche) => (
                <ListItem
                  key={fiche.id}
                  button
                  onClick={() => navigate(`/fiches/${fiche.id}`)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={fiche.nom}
                    secondary={`${formatDate(fiche.date)} - ${fiche.statut}`}
                  />
                  <IconButton size="small">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Notifications</Typography>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/notifications')}
              >
                Tout marquer comme lu
              </Button>
            </Box>
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: notification.read ? 'transparent' : 'action.hover'
                  }}
                >
                  <ListItemIcon>
                    {notification.read ? (
                      <NotificationsIcon />
                    ) : (
                      <NotificationsIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.date}
                  />
                  <IconButton size="small">
                    <ScheduleIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
