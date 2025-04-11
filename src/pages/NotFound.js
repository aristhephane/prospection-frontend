import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  const isAdmin = user?.typeInterface === 'administrateur';
  const homePath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Page non trouvée
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </Typography>
      <Button
        component={Link}
        to={homePath}
        variant="contained"
        color="primary"
        size="large"
      >
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default NotFound;
