import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme/theme';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';

// Mock des composants de Material-UI qui causent des problèmes
jest.mock('@mui/material/Drawer', () => {
  return function MockDrawer(props) {
    return (
      <div data-testid="drawer" style={{ width: props.open ? '240px' : '64px' }}>
        {props.children}
      </div>
    );
  };
});

// Mock du composant Routes
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Routes: ({ children }) => <div data-testid="routes-mock">{children}</div>
}));

describe('Tests de navigation', () => {
  const mockUser = {
    email: 'test@example.com',
    roles: ['ROLE_ADMINISTRATEUR'],
    typeInterface: 'administrateur'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('AdminLayout affiche le menu administrateur', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider value={{ user: mockUser, isAuthenticated: true }}>
            <AdminLayout>
              <div>Contenu test</div>
            </AdminLayout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
    expect(screen.getByText('Administration - Prospection UPJV')).toBeInTheDocument();
  });

  test('UserLayout affiche le menu utilisateur', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider value={{ user: { ...mockUser, roles: ['ROLE_USER'] }, isAuthenticated: true }}>
            <UserLayout>
              <div>Contenu test</div>
            </UserLayout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  test('Le menu peut être replié et déplié', () => {
    render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider value={{ user: mockUser, isAuthenticated: true }}>
            <AdminLayout>
              <div>Contenu test</div>
            </AdminLayout>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText('open drawer');
    fireEvent.click(toggleButton);

    // Vérifier que le menu est replié
    expect(screen.getByTestId('drawer')).toHaveStyle({ width: '64px' });
  });
}); 