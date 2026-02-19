import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Helper pour rendre le composant avec le Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {

  test('Affiche le titre et le bouton d\'inscription', () => {
    renderWithRouter(<Home users={[]} />);

    expect(screen.getByText(/Bienvenue sur notre application/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aller s'inscrire/i })).toBeInTheDocument();
  });

  test('Affiche 0 utilisateur inscrit par défaut', () => {
    renderWithRouter(<Home users={[]} />);

    expect(screen.getByText(/0 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('Affiche la liste des utilisateurs quand il y en a', () => {
    const mockUsers = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' }
    ];

    renderWithRouter(<Home users={mockUsers} />);

    expect(screen.getByText(/2 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    
    // Vérifie que la liste est présente
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    // Vérifie que les utilisateurs sont affichés
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

});
