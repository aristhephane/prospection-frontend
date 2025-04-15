import { createTheme } from '@mui/material/styles';

// Palette de couleurs principale
const primaryColor = '#1976d2'; // Bleu primaire
const secondaryColor = '#f50057'; // Rose secondaire
const successColor = '#4caf50'; // Vert pour succès
const warningColor = '#ff9800'; // Orange pour avertissement
const errorColor = '#f44336'; // Rouge pour erreur
const infoColor = '#2196f3'; // Bleu clair pour info

// Création du thème
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#4791db',
      dark: '#115293',
      contrastText: '#fff',
    },
    secondary: {
      main: secondaryColor,
      light: '#f73378',
      dark: '#ab003c',
      contrastText: '#fff',
    },
    success: {
      main: successColor,
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#fff',
    },
    warning: {
      main: warningColor,
      light: '#ffb74d',
      dark: '#c66900',
      contrastText: '#fff',
    },
    error: {
      main: errorColor,
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    info: {
      main: infoColor,
      light: '#64b5f6',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme; 