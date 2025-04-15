import React from 'react';
import { Typography, Paper, Grid, Card, CardContent, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Bienvenue, {user?.prenom} {user?.nom}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Activité récente
              </Typography>
              <Typography variant="h5" component="div">
                0
              </Typography>
              <Typography variant="body2">
                Modifications aujourd'hui
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Notifications
              </Typography>
              <Typography variant="h5" component="div">
                0
              </Typography>
              <Typography variant="body2">
                Notifications en attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Accès rapides
              </Typography>
              <Typography variant="body2">
                Fiches récentes, rapports...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations
        </Typography>
        <Typography variant="body2">
          Application: Prospection UPJV (Version 2.0)
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserDashboard;
