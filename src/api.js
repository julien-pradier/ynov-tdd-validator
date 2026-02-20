import axios from "axios";

// Utilisation de JSONPlaceholder
const API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Envoie les données d'inscription vers notre fausse API.
 * * @param {Object} userData - Les données du formulaire
 * @returns {Promise<Object>} L'utilisateur créé avec son ID
 */
export const registerUserAPI = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Erreur réseau lors de l'inscription :", error);
        throw error;
    }
};