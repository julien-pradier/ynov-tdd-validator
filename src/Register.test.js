import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { registerUserAPI } from './api';

// Mock de react-router-dom pour simuler useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock du module API que l'on vient de créer pour isoler le composant du réseau
jest.mock('./api');

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// Helper pour rendre le composant avec les props par défaut
const renderRegister = () => {
  const mockSetUsers = jest.fn();
  const mockUsers = [];
  return {
    ...render(<Register users={mockUsers} setUsers={mockSetUsers} />),
    mockSetUsers,
    mockUsers
  };
};

describe('Integration Tests - Inscription Form', () => {

  test('UI Initial : Le formulaire affiche tous les champs et le bouton est désactivé', () => {
    renderRegister();

    expect(screen.getByLabelText(/^Nom :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date de naissance :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Code Postal :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville :/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    expect(submitButton).toBeDisabled();
  });

  test('Soumission réussie avec appel API simulé', async () => {
    const { mockSetUsers, mockUsers } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;

    // Remplissage du formulaire
    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'john.doe@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });

    await waitFor(() => expect(submitButton).toBeEnabled());

    // Configuration de la réponse simulée de l'API (Mock)
    const mockApiResponse = {
      id: 11,
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      birthDate: `${majorYear}-01-01`,
      zipCode: '75001',
      city: 'Paris'
    };
    registerUserAPI.mockResolvedValueOnce(mockApiResponse);

    // FIX : On déclenche l'événement "submit" directement sur le formulaire via son testId
    fireEvent.submit(screen.getByTestId('register-form'));

    // 1. On vérifie que notre fausse API a bien été appelée
    await waitFor(() => {
      expect(registerUserAPI).toHaveBeenCalledTimes(1);
    });

    expect(registerUserAPI).toHaveBeenCalledWith({
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      birthDate: `${majorYear}-01-01`,
      zipCode: '75001',
      city: 'Paris'
    });

    // 2. On attend et on vérifie que setUsers a été appelé avec les données retournées par l'API
    await waitFor(() => {
      expect(mockSetUsers).toHaveBeenCalledTimes(1);
    });
    expect(mockSetUsers).toHaveBeenCalledWith([...mockUsers, mockApiResponse]);

    // 3. Vérification de la redirection vers l'accueil
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('Affiche une erreur si l\'API échoue', async () => {
    const { mockSetUsers } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;

    // Remplissage du formulaire
    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'john.doe@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });

    await waitFor(() => expect(submitButton).toBeEnabled());

    // Simulation d'une erreur API
    registerUserAPI.mockRejectedValueOnce(new Error('Network Error'));

    fireEvent.submit(screen.getByTestId('register-form'));

    // On attend que l'API soit appelée
    await waitFor(() => {
      expect(registerUserAPI).toHaveBeenCalledTimes(1);
    });

    // On vérifie que le message d'erreur s'affiche pour l'utilisateur
    await waitFor(() => {
      expect(screen.getByText('Une erreur réseau est survenue. Veuillez réessayer.')).toBeInTheDocument();
    });

    // On s'assure que setUsers n'a pas été appelé
    expect(mockSetUsers).not.toHaveBeenCalled();
  });

  test('Affiche les messages d\'erreur sous les champs lorsqu\'ils sont touchés et invalides', async () => {
    renderRegister();

    const inputs = [
      screen.getByLabelText(/^Nom :/i),
      screen.getByLabelText(/Prénom :/i),
      screen.getByLabelText(/Email :/i),
      screen.getByLabelText(/Date de naissance :/i),
      screen.getByLabelText(/Code Postal :/i),
      screen.getByLabelText(/Ville :/i)
    ];

    inputs.forEach(input => {
      fireEvent.blur(input);
    });

    await waitFor(() => {
      const errorSpans = document.querySelectorAll('span[data-cy^="error-"]');
      expect(errorSpans.length).toBeGreaterThan(0);
    });
  });

  test('Sécurité : Tentative de soumission forcée avec formulaire invalide', () => {
    const { mockSetUsers } = renderRegister();

    fireEvent.submit(screen.getByTestId('register-form'));

    expect(registerUserAPI).not.toHaveBeenCalled();
    expect(mockSetUsers).not.toHaveBeenCalled();
  });
});