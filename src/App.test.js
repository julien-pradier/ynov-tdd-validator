import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { getUsersAPI } from './api';

jest.mock('./Home', () => ({ users }) => <div data-testid="home-page">Page d'accueil - {users.length} users</div>);
jest.mock('./Register', () => () => <div data-testid="register-page">Page d'inscription</div>);

jest.mock('./api');

describe('App Navigation & Data Loading', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Charge les utilisateurs depuis l\'API au démarrage', async () => {
    getUsersAPI.mockResolvedValueOnce([
      { name: 'John Doe', email: 'john@test.com' },
      { name: 'Zendaya', email: 'zendaya@test.com' }
    ]);

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Page d'accueil - 2 users")).toBeInTheDocument();
    });

    expect(getUsersAPI).toHaveBeenCalledTimes(1);
  });

  test('Gère le cas où l\'API échoue (affiche 0 utilisateur)', async () => {
    getUsersAPI.mockRejectedValueOnce(new Error("Network Error"));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Page d'accueil - 0 users")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('Navigue vers la page d\'inscription', async () => {
    getUsersAPI.mockResolvedValueOnce([]);

    window.history.pushState({}, 'Register', '/register');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });

});