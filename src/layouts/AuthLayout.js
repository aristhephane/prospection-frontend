import React from 'react';
import { Box, Paper, Container } from '@mui/material';

// Layout d'authentification simplifié avec une approche centrée
const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Logo centré en haut */}
      <Box
        sx={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1
        }}
      >
        <a
          href="https://www.u-picardie.fr/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            cursor: 'pointer'
          }}
        >
          <img
            src="/images/logo_uvpj.png"
            alt="UPJV Logo"
            style={{
              height: '80px',
              width: 'auto',
              opacity: 0.8,
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
            onMouseOut={(e) => e.currentTarget.style.opacity = 0.8}
          />
        </a>
      </Box>

      {/* Conteneur principal centré */}
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          position: 'relative',
          zIndex: 2
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '450px',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Barre décorative en haut */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #e30613 0%, #1976d2 100%)'
            }}
          />

          {children}
        </Paper>
      </Container>

      {/* Cercle décoratif en arrière-plan */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(227, 6, 19, 0.08) 100%)',
          top: '-150px',
          right: '-100px',
          zIndex: 0
        }}
      />

      {/* Deuxième cercle décoratif */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(227, 6, 19, 0.08) 0%, rgba(25, 118, 210, 0.1) 100%)',
          bottom: '-50px',
          left: '-50px',
          zIndex: 0
        }}
      />

      {/* Pied de page */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '1rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: '0.875rem',
          zIndex: 1
        }}
      >
        Université de Picardie Jules Verne - Système de Prospection © {new Date().getFullYear()}
      </Box>
    </Box>
  );
};

export default AuthLayout; 