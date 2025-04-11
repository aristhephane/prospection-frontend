import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const AppSettings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paramètres de l'application
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>Fonctionnalité en cours de développement</Typography>
      </Paper>
    </Box>
  );
};

export default AppSettings;
