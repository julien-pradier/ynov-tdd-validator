import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ users }) {
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Bienvenue sur notre application</h1>

            {/* Le compteur exact demandé par le prof et Cypress */}
            <h2 data-cy="counter">{users.length} utilisateur(s) inscrit(s)</h2>

            {/* La liste des inscrits */}
            {users.length > 0 && (
                <ul data-cy="user-list" style={{ listStyleType: 'none', padding: 0 }}>
                    {users.map((user, index) => (
                        <li key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                            {user.firstName} {user.lastName}
                        </li>
                    ))}
                </ul>
            )}

            {/* Bouton pour aller s'inscrire */}
            <div style={{ marginTop: '30px' }}>
                <Link to="/register">
                    <button data-cy="nav-register" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Aller s'inscrire
                    </button>
                </Link>
            </div>
        </div>
    );
}