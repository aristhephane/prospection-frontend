import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const FicheHistory = ({ isAdmin }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Historique des fiches
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>Fonctionnalité en cours de développement</Typography>
      </Paper>
    </Box>
  );
};

export default FicheHistory;
