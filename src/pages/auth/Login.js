import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, location]);

  // Utiliser l'erreur d'authentification si elle existe
  useEffect(() => {
    if (authError) {
      setFormError(authError);
    }
  }, [authError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation basique du formulaire
    if (!email) {
      setFormError('L\'adresse email est requise');
      return;
    }

    if (!password) {
      setFormError('Le mot de passe est requis');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const success = await login(email, password);
      if (success) {
        // La redirection sera gérée par l'effet useEffect ci-dessus
      }
    } catch (error) {
      setFormError('Une erreur est survenue lors de la connexion');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/images/upjv-campus.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', sm: 'block' }
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box sx={{ mb: 4, width: '100%', textAlign: 'center' }}>
            <img
              src="/images/logo_uvpj.png"
              alt="UPJV Logo"
              style={{ height: '80px', width: 'auto' }}
            />
          </Box>
          <Avatar sx={{ m: 1, bgcolor: '#e30613' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{
            fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.75rem' },
            textAlign: 'center',
            mb: 3
          }}>
            Connexion à la Plateforme de Prospection
          </Typography>
          {formError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                bgcolor: '#e30613',
                '&:hover': {
                  bgcolor: '#c30000',
                },
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Se connecter'
              )}
            </Button>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Université de Picardie Jules Verne - Système de Prospection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                © {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
} 