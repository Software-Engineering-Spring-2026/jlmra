import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the student dashboard by default', () => {
  render(<App />);
  expect(screen.getByText(/welcome back, lina/i)).toBeInTheDocument();
});
