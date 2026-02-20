import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { registerUserAPI } from './api';

// Mock de react-router-dom pour simuler useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock du module API pour isoler le composant du réseau
jest.mock('./api');

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

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

    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'john.doe@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });

    await waitFor(() => expect(submitButton).toBeEnabled());

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

    fireEvent.submit(screen.getByTestId('register-form'));

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

    await waitFor(() => {
      expect(mockSetUsers).toHaveBeenCalledTimes(1);
    });
    expect(mockSetUsers).toHaveBeenCalledWith([...mockUsers, mockApiResponse]);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('Affiche une erreur réseau générale si l\'API échoue (Erreur 500)', async () => {
    const { mockSetUsers } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;

    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'john.doe@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());

    registerUserAPI.mockRejectedValueOnce(new Error('Network Error'));

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(registerUserAPI).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Une erreur réseau est survenue. Veuillez réessayer.')).toBeInTheDocument();
    });

    expect(mockSetUsers).not.toHaveBeenCalled();
  });

  test('Affiche une erreur spécifique si l\'email existe déjà (Erreur Métier 400)', async () => {
    const { mockSetUsers } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;

    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'existant@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());

    const mockError400 = {
      response: {
        status: 400,
        data: { message: "Email already exists" }
      }
    };
    registerUserAPI.mockRejectedValueOnce(mockError400);

    fireEvent.submit(screen.getByTestId('register-form'));

    await waitFor(() => {
      expect(registerUserAPI).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Cet email existe déjà.')).toBeInTheDocument();
    });

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
      expect(screen.getByText("La ville est requise")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Date requise")).toBeInTheDocument();
    });
  });

  test('Sécurité : Tentative de soumission forcée avec formulaire invalide', () => {
    const { mockSetUsers } = renderRegister();

    fireEvent.submit(screen.getByTestId('register-form'));

    expect(registerUserAPI).not.toHaveBeenCalled();
    expect(mockSetUsers).not.toHaveBeenCalled();
  });
});