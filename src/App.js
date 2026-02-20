/**
 * @module App
 * @description Composant racine de l'application.
 * Gère le routing (navigation) entre les pages et la récupération des données via API.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import { getUsersAPI } from './api';

/**
 * Composant principal de l'application.
 * Initialise l'état des utilisateurs depuis l'API et configure les routes.
 */
export default function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchInitialUsers = async () => {
            try {
                const apiUsers = await getUsersAPI();
                // JSONPlaceholder renvoie { name: "Leanne Graham" }. On l'adapte à notre format.
                const formattedUsers = apiUsers.map(user => ({
                    firstName: user.name.split(' ')[0],
                    lastName: user.name.split(' ')[1] || '',
                    email: user.email
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs", error);
                setUsers([]); // On s'assure d'avoir un tableau vide si l'API plante
            }
        };

        fetchInitialUsers();
    }, []);

    const basename = process.env.PUBLIC_URL || '/';

    return (
        <Router basename={basename}>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home users={users} />} />
                    <Route path="/register" element={<Register users={users} setUsers={setUsers} />} />
                </Routes>
            </div>
        </Router>
    );
}