import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import Login from '../pages/auth/Login';
import { AuthProvider } from '../contexts/AuthContext';

// Mock du localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock d'axios
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    post: jest.fn(),
    get: jest.fn(),
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

describe('Tests d\'authentification', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {component}
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('affiche le formulaire de connexion correctement', () => {
    renderWithProviders(<Login />);

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
  });

  test('affiche une erreur pour un email invalide', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'email-invalide' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
    });
  });

  test('affiche une erreur pour un mot de passe trop court', async () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/mot de passe doit contenir au moins/i)).toBeInTheDocument();
    });
  });
}); 