import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// Layout
import AuthLayout from '../../layouts/AuthLayout';

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
      const success = await login({ email, password });
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
    <AuthLayout>
      <Avatar sx={{
        bgcolor: '#e30613',
        width: 60,
        height: 60,
        mb: 2
      }}>
        <LockOutlinedIcon sx={{ fontSize: 30 }} />
      </Avatar>

      <Typography
        component="h1"
        variant="h5"
        sx={{
          fontSize: { xs: '1.3rem', sm: '1.4rem' },
          fontWeight: 600,
          textAlign: 'center',
          mb: 3
        }}
      >
        Connexion à la Plateforme de Gestion de Prospection
      </Typography>

      {formError && (
        <Alert
          severity="error"
          sx={{
            width: '100%',
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {formError}
        </Alert>
      )}

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          mt: 1
        }}
      >
        <TextField
          margin="normal"
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
          sx={{ mb: 2 }}
        />
        <TextField
          margin="normal"
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
          sx={{ mb: 3 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            mt: 1,
            mb: 2,
            bgcolor: '#e30613',
            '&:hover': {
              bgcolor: '#c30000',
            },
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Se connecter'
          )}
        </Button>
      </Box>
    </AuthLayout>
  );
} 