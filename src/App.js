import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';

export default function App() {
    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('users');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
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

    // On récupère le basename depuis la variable d'environnement PUBLIC_URL
    const basename = process.env.PUBLIC_URL || '/';

    return (
        <Router basename={basename}>
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