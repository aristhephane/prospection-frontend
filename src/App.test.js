import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('affiche le message de chargement initial', () => {
  render(<App />);
  const loadingText = screen.getByText(/Chargement en cours/i);
  expect(loadingText).toBeInTheDocument();
});
