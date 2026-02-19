/**
 * @module App
 * @description Composant racine de l'application.
 * Gère le routing (navigation) entre les pages et la persistance des données utilisateurs.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';

/**
 * Composant principal de l'application.
 * Initialise l'état des utilisateurs depuis le localStorage et configure les routes.
 *
 * @component
 * @returns {JSX.Element} L'application React avec le Router et les Routes configurées.
 */
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

    // On récupère le basename depuis la variable d'environnement PUBLIC_URL
    // En local, PUBLIC_URL est vide (ou '/'). Sur GitHub Pages, c'est '/ynov-tdd-validator'
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