import { render, screen } from '@testing-library/react';
import App from './App';

test('renders basic title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Initialisation/i);
  expect(linkElement).toBeInTheDocument();
});