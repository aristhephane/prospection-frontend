import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import FichesList from '../pages/fiches/FichesList';
import FicheCreate from '../pages/fiches/FicheCreate';

// Mock d'axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  };
  return mockAxios;
});

describe('Tests des composants de fiches', () => {
  const mockUser = {
    email: 'test@example.com',
    roles: ['ROLE_USER'],
    typeInterface: 'utilisateur'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('FichesList affiche le message de développement', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <FichesList isAdmin={false} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Liste des fiches')).toBeInTheDocument();
    expect(screen.getByText('Fonctionnalité en cours de développement')).toBeInTheDocument();
  });

  test('FicheCreate affiche le message de développement', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <FicheCreate isAdmin={false} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Création de fiche')).toBeInTheDocument();
    expect(screen.getByText('Fonctionnalité en cours de développement')).toBeInTheDocument();
  });

  test('La création d\'une fiche envoie les bonnes données', async () => {
    const axios = require('axios');
    axios.post.mockResolvedValueOnce({ data: { id: 1, message: 'Fiche créée avec succès' } });

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <FicheCreate />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Titre/i), {
      target: { value: 'Nouvelle fiche test' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          titre: 'Nouvelle fiche test'
        })
      );
    });
  });

  test('Affiche un message d\'erreur en cas d\'échec de création', async () => {
    const axios = require('axios');
    axios.post.mockRejectedValueOnce(new Error('Erreur serveur'));

    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <FicheCreate />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Titre/i), {
      target: { value: 'Fiche avec erreur' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Créer/i }));

    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
}); 