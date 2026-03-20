import axios from "axios";

const port = process.env.REACT_APP_SERVER_PORT || 8000;

const API_URL = `http://${window.location.hostname}:${port}`;

/**
 * Envoie les données d'inscription vers notre API Python.
 * @param {Object} userData - Les données du formulaire
 * @returns {Promise<Object>} L'utilisateur créé
 */
export const registerUserAPI = async (userData) => {
    const payload = {
        name: userData.lastName,   // ← renommage du champ
        firstName: userData.firstName,
        email: userData.email,
        birthDate: userData.birthDate,
        // zipCode et city sont ignorés par l'API (pas dans UserCreate)
    };

    try {
        const response = await axios.post(`${API_URL}/users`, payload);
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            console.error("Détail 422 :", JSON.stringify(error.response.data.detail, null, 2));
        }
        throw error;
    }
};

/**
 * Récupère la liste des utilisateurs depuis notre API Python au démarrage.
 * @returns {Promise<Array>} La liste des utilisateurs
 */
export const getUsersAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        // On traduit "name" du back vers "lastName" pour que Home.js l'affiche correctement
        return response.data.utilisateurs.map(user => ({
            ...user,
            lastName: user.name
        }));
    } catch (error) {
        console.error("Erreur réseau lors de la récupération des utilisateurs :", error);
        throw error;
    }
};

/**
 * Connecte un utilisateur (admin) et récupère le token JWT.
 * @param {string} email - L'email de l'administrateur
 * @param {string} password - Le mot de passe de l'administrateur
 * @returns {Promise<string>} Le token JWT
 */
export const loginAPI = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        // On retourne uniquement le token depuis l'objet { token: "..." }
        return response.data.token;
    } catch (error) {
        console.error("Erreur réseau lors de la connexion :", error);
        throw error;
    }
};
