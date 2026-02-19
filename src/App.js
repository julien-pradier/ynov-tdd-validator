import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';

export default function App() {
    // L'état stocke désormais un TABLEAU d'utilisateurs
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('users');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // On s'assure que c'est bien un tableau (au cas où votre ancien localStorage stockait un objet simple)
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    // Sauvegarde automatique à chaque ajout d'utilisateur
    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users));
    }, [users]);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Page d'Accueil */}
                    <Route path="/" element={<Home users={users} />} />

                    {/* Page Formulaire */}
                    <Route path="/register" element={<Register users={users} setUsers={setUsers} />} />
                </Routes>
            </div>
        </Router>
    );
}