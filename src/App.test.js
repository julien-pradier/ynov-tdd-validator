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

  test('Charge les utilisateurs depuis l\'API au démarrage (avec format nom/prenom)', async () => {
    // On mock le nouveau format attendu depuis l'API Python
    getUsersAPI.mockResolvedValueOnce([
      { nom: 'Doe', prenom: 'John', email: 'john@test.com' },
      { name: 'Smith', firstName: 'Jane', email: 'jane@test.com' }, // Supporte l'anglais aussi
      { nom: 'Zendaya', email: 'zendaya@test.com' }, // Gère le cas sans prénom
      { prenom: 'Cher', email: 'cher@test.com' }, // Gère le cas sans nom de famille
      { email: 'anonymous@test.com' } // Gère le cas sans nom ni prénom
    ]);

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Page d'accueil - 5 users")).toBeInTheDocument();
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
