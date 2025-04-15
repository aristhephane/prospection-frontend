import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../contexts/AuthContext';
import { formatDate, validateEmail, validatePassword } from '../utils/validation';

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

describe('Tests des utilitaires', () => {
  test('formatDate formate correctement les dates', () => {
    const date = '2024-04-03T14:30:00';
    expect(formatDate(date)).toBe('03/04/2024');
  });

  test('validateEmail valide correctement les adresses email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('validatePassword valide correctement les mots de passe', () => {
    expect(validatePassword('Password123!')).toBe(true);
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});

describe('Tests des hooks personnalisés', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  test('useAuth fournit les bonnes valeurs par défaut', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Attendre que le hook termine son initialisation
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('useAuth gère correctement la déconnexion', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Attendre que le hook termine son initialisation
      await new Promise(resolve => setTimeout(resolve, 0));
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
}); 