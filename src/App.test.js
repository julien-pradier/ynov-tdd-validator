import { render, screen } from '@testing-library/react';
import App from './App';

// On mocke les composants enfants pour ne tester que la navigation
// On leur passe les props pour vérifier qu'elles sont bien transmises
jest.mock('./Home', () => ({ users }) => <div data-testid="home-page">Page d'accueil - {users.length} users</div>);
jest.mock('./Register', () => () => <div data-testid="register-page">Page d'inscription</div>);

describe('App Navigation & Data Loading', () => {
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Affiche la page d\'accueil par défaut', () => {
    window.history.pushState({}, 'Home', '/');
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('Navigue vers la page d\'inscription', () => {
    window.history.pushState({}, 'Register', '/register');
    render(<App />);
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('Charge les utilisateurs depuis le localStorage au démarrage', () => {
    // On prépare des données dans le localStorage
    const mockUsers = [{ firstName: 'John', lastName: 'Doe' }];
    localStorage.setItem('users', JSON.stringify(mockUsers));

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    // On vérifie que le composant Home a bien reçu les données (via le texte mocké)
    expect(screen.getByText('Page d\'accueil - 1 users')).toBeInTheDocument();
  });

  test('Gère le cas où le localStorage est vide ou invalide', () => {
    localStorage.setItem('users', 'invalid-json');
    
    // On spy console.error pour éviter de polluer la sortie du test (optionnel)
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    // Si le JSON est invalide, on s'attend à avoir 0 utilisateur (tableau vide par défaut)
    expect(screen.getByText('Page d\'accueil - 0 users')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('Gère le cas où le localStorage contient un JSON valide mais pas un tableau', () => {
    // On met un objet simple au lieu d'un tableau
    localStorage.setItem('users', JSON.stringify({ some: 'object' }));

    window.history.pushState({}, 'Home', '/');
    render(<App />);

    // On s'attend à ce que l'application ignore cet objet et initialise un tableau vide
    expect(screen.getByText('Page d\'accueil - 0 users')).toBeInTheDocument();
  });

});
