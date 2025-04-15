import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, user }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Détermine si l'utilisateur est administrateur
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  // Ferme le sidebar sur mobile et lors des changements de route
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  // Ferme le menu sur mobile lors d'un changement de route
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Barre de navigation supérieure */}
      <Header
        toggleSidebar={toggleSidebar}
        user={user}
        isAdmin={isAdmin}
      />

      {/* Sidebar de navigation */}
      <Sidebar
        isOpen={open}
        onClose={toggleSidebar}
        isAdmin={isAdmin}
      />

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? 240 : 0}px)` },
          ml: { sm: open ? '240px' : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Espace pour la barre de navigation fixe */}
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 