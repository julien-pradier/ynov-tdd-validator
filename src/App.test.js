import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('Integration Tests - Inscription Form', () => {

  test('UI Initial : Le formulaire affiche tous les champs et le bouton est désactivé', () => {
    render(<App />);

    expect(screen.getByLabelText(/^Nom :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email :/i)).toBeInTheDocument();
    
    // Vérification du champ Date de naissance (Label FR et type date)
    const dateInput = screen.getByLabelText(/Date de naissance :/i);
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('type', 'date');

    expect(screen.getByLabelText(/Code Postal :/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ville :/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    expect(submitButton).toBeDisabled();
  });

  test('Scénario Utilisateur : Saisie invalide -> Correction -> Re-saisie invalide', async () => {
    render(<App />);

    const emailInput = screen.getByLabelText(/Email :/i);
    const submitButton = screen.getByRole('button', { name: /Envoyer/i });

    fireEvent.change(emailInput, { target: { value: 'pas-un-email' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/L'email doit être valide/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@ynov.com' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText(/L'email doit être valide/i)).not.toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/L'email doit être valide/i)).toBeInTheDocument();
  });

  test('Validation complète : Couverture de tous les cas d\'erreur', () => {
    render(<App />);

    // Nom Invalide
    const nameInput = screen.getByLabelText(/^Nom :/i);
    fireEvent.change(nameInput, { target: { value: '123' } });
    fireEvent.blur(nameInput);
    expect(screen.getByText(/Le nom ne doit contenir que des lettres/i)).toBeInTheDocument();

    // Prénom Invalide
    const firstNameInput = screen.getByLabelText(/Prénom :/i);
    fireEvent.change(firstNameInput, { target: { value: '123' } });
    fireEvent.blur(firstNameInput);
    const errorMessages = screen.getAllByText(/Le nom ne doit contenir que des lettres/i);
    expect(errorMessages.length).toBeGreaterThan(0);

    // Date Requise (Vérification du message en français)
    const dateInput = screen.getByLabelText(/Date de naissance :/i);
    fireEvent.focus(dateInput);
    fireEvent.blur(dateInput);
    expect(screen.getByText(/Date requise/i)).toBeInTheDocument();

    // Date Mineur
    const today = new Date();
    const minorYear = today.getFullYear() - 10;
    fireEvent.change(dateInput, { target: { value: `${minorYear}-01-01` } });
    fireEvent.blur(dateInput);
    expect(screen.getByText(/Vous devez être majeur/i)).toBeInTheDocument();

    // Code Postal Lettres
    const zipInput = screen.getByLabelText(/Code Postal :/i);
    fireEvent.change(zipInput, { target: { value: '7500A' } });
    fireEvent.blur(zipInput);
    expect(screen.getByText(/ne doit contenir que des chiffres/i)).toBeInTheDocument();

    // Ville Invalide
    const cityInput = screen.getByLabelText(/Ville :/i);
    fireEvent.change(cityInput, { target: { value: 'Paris12' } });
    fireEvent.blur(cityInput);
    expect(screen.getAllByText(/Le nom ne doit contenir que des lettres/i).length).toBeGreaterThan(0);
  });

  test('Soumission valide et Spy sur localStorage', async () => {
    render(<App />);
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const majorYear = new Date().getFullYear() - 20;

    fireEvent.change(screen.getByLabelText(/^Nom :/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Prénom :/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Email :/i), { target: { value: 'john.doe@test.com' } });
    fireEvent.change(screen.getByLabelText(/Date de naissance :/i), { target: { value: `${majorYear}-01-01` } });
    fireEvent.change(screen.getByLabelText(/Code Postal :/i), { target: { value: '75001' } });
    fireEvent.change(screen.getByLabelText(/Ville :/i), { target: { value: 'Paris' } });

    const submitButton = screen.getByRole('button', { name: /Envoyer/i });
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith('user_data', JSON.stringify({
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      birthDate: `${majorYear}-01-01`,
      zipCode: '75001',
      city: 'Paris'
    }));

    expect(screen.getByText(/Formulaire sauvegardé avec succès/i)).toBeInTheDocument();

    // Vérification du reset
    expect(screen.getByLabelText(/^Nom :/i).value).toBe('');
  });

  test('Sécurité : Tentative de soumission forcée avec formulaire invalide', () => {
    render(<App />);
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // On force la soumission du formulaire directement (bypassing le bouton disabled)
    const form = screen.getByRole('button', { name: /Envoyer/i }).closest('form');

    fireEvent.submit(form);

    // Comme le formulaire est invalide (vide), localStorage ne doit PAS être appelé
    expect(setItemSpy).not.toHaveBeenCalled();
  });
});