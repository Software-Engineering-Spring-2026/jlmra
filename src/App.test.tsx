import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login account chooser', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /choose an account/i })).toBeInTheDocument();
});
