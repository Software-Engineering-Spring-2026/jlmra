import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the BridgeBoard prototype title', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /bridgeboard/i })
  ).toBeInTheDocument();
});
