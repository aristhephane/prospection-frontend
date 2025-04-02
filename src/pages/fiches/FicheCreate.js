import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const FicheCreate = ({ isAdmin }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'Administration - ' : ''}Création de fiche
      </Typography>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography>Fonctionnalité en cours de développement</Typography>
      </Paper>
    </Box>
  );
};

export default FicheCreate;
